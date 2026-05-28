import os

translations = {
    "Hệ thống AI trên trình duyệt không tìm thấy thực thể dưa hấu hợp lệ trong bức ảnh này. Vui lòng căn chỉnh lại góc chụp rõ nét hơn!": "Browser AI could not detect a valid watermelon in this image. Please adjust the angle and try again!",
    "Đã có lỗi xảy ra. Vui lòng thử lại.": "An error occurred. Please try again.",
    "Chưa có tài khoản?": "Don't have an account?",
    "Đã có tài khoản?": "Already have an account?",
    "Đăng ký ngay": "Sign up now",
    "Xuất Sắc": "Excellent",
    "Độ ngọt đỉnh cao & Chín hoàn hảo": "Peak sweetness & Perfectly ripe",
    "Thượng Hạng": "Premium",
    "Độ ngọt tuyệt hảo & Chín đều": "Perfect sweetness & Evenly ripe",
    "Đạt Chuẩn": "Standard",
    "Rất chín ngọt & Đủ tiêu chuẩn": "Very sweet & Standard ripe",
    "Khá Tốt": "Good",
    "Độ ngọt nhẹ & Đủ chín": "Mildly sweet & Ripe",
    "Hơi Xanh": "Slightly Unripe",
    "Dưa chưa đủ chín, ngọt nhẹ": "Not fully ripe, mildly sweet",
    "Quá Chín": "Overripe",
    "Dưa quá chín, giảm độ giòn": "Overripe, reduced crispness",
    "Độ ngọt": "Sweetness",
    "Độ tròn": "Roundness",
    "Độ chín": "Ripeness",
    "Dọn dẹp thành công! Đã xóa": "Cleanup successful! Deleted",
    "ảnh và": "images and",
    "bản ghi.": "records.",
    "Gỡ ảnh đại diện": "Remove avatar",
    "Dự án được phát triển bởi": "Project developed by",
    "Sinh năm:": "Born:",
    "Mở rộng trí tuệ nhân tạo:": "AI Expansion:",
    "Tích hợp thêm các model nhận diện đa dạng trái cây (xoài, sầu riêng, mít...) phi phá hủy.": "Integrate more non-destructive fruit detection models (mango, durian, jackfruit...).",
    "Đồng bộ Di động:": "Mobile Sync:",
    "Xây dựng ứng dụng Native Mobile (iOS/Android) sử dụng camera quét trực tiếp tại nông trại.": "Build Native Mobile app (iOS/Android) for direct camera scanning at farms.",
    "Edge Computing AI:": "Edge Computing AI:",
    "Tối ưu hóa mô hình YOLO để chạy trực tiếp trên trình duyệt hoặc thiết bị nhúng mà không cần mạng internet.": "Optimize YOLO model to run directly on browsers or edge devices offline.",
    "Tải lên Ảnh đại diện Nhà phát triển": "Upload Developer Avatar",
    "Delete toàn bộ các ảnh được tải lên hệ thống (`media/uploads` và `media/results`) đồng thời làm sạch lịch sử quét trong cơ sở dữ liệu.": "Delete all uploaded images (`media/uploads` and `media/results`) and clear scan history from the database.",
    "Đang dọn dẹp hệ thống...": "Cleaning up system...",
    "⚠️ Click lại để xác nhận xóa vĩnh viễn!": "⚠️ Click again to confirm permanent deletion!",
    "Cài Đặt Ứng Dụng Di Động": "Install Mobile App",
    "HĐH iOS": "iOS OS",
    "HĐH Android": "Android OS",
    "Install tự động ⚡": "Auto Install ⚡",
    "Google Chrome / Khác": "Google Chrome / Other",
    "🍏 Hướng dẫn cài đặt trên iOS (Safari):": "🍏 iOS Installation Guide (Safari):",
    "Nhấp vào nút <b>Chia sẻ</b> (biểu tượng hình vuông có mũi tên lên <span className=\"text-base\">⎋</span> ở thanh công cụ dưới cùng).": "Click the <b>Share</b> button (square icon with an up arrow <span className=\"text-base\">⎋</span> on the bottom toolbar).",
    "Nhấn nút <b>\"Add\"</b> (Add) ở góc trên bên phải. Xong! Icon App sẽ xuất hiện trên màn hình điện thoại.": "Click <b>\"Add\"</b> in the top right corner. Done! The App icon will appear on your home screen.",
    "Đóng hướng dẫn": "Close guide",
    "🤖 Hướng dẫn cài đặt trên Android (Chrome):": "🤖 Android Installation Guide (Chrome):",
    "Mở trình duyệt <b>Google Chrome</b> trên điện thoại Android của bạn.": "Open <b>Google Chrome</b> on your Android phone.",
    "Bấm xác nhận <b>\"Install\"</b>. Icon App sẽ được tải về màn hình điện thoại ngay lập tức.": "Confirm <b>\"Install\"</b>. The App icon will be downloaded to your home screen immediately.",
    "Đồng": "Bronze",
    "Vinh danh đóng góp & thành tích": "Honoring contributions & achievements",
    "Hệ thống tự động xếp hạng các chuyên gia thẩm định dưa hấu hàng đầu và vinh danh những nhà tài trợ đóng góp xây dựng mô hình AI.": "The system automatically ranks top watermelon experts and honors sponsors contributing to the AI model.",
    "Đang chẩn đoán dữ liệu...": "Diagnosing data...",
    "Các đóng góp của bạn giúp tài trợ chi phí duy trì GPU cho mô hình AI dưa hấu. Hãy click nút Donate tại màn hình chính, hoàn tất chuyển khoản và liên hệ nhà phát triển để vinh danh danh tính của bạn!": "Your contributions help sponsor GPU costs for the watermelon AI model. Click the Donate button on the home screen, complete the transfer, and contact the developer to be honored!",
    "📲 Install App di động": "📲 Install Mobile App",
    "Chủ đề Neon:": "Neon Theme:",
    "Đăng xuất": "Log Out",
    "Các thông tin cập nhật từ Admin sẽ xuất hiện tại đây.": "Updates from the Admin will appear here.",
    "✓ Bạn đã bày tỏ cảm xúc": "✓ You reacted",
    "Kính Cyberpunk": "Cyberpunk Glasses",
    "Đeo kính LED phát sáng cực ngầu.": "Wear cool glowing LED glasses.",
    "Tai nghe DJ": "DJ Headphones",
    "Thưởng thức nhạc điện tử tương lai.": "Enjoy futuristic electronic music.",
    "Đổi tên thú nuôi": "Rename Pet",
    "⚡ Năng lượng:": "⚡ Energy:",
    "Cấp độ": "Level",
    "Xu tích lũy": "Accumulated Coins",
    "🍉 Cho ăn (-2 xu)": "🍉 Feed (-2 coins)",
    "Seed Sprout chưa thể mang trang bị! Hãy tích lũy lượt quét để tiến hóa lên Lvl 3.": "Seed Sprout cannot equip items yet! Accumulate scans to evolve to Lvl 3.",
    "Gỡ ra": "Unequip",
    "Đeo vào": "Equip",
    "Danh sách dưa hấu đã được scan và bảo chứng chất lượng bởi tài khoản của bạn.": "List of watermelons scanned and quality-certified by your account.",
    "Hãy quay lại trang chủ và thực hiện quét dưa hấu lần đầu tiên!": "Go back to the home page and scan your first watermelon!",
    "Độ Ngọt": "Sweetness",
    "Trạng Thái Độ Chín": "Ripeness State",
    "Độ tin cậy mô hình:": "Model confidence:",
    "Số liệu phân tích quang học phi phá hủy được sinh tự động bởi AI thông qua phân tích cấu trúc vỏ dưa hấu.": "Non-destructive optical analysis data generated automatically by AI through watermelon rind structure analysis.",
    "Hủy / Đóng": "Cancel / Close",
    "Đăng phản hồi bằng tài khoản": "Post feedback as account",
    "Đã đăng nhập": "Logged In",
    "Đánh giá cao nhất": "Highest rated",
    "Đánh giá thấp nhất": "Lowest rated",
    "Welcome đến với Watermelon AI - Website ứng dụng trí tuệ nhân tạo để phân tích, nhận diện và đánh giá chất lượng dưa hấu thời gian thực của tác giả Nguyen Le Bao Duy.": "Welcome to Watermelon AI - An AI-powered website for real-time analysis, detection, and quality assessment of watermelons by Nguyen Le Bao Duy.",
    "Tại mục 'Start Scan', hãy tải lên/kéo thả hình ảnh quả dưa hấu hoặc mở Camera Live để AI phát hiện trực tiếp. Kết quả sẽ hiển thị dạng khung hình và điểm phần trăm tin cậy.": "In the 'Start Scan' section, upload/drag an image of a watermelon or open Live Camera for direct AI detection. Results show as a bounding box and confidence score.",
    "Sau khi AI phân tích thành công, hãy nhấn nút 'Xem chứng chỉ' ở kết quả quét để hiển thị chứng nhận chất lượng chính hãng và tải ảnh kết quả quét về máy.": "After successful AI analysis, click 'View Certificate' to show the genuine quality certificate and download the scanned image.",
    "📊 Biểu đồ Thống kê AI": "📊 AI Statistics Charts",
    "Khu vực 'Statistics' cung cấp các biểu đồ thống kê trực quan cập nhật tự động về tổng lượt quét, độ tự tin trung bình giúp theo dõi hiệu suất mô hình dễ dàng.": "The 'Statistics' area provides visual auto-updating charts on total scans and average confidence to easily track model performance.",
    "💬 News Feed & Đánh giá": "💬 News Feed & Reviews",
    "Update thông báo mới tại 'News Feed'. Bạn cũng có thể gửi đánh giá chất lượng sản phẩm tại mục 'Reviews' hoặc gửi đóng góp ủng hộ nhà phát triển ở mục 'Donate'!": "Update new notifications at 'News Feed'. You can also submit product quality reviews in the 'Reviews' section or donate to support the developer!",
    "Nhấp để di chuyển tới phần này": "Click to scroll to this section",
    "CẢM ƠN BẠN ĐÃ TRUY CẬP": "THANK YOU FOR VISITING",
    "Welcome bạn đến với góc sáng tạo nhỏ của mình. Dự án này được xây dựng bằng cả sự tâm huyết với mong muốn tích hợp trí tuệ nhân tạo và đồ học 3D hiện đại để tối ưu hóa trải nghiệm phân tích chất lượng nông sản. Hy vọng bạn sẽ tìm thấy những thông tin hữu ích và có một trải nghiệm thật tuyệt vời khi sử dụng trang web này!": "Welcome to my small creative corner. This project was built with passion, aiming to integrate AI and modern 3D graphics to optimize the agricultural quality analysis experience. I hope you find useful information and have a great experience using this website!",
    "Nếu bạn yêu thích dự án, đừng ngần ngại để lại những phản hồi, đánh giá tích cực hoặc ủng hộ mình tại mục Donate nhé. Sự đóng góp của bạn là động lực to lớn giúp mình tiếp tục nghiên cứu và nâng cấp thêm các tính năng đột phá mới trong tương lai!": "If you love the project, please leave positive feedback, reviews, or support me in the Donate section. Your contribution is a huge motivation for me to continue researching and upgrading breakthrough features in the future!",
    "Chúc bạn một ngày tràn đầy năng lượng và niềm vui! 🍉": "Wishing you a day full of energy and joy! 🍉",
    "Xu": "Coins"
}

EXTS = {'.js', '.jsx', '.ts', '.tsx', '.html', '.css'}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        
    new_content = content
    for vn, en in translations.items():
        new_content = new_content.replace(vn, en)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for f in files:
        if any(f.endswith(ext) for ext in EXTS):
            replace_in_file(os.path.join(root, f))
