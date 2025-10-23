// app.js - Logic chính của ứng dụng

// Biến toàn cục
let qrScanner = null;
let selfDestructTimer = null;

// Chờ DOM load xong
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Khởi tạo ứng dụng
 */
function initializeApp() {
    // Setup tab navigation
    setupTabs();
    
    // Setup encryption functionality
    setupEncryption();
    
    // Setup decryption functionality
    setupDecryption();
    
    // Setup QR scanner
    setupQRScanner();
}

/**
 * Setup tabs navigation
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // Stop scanner when switching tabs
            if (qrScanner && targetTab !== 'scanner') {
                stopScanning();
            }
        });
    });
}

/**
 * Setup encryption functionality
 */
function setupEncryption() {
    const messageInput = document.getElementById('messageInput');
    const encryptKey = document.getElementById('encryptKey');
    const encryptButton = document.getElementById('encryptButton');
    const encryptResult = document.getElementById('encryptResult');
    const encryptedText = document.getElementById('encryptedText');
    const qrCodeDisplay = document.getElementById('qrCodeDisplay');
    const copyButton = document.getElementById('copyButton');
    const downloadQR = document.getElementById('downloadQR');
    const selfDestruct = document.getElementById('selfDestruct');

    encryptButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        const password = encryptKey.value.trim();

        // Validate input
        if (!message) {
            alert('❌ Vui lòng nhập tin nhắn!');
            return;
        }

        if (!password) {
            alert('❌ Vui lòng nhập mật khẩu!');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.valid) {
            alert('❌ ' + validation.message);
            return;
        }

        try {
            // Encrypt message
            const encrypted = encryptMessage(message, password);
            
            // Display encrypted text
            encryptedText.value = encrypted;
            
            // Generate QR Code
            qrCodeDisplay.innerHTML = '';
            generateQRCode(encrypted, qrCodeDisplay);
            
            // Show result
            encryptResult.style.display = 'block';
            
            // Success notification
            showNotification('✅ Mã hóa thành công!', 'success');
            
            // Self-destruct feature
            if (selfDestruct.checked) {
                startSelfDestruct();
            }
            
        } catch (error) {
            alert('❌ Lỗi mã hóa: ' + error.message);
        }
    });

    // Copy encrypted text
    copyButton.addEventListener('click', () => {
        encryptedText.select();
        document.execCommand('copy');
        showNotification('📋 Đã sao chép!', 'success');
    });

    // Download QR Code
    downloadQR.addEventListener('click', () => {
        downloadQRCode(qrCodeDisplay, 'encrypted-message.png');
        showNotification('💾 Đã tải QR Code!', 'success');
    });
}

/**
 * Setup decryption functionality
 */
function setupDecryption() {
    const encryptedInput = document.getElementById('encryptedInput');
    const decryptKey = document.getElementById('decryptKey');
    const decryptButton = document.getElementById('decryptButton');
    const decryptResult = document.getElementById('decryptResult');
    const decryptError = document.getElementById('decryptError');
    const decryptedMessage = document.getElementById('decryptedMessage');
    const errorMessage = document.getElementById('errorMessage');

    decryptButton.addEventListener('click', () => {
        const encrypted = encryptedInput.value.trim();
        const password = decryptKey.value.trim();

        // Validate input
        if (!encrypted) {
            alert('❌ Vui lòng nhập tin nhắn đã mã hóa!');
            return;
        }

        if (!password) {
            alert('❌ Vui lòng nhập mật khẩu!');
            return;
        }

        try {
            // Decrypt message
            const decrypted = decryptMessage(encrypted, password);
            
            // Display decrypted message
            decryptedMessage.textContent = decrypted;
            
            // Show result
            decryptResult.style.display = 'block';
            decryptError.style.display = 'none';
            
            // Success notification
            showNotification('✅ Giải mã thành công!', 'success');
            
        } catch (error) {
            // Show error
            errorMessage.textContent = error.message;
            decryptError.style.display = 'block';
            decryptResult.style.display = 'none';
            
            showNotification('❌ Giải mã thất bại!', 'error');
        }
    });
}

/**
 * Setup QR Scanner
 */
function setupQRScanner() {
    const qrReaderElement = document.getElementById('qr-reader');
    const startScanButton = document.getElementById('startScanButton');
    const stopScanButton = document.getElementById('stopScanButton');
    const scanResult = document.getElementById('scanResult');
    const scannedData = document.getElementById('scannedData');
    const scanDecryptKey = document.getElementById('scanDecryptKey');
    const decryptScannedButton = document.getElementById('decryptScannedButton');
    const scannedDecryptResult = document.getElementById('scannedDecryptResult');
    const scannedDecryptedMessage = document.getElementById('scannedDecryptedMessage');

    // Start scanning
    startScanButton.addEventListener('click', () => {
        qrScanner = initQRScanner(
            qrReaderElement,
            (decodedText) => {
                // Success callback
                scannedData.value = decodedText;
                scanResult.style.display = 'block';
                stopScanning();
                showNotification('📱 Đã quét QR Code thành công!', 'success');
            },
            (error) => {
                // Error callback - không làm gì, chỉ log
                // console.warn('QR Scan error:', error);
            }
        );

        qrScanner.start();
        startScanButton.style.display = 'none';
        stopScanButton.style.display = 'block';
    });

    // Stop scanning
    stopScanButton.addEventListener('click', () => {
        stopScanning();
    });

    // Decrypt scanned message
    decryptScannedButton.addEventListener('click', () => {
        const encrypted = scannedData.value.trim();
        const password = scanDecryptKey.value.trim();

        if (!password) {
            alert('❌ Vui lòng nhập mật khẩu!');
            return;
        }

        try {
            const decrypted = decryptMessage(encrypted, password);
            scannedDecryptedMessage.textContent = decrypted;
            scannedDecryptResult.style.display = 'block';
            showNotification('✅ Giải mã thành công!', 'success');
        } catch (error) {
            alert('❌ ' + error.message);
        }
    });
}

/**
 * Stop QR scanning
 */
function stopScanning() {
    if (qrScanner) {
        qrScanner.stop();
        qrScanner = null;
    }
    document.getElementById('startScanButton').style.display = 'block';
    document.getElementById('stopScanButton').style.display = 'none';
}

/**
 * Self-destruct feature (xóa tin nhắn sau 5 giây)
 */
function startSelfDestruct() {
    if (selfDestructTimer) {
        clearTimeout(selfDestructTimer);
    }

    let countdown = 5;
    const encryptResult = document.getElementById('encryptResult');
    
    showNotification(`⚡ Tin nhắn sẽ tự hủy sau ${countdown} giây...`, 'warning');
    
    selfDestructTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            showNotification(`⚡ Tin nhắn sẽ tự hủy sau ${countdown} giây...`, 'warning');
        } else {
            clearInterval(selfDestructTimer);
            encryptResult.style.display = 'none';
            document.getElementById('messageInput').value = '';
            document.getElementById('encryptKey').value = '';
            document.getElementById('qrCodeDisplay').innerHTML = '';
            showNotification('💥 Tin nhắn đã tự hủy!', 'error');
        }
    }, 1000);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Simple alert for now - có thể custom thành toast notification
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Có thể thêm thư viện toast notification như Toastify
    // hoặc tự làm một toast notification đơn giản
}