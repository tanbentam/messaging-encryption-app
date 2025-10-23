# 🔐 Ứng Dụng Mã Hóa Tin Nhắn - AES & QR Code# Messaging Encryption App



## 📋 Mô Tả Đề Tài## Overview

The Messaging Encryption App is a web application that allows users to securely send messages using AES encryption and QR code authentication. Users can input a message, encrypt it, generate a QR code containing the encrypted message, and share it with friends. Recipients can scan the QR code to decrypt the message, provided they have the shared password/key.

**Ứng dụng web mã hóa tin nhắn dựa trên AES và xác thực QR code cho bạn bè**

## Features

Đây là một ứng dụng web frontend hoàn chỉnh cho phép người dùng:- AES encryption for secure messaging

- ✉️ Mã hóa tin nhắn bằng thuật toán AES-256- QR code generation for easy sharing of encrypted messages

- 📱 Tạo QR Code chứa tin nhắn đã mã hóa- Simple authentication mechanism to ensure only authorized users can decrypt messages

- 🔓 Giải mã tin nhắn bằng mật khẩu chung- User-friendly interface for inputting messages and displaying QR codes

- 📷 Quét QR Code để đọc tin nhắn

- ⚡ Tính năng tự hủy tin nhắn sau khi hiển thị## Project Structure

```

## 🎯 Điểm Nổi Bậtmessaging-encryption-app

├── index.html          # Main HTML file

1. **Bảo mật cao** - Sử dụng mã hóa AES-256, chuẩn mã hóa quân sự├── css

2. **Không cần server** - Toàn bộ xử lý trên trình duyệt (client-side)│   └── styles.css     # Styles for the application

3. **Không lưu trữ dữ liệu** - Bảo mật tuyệt đối, không có database├── js

4. **Giao diện đẹp** - Responsive design, thân thiện với người dùng│   ├── app.js         # Main JavaScript file for user interactions

5. **Tính năng đầy đủ** - Mã hóa, giải mã, QR code, camera scanner│   ├── encryption.js   # Functions for encrypting and decrypting messages

6. **Tự hủy tin nhắn** - Xóa tự động sau khi hiển thị (như Snapchat)│   ├── qrcode.js      # QR code generation functions

│   └── auth.js        # Authentication functions

## 🛠️ Công Nghệ Sử Dụng├── assets

│   └── icons          # Directory for icon images

### Frontend└── README.md          # Project documentation

- **HTML5** - Cấu trúc trang web```

- **CSS3** - Styling và animations

- **JavaScript (ES6+)** - Logic xử lý## Setup Instructions

1. Clone the repository to your local machine.

### Thư Viện2. Open the `index.html` file in a web browser to run the application.

- **CryptoJS 4.1.1** - Mã hóa AES-2563. Ensure you have a modern browser that supports JavaScript and HTML5.

- **QRCode.js 1.0.0** - Tạo QR code

- **HTML5-QRCode** - Quét QR code bằng camera## Usage Guidelines

1. Enter the message you want to encrypt in the input field.

## 📂 Cấu Trúc Thư Mục2. Provide a shared password/key for encryption.

3. Click the "Encrypt" button to generate the encrypted message and QR code.

```4. Share the QR code with your friends.

messaging-encryption-app/5. To decrypt the message, scan the QR code using the application and enter the shared password/key.

│

├── index.html              # Trang chính## Technologies Used

├── README.md              # Tài liệu hướng dẫn- HTML

│- CSS

├── css/- JavaScript

│   └── styles.css         # File CSS chính- AES encryption algorithm

│- QR code generation library

├── js/

│   ├── app.js            # Logic chính của ứng dụng## License

│   ├── encryption.js     # Xử lý mã hóa/giải mã AESThis project is licensed under the MIT License.
│   ├── qrcode.js         # Xử lý QR code
│   └── auth.js           # Xác thực và quản lý mật khẩu
│
└── assets/
    └── icons/            # Icons và hình ảnh
```

