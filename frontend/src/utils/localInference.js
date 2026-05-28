import * as ort from 'onnxruntime-web'

// Configure WASM paths to load from jsdelivr CDN (cached by Service Worker for offline use)
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/'
ort.env.wasm.numThreads = 1

let session = null

/**
 * Load the YOLO ONNX model from static assets.
 */
export async function loadModel() {
  if (session) return session
  try {
    // Note: in Django + Vite, compiled public assets sit at /static/models/best.onnx
    session = await ort.InferenceSession.create('/static/models/best.onnx', {
      executionProviders: ['wasm'], // Use WASM which is highly compatible on mobile browsers
    })
    console.log('Local AI Model loaded successfully!')
    return session
  } catch (error) {
    console.error('Failed to load local ONNX model:', error)
    throw error
  }
}

/**
 * Preprocess image/canvas to Float32Array [1, 3, 640, 640]
 */
function preprocess(imageEl, targetWidth, targetHeight) {
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageEl, 0, 0, targetWidth, targetHeight)
  
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight)
  const { data } = imgData // RGBA flat array
  
  const numPixels = targetWidth * targetHeight
  const float32Array = new Float32Array(3 * numPixels)
  
  // Planar format: RRR... GGG... BBB...
  for (let i = 0; i < numPixels; i++) {
    float32Array[i] = data[i * 4] / 255.0                 // R
    float32Array[numPixels + i] = data[i * 4 + 1] / 255.0     // G
    float32Array[2 * numPixels + i] = data[i * 4 + 2] / 255.0   // B
  }
  
  return float32Array
}

/**
 * Intersection over Union (IoU) between two boxes
 */
function iou(boxA, boxB) {
  const xA = Math.max(boxA[0], boxB[0])
  const yA = Math.max(boxA[1], boxB[1])
  const xB = Math.min(boxA[2], boxB[2])
  const yB = Math.min(boxA[3], boxB[3])
  
  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA)
  if (interArea === 0) return 0
  
  const boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
  const boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
  
  return interArea / (boxAArea + boxBArea - interArea)
}

/**
 * Non-Maximum Suppression (NMS)
 */
function nms(boxes, iouThreshold) {
  // Sort boxes by confidence score descending
  const sorted = boxes.slice().sort((a, b) => b.confidence - a.confidence)
  const keep = []
  
  while (sorted.length > 0) {
    const current = sorted.shift()
    keep.push(current)
    
    // Filter out highly overlapping boxes
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (iou(current.box, sorted[i].box) > iouThreshold) {
        sorted.splice(i, 1)
      }
    }
  }
  
  return keep
}

/**
 * Run client-side inference on an image element (HTMLImageElement, HTMLVideoElement, or HTMLCanvasElement)
 */
export async function runLocalInference(imageEl, confThreshold = 0.25, iouThreshold = 0.45) {
  const modelSession = await loadModel()
  
  const modelWidth = 640
  const modelHeight = 640
  
  // Get original dimensions
  const origWidth = imageEl.naturalWidth || imageEl.videoWidth || imageEl.width || modelWidth
  const origHeight = imageEl.naturalHeight || imageEl.videoHeight || imageEl.height || modelHeight
  
  // Preprocess image to tensor
  const inputData = preprocess(imageEl, modelWidth, modelHeight)
  const inputTensor = new ort.Tensor('float32', inputData, [1, 3, modelWidth, modelHeight])
  
  // Run Inference
  const feeds = { [modelSession.inputNames[0]]: inputTensor }
  const outputs = await modelSession.run(feeds)
  
  // The output is typically of shape [1, 4 + num_classes, 8400]
  const outputTensor = outputs[modelSession.outputNames[0]]
  const { data, dims } = outputTensor
  
  const numChannels = dims[1] // e.g. 5 (4 coordinates + 1 class score)
  const numCandidates = dims[2] // e.g. 8400
  
  const candidates = []
  
  // Iterate over candidates
  for (let i = 0; i < numCandidates; i++) {
    // Find class with max score
    let maxClassScore = 0
    let classId = -1
    
    // Class scores start at channel index 4
    for (let c = 4; c < numChannels; c++) {
      const score = data[c * numCandidates + i]
      if (score > maxClassScore) {
        maxClassScore = score
        classId = c - 4
      }
    }
    
    if (maxClassScore > confThreshold) {
      // Extract box coordinates
      const cx = data[i]
      const cy = data[numCandidates + i]
      const w = data[2 * numCandidates + i]
      const h = data[3 * numCandidates + i]
      
      // Scale back to original coordinates
      const scaleX = origWidth / modelWidth
      const scaleY = origHeight / modelHeight
      
      const x1 = (cx - w / 2) * scaleX
      const y1 = (cy - h / 2) * scaleY
      const x2 = (cx + w / 2) * scaleX
      const y2 = (cy + h / 2) * scaleY
      
      candidates.push({
        box: [x1, y1, x2, y2],
        confidence: maxClassScore,
        classId: classId,
        label: 'watermelon' // default label
      })
    }
  }
  
  // Run Non-Maximum Suppression to filter redundant boxes
  const results = nms(candidates, iouThreshold)
  
  if (results.length > 0) {
    const topResult = results[0]
    return {
      class: 'watermelon',
      confidence: topResult.confidence * 100, // convert decimal to percentage (e.g. 95.4)
      box: topResult.box,
      isLocal: true // indicates local inference
    }
  }
  
  return {
    class: 'watermelon',
    confidence: 0.0,
    box: [0, 0, 0, 0],
    isLocal: true
  }
}
