import os, re, sys

# Directory for source files
SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

# File extensions to scan
EXTS = {'.js', '.jsx', '.ts', '.tsx', '.html', '.css'}

# Regex for any Vietnamese Unicode range (Latin Extended‑Additional)
vi_pattern = re.compile(r'[\u0100-\u017F]')

found = []
for root, _, files in os.walk(SRC_DIR):
    for fname in files:
        _, ext = os.path.splitext(fname)
        if ext.lower() in EXTS:
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as fp:
                    for i, line in enumerate(fp, 1):
                        if vi_pattern.search(line):
                            rel = os.path.relpath(fpath, SRC_DIR)
                            found.append((rel, i, line.rstrip()))
            except Exception as e:
                # If a file cannot be read, record the error but continue
                found.append((fpath, 0, f'Error reading file: {e}'))

output_path = os.path.join(os.path.dirname(__file__), 'remaining_vi.txt')
with open(output_path, 'w', encoding='utf-8') as out:
    if found:
        out.write('Remaining Vietnamese characters found:\n')
        for file, lineno, line in found:
            out.write(f'{file}:{lineno}: {line}\n')
        sys.exit(1)
    else:
        out.write('No Vietnamese characters detected.\n')
        sys.exit(0)