## 🚀 Hướng Dẫn Sử Dụng

### 1. Cài Đặt

**Cách 1: Chạy trực tiếp**
- Mở file `index.html` bằng trình duyệt web
- Không cần cài đặt thêm gì cả!

**Cách 2: Chạy với Live Server (khuyến nghị)**
```bash
# Nếu dùng VS Code với extension Live Server
# Chuột phải vào index.html → Open with Live Server
```

**Cách 3: Chạy với Python Server**
```bash
# Python 3
cd messaging-encryption-app
python -m http.server 8000

# Mở trình duyệt: http://localhost:8000
```

### 2. Mã Hóa Tin Nhắn

1. Vào tab **"📝 Mã Hóa"**
2. Nhập tin nhắn muốn mã hóa
3. Nhập mật khẩu chung (8-32 ký tự)
4. Click **"🔒 Mã Hóa & Tạo QR Code"**
5. Lưu QR Code hoặc sao chép tin nhắn đã mã hóa
6. *(Tùy chọn)* Bật tính năng tự hủy tin nhắn

### 3. Giải Mã Tin Nhắn

**Cách 1: Giải mã thủ công**
1. Vào tab **"🔓 Giải Mã"**
2. Dán tin nhắn đã mã hóa
3. Nhập mật khẩu chung (phải giống với mật khẩu mã hóa)
4. Click **"🔓 Giải Mã"**

**Cách 2: Quét QR Code**
1. Vào tab **"📷 Quét QR"**
2. Click **"📷 Bắt Đầu Quét"**
3. Cho phép truy cập camera
4. Quét QR Code
5. Nhập mật khẩu để giải mã

## 💡 Ví Dụ Sử Dụng

### Kịch Bản 1: Gửi Tin Nhắn Bí Mật
```
Alice muốn gửi tin nhắn bí mật cho Bob:

1. Alice và Bob thỏa thuận mật khẩu chung: "MatKhauBiMat123"
2. Alice nhập tin nhắn: "Gặp nhau lúc 8h tối nay"
3. Alice nhập mật khẩu và mã hóa
4. Alice gửi QR Code cho Bob qua Zalo/Email
5. Bob quét QR Code và nhập mật khẩu "MatKhauBiMat123"
6. Bob đọc được tin nhắn gốc!
```

### Kịch Bản 2: Tự Hủy Tin Nhắn
```
Gửi tin nhắn nhạy cảm với tính năng tự hủy:

1. Mã hóa tin nhắn như bình thường
2. Tích vào ô "Xóa tin nhắn sau khi hiển thị QR Code"
3. Sau 5 giây, tin nhắn và QR code tự động bị xóa
4. Không ai có thể xem lại được!
```

## 🔒 Bảo Mật

### Thuật Toán Mã Hóa
- **AES-256-CBC** - Chuẩn mã hóa quân sự
- **CryptoJS** - Thư viện mã hóa đáng tin cậy

### Các Tính Năng Bảo Mật
✅ Mã hóa end-to-end  
✅ Không lưu trữ dữ liệu trên server  
✅ Xử lý hoàn toàn trên trình duyệt  
✅ Không gửi dữ liệu qua mạng  
✅ Tự hủy tin nhắn tự động  

### Lưu Ý Bảo Mật
⚠️ Mật khẩu phải được chia sẻ qua kênh riêng tư  
⚠️ Không dùng mật khẩu yếu (dưới 8 ký tự)  
⚠️ Nên dùng mật khẩu phức tạp (chữ hoa, số, ký tự đặc biệt)  
⚠️ Đổi mật khẩu thường xuyên  

## 📱 Trình Duyệt Hỗ Trợ

- ✅ Chrome/Edge (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Internet Explorer (không hỗ trợ)

## 🎓 Mục Đích Học Tập

Dự án này phù hợp cho:
- 📚 Bài tập giữa kỳ/cuối kỳ môn An Toàn Bảo Mật
- 🔐 Học về mã hóa AES và ứng dụng
- 📱 Tích hợp QR Code vào ứng dụng web
- 💻 Thực hành HTML/CSS/JavaScript
- 🛡️ Hiểu về bảo mật client-side

## 🧪 Testing

### Test Cases

**Test 1: Mã hóa và giải mã cơ bản**
```
Input: "Hello World", Password: "test1234"
Expected: Giải mã thành công với cùng password
```

**Test 2: Sai mật khẩu**
```
Input: Encrypted message, Wrong password
Expected: Hiển thị lỗi "Mật khẩu không đúng"
```

**Test 3: QR Code**
```
Input: Encrypted message
Expected: Tạo QR code thành công, quét được tin nhắn
```

**Test 4: Tự hủy tin nhắn**
```
Input: Message với checkbox "self-destruct"
Expected: Tin nhắn bị xóa sau 5 giây
```

## 🎨 Tính Năng Nâng Cao (Có Thể Mở Rộng)

1. **Lưu lịch sử tin nhắn** (localStorage)
2. **Chia sẻ qua link** (URL encoding)
3. **Đặt thời gian hết hạn** (expiry time)
4. **Nhiều loại mã hóa** (RSA, 3DES)
5. **Gửi email tự động** (Email API)
6. **Mã hóa file** (image, PDF)
7. **Dark mode** (chế độ tối)
8. **Multi-language** (tiếng Việt, English)

## 📊 So Sánh Với Các Giải Pháp Khác

| Tính năng | Ứng dụng này | WhatsApp | Telegram |
|-----------|-------------|----------|----------|
| Mã hóa E2E | ✅ AES-256 | ✅ | ✅ |
| QR Code | ✅ | ❌ | ❌ |
| No Server | ✅ | ❌ | ❌ |
| Tự hủy | ✅ | ✅ | ✅ |
| Open Source | ✅ | ❌ | ❌ |

## 🐛 Báo Lỗi

Nếu phát hiện lỗi, vui lòng mô tả chi tiết:
- Trình duyệt đang dùng
- Bước thực hiện
- Thông báo lỗi
- Screenshot (nếu có)

## 📝 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

## 👥 Đóng Góp

Mọi đóng góp đều được hoan nghênh! 
- Fork project
- Tạo branch mới
- Commit changes
- Push và tạo Pull Request

## 📞 Liên Hệ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ.

---

## 🎯 Hướng Dẫn Demo Cho Giáo Viên

### Chuẩn Bị Demo
1. Mở ứng dụng trên 2 tab/thiết bị khác nhau
2. Tab 1: Mã hóa tin nhắn
3. Tab 2: Giải mã tin nhắn

### Kịch Bản Demo (5 phút)

**Phút 1-2: Giới thiệu**
- Mô tả đề tài và mục đích
- Giải thích công nghệ sử dụng (AES, QR Code)

**Phút 3-4: Demo chức năng**
- Mã hóa một tin nhắn mẫu
- Tạo QR Code
- Quét QR Code bằng camera/điện thoại
- Giải mã thành công

**Phút 5: Tính năng nổi bật**
- Demo tính năng tự hủy tin nhắn
- Giải thích về bảo mật (không server, client-side)
- Trả lời câu hỏi

### Điểm Mạnh Khi Trình Bày
✅ Ứng dụng thực tế (nhắn tin bí mật)  
✅ Kết hợp nhiều công nghệ (AES + QR)  
✅ Giao diện đẹp, chuyên nghiệp  
✅ Code clean, có comment  
✅ Bảo mật tốt (AES-256)  
✅ Không cần database, server phức tạp  

---

**Made with ❤️ for Cybersecurity Course**

🔐 Stay Safe, Stay Encrypted! 🔐
