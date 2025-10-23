// qrcode.js - Xử lý tạo và quét QR Code

/**
 * Tạo QR Code từ tin nhắn đã mã hóa
 * @param {string} encryptedMessage - Tin nhắn đã mã hóa
 * @param {HTMLElement} container - Container để hiển thị QR code
 * @returns {object} - QR Code instance
 */
function generateQRCode(encryptedMessage, container) {
    try {
        // Xóa QR code cũ nếu có
        container.innerHTML = '';

        // Tạo QR code mới
        const qrcode = new QRCode(container, {
            text: encryptedMessage,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H, // High error correction
        });

        return qrcode;
    } catch (error) {
        console.error('Lỗi tạo QR Code:', error);
        throw new Error('Không thể tạo QR Code!');
    }
}

/**
 * Tải xuống QR Code dưới dạng ảnh
 * @param {HTMLElement} container - Container chứa QR code
 * @param {string} filename - Tên file
 */
function downloadQRCode(container, filename = 'qrcode.png') {
    try {
        const canvas = container.querySelector('canvas');
        if (!canvas) {
            const img = container.querySelector('img');
            if (img) {
                // Nếu là image thay vì canvas
                const link = document.createElement('a');
                link.download = filename;
                link.href = img.src;
                link.click();
                return;
            }
            throw new Error('Không tìm thấy QR Code để tải xuống!');
        }

        // Chuyển canvas thành blob và tải xuống
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Lỗi tải QR Code:', error);
        alert('Không thể tải xuống QR Code!');
    }
}

/**
 * Khởi tạo QR Scanner
 * @param {HTMLElement} element - Element để hiển thị scanner
 * @param {function} onSuccess - Callback khi quét thành công
 * @param {function} onError - Callback khi có lỗi
 * @returns {object} - Scanner instance
 */
function initQRScanner(element, onSuccess, onError) {
    try {
        const html5QrCode = new Html5Qrcode(element.id);
        
        return {
            start: function() {
                html5QrCode.start(
                    { facingMode: "environment" }, // Sử dụng camera sau
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 }
                    },
                    onSuccess,
                    onError
                ).catch(err => {
                    console.error('Lỗi khởi động camera:', err);
                    alert('Không thể truy cập camera. Vui lòng cấp quyền truy cập!');
                });
            },
            stop: function() {
                html5QrCode.stop().then(() => {
                    console.log('QR Scanner đã dừng');
                }).catch(err => {
                    console.error('Lỗi dừng scanner:', err);
                });
            }
        };
    } catch (error) {
        console.error('Lỗi khởi tạo QR Scanner:', error);
        throw error;
    }
}