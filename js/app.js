// app.js - Logic chính của ứng dụng

// Biến toàn cục
let qrScanner = null;
let selfDestructTimer = null;
let clipboardTimer = null;
let settings = {
    darkMode: false,
    themeColor: 'purple',
    autoLock: false,
    clearClipboard: false,
    defaultEncryption: 'aes',
    qrSize: 256,
    qrColorDark: '#000000',
    qrColorLight: '#ffffff',
    soundEffects: true,
    notifications: false
};
let stats = {
    totalEncrypted: 0,
    totalDecrypted: 0,
    totalQR: 0
};

// Chờ DOM load xong
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Khởi tạo ứng dụng
 */
function initializeApp() {
    // Load settings and stats
    loadSettings();
    loadStats();
    
    // Setup tab navigation
    setupTabs();
    
    // Setup encryption functionality
    setupEncryption();
    
    // Setup decryption functionality
    setupDecryption();
    
    // Setup QR scanner
    setupQRScanner();
    
    // Setup history
    setupHistory();
    
    // Setup settings
    setupSettings();
    
    // Load URL parameters (for share link)
    loadFromURL();
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

    // Password strength indicator
    encryptKey.addEventListener('input', () => {
        const password = encryptKey.value;
        const strengthDiv = document.getElementById('passwordStrength');
        
        if (!password) {
            strengthDiv.className = 'password-strength';
            return;
        }
        
        const validation = validatePassword(password);
        if (validation.valid) {
            strengthDiv.className = `password-strength ${validation.strength}`;
        }
    });
    
    // Toggle password visibility
    document.getElementById('toggleEncryptPassword').addEventListener('click', () => {
        const type = encryptKey.type === 'password' ? 'text' : 'password';
        encryptKey.type = type;
    });
    
    // Generate random password
    document.getElementById('generatePassword').addEventListener('click', () => {
        const password = generateRandomPassword(16);
        encryptKey.value = password;
        encryptKey.type = 'text';
        showNotification('🎲 Đã tạo mật khẩu ngẫu nhiên!', 'success');
        encryptKey.dispatchEvent(new Event('input'));
    });

    encryptButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        const password = encryptKey.value.trim();
        const expiryTime = parseInt(document.getElementById('expiryTime').value);

        // Validate input
        if (!message) {
            showNotification('❌ Vui lòng nhập tin nhắn!', 'error');
            return;
        }

        if (!password) {
            showNotification('❌ Vui lòng nhập mật khẩu!', 'error');
            return;
        }

        const validation = validatePassword(password);
        if (!validation.valid) {
            showNotification('❌ ' + validation.message, 'error');
            return;
        }

        try {
            // Add expiry time to message if set
            let messageToEncrypt = message;
            if (expiryTime > 0) {
                const expiryTimestamp = Date.now() + (expiryTime * 1000);
                messageToEncrypt = JSON.stringify({
                    message: message,
                    expiry: expiryTimestamp
                });
            }
            
            // Encrypt message with selected algorithm
            const encrypted = encryptWithAlgorithm(messageToEncrypt, password, settings.defaultEncryption);
            
            // Display encrypted text
            encryptedText.value = encrypted;
            
            // Generate QR Code
            qrCodeDisplay.innerHTML = '';
            generateQRCode(encrypted, qrCodeDisplay, {
                width: settings.qrSize,
                height: settings.qrSize,
                colorDark: settings.qrColorDark,
                colorLight: settings.qrColorLight
            });
            
            // Show result
            encryptResult.style.display = 'block';
            
            // Update stats
            stats.totalEncrypted++;
            stats.totalQR++;
            saveStats();
            updateStatsDisplay();
            
            // Success notification
            showNotification('✅ Mã hóa thành công!', 'success');
            
            // Self-destruct feature
            if (selfDestruct.checked) {
                startSelfDestruct();
            }
            
        } catch (error) {
            showNotification('❌ Lỗi mã hóa: ' + error.message, 'error');
        }
    });

    // Copy encrypted text
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(encryptedText.value).then(() => {
            showNotification('📋 Đã sao chép!', 'success');
            
            // Clear clipboard after 30s if setting enabled
            if (settings.clearClipboard) {
                if (clipboardTimer) clearTimeout(clipboardTimer);
                clipboardTimer = setTimeout(() => {
                    navigator.clipboard.writeText('');
                    showNotification('🧹 Đã xóa clipboard!', 'info');
                }, 30000);
            }
        });
    });

    // Download QR Code
    downloadQR.addEventListener('click', () => {
        downloadQRCode(qrCodeDisplay, 'encrypted-message.png');
        showNotification('💾 Đã tải QR Code!', 'success');
    });
    
    // Share button
    document.getElementById('shareButton').addEventListener('click', () => {
        const encrypted = encryptedText.value;
        const password = encryptKey.value;
        
        const shareLink = `${window.location.origin}${window.location.pathname}?msg=${encodeURIComponent(encrypted)}&key=${encodeURIComponent(password)}`;
        
        document.getElementById('shareLink').value = shareLink;
        document.getElementById('shareModal').style.display = 'block';
    });
    
    // Save to history
    document.getElementById('saveHistory').addEventListener('click', () => {
        const message = messageInput.value;
        addToHistory(message, 'encrypt');
        showNotification('💾 Đã lưu vào lịch sử!', 'success');
        loadHistory();
    });
    
    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('shareModal').style.display = 'none';
    });
    
    // Copy share link
    document.getElementById('copyShareLink').addEventListener('click', () => {
        const shareLink = document.getElementById('shareLink');
        shareLink.select();
        navigator.clipboard.writeText(shareLink.value).then(() => {
            showNotification('📋 Đã sao chép link chia sẻ!', 'success');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('shareModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
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
            // Decrypt message with selected algorithm
            let decrypted = decryptWithAlgorithm(encrypted, password, settings.defaultEncryption);
            
            // Check if message has expiry time
            try {
                const parsed = JSON.parse(decrypted);
                if (parsed.message && parsed.expiry) {
                    if (Date.now() > parsed.expiry) {
                        throw new Error('Tin nhắn đã hết hạn!');
                    }
                    decrypted = parsed.message;
                }
            } catch (e) {
                // Not a JSON message with expiry, use as is
            }
            
            // Display decrypted message
            decryptedMessage.textContent = decrypted;
            
            // Show result
            decryptResult.style.display = 'block';
            decryptError.style.display = 'none';
            
            // Update stats
            stats.totalDecrypted++;
            saveStats();
            updateStatsDisplay();
            
            // Add to history
            addToHistory(decrypted, 'decrypt');
            
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
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Play sound if enabled
    if (settings.soundEffects) {
        playSound(type);
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
    
    // Browser notification if enabled
    if (settings.notifications && 'Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Ứng dụng mã hóa', {
                body: message,
                icon: 'assets/icons/logo.png'
            });
        }
    }
}

/**
 * Play sound effect
 */
function playSound(type) {
    const audio = new Audio();
    // Tạo âm thanh đơn giản bằng Web Audio API
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    switch(type) {
        case 'success':
            oscillator.frequency.value = 800;
            break;
        case 'error':
            oscillator.frequency.value = 200;
            break;
        default:
            oscillator.frequency.value = 500;
    }
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        applySettings();
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(settings));
}

/**
 * Apply settings to UI
 */
function applySettings() {
    // Dark mode
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkMode').checked = true;
    }
    
    // Theme color
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${settings.themeColor}`);
    document.getElementById('themeColor').value = settings.themeColor;
    
    // Other settings
    document.getElementById('autoLock').checked = settings.autoLock;
    document.getElementById('clearClipboard').checked = settings.clearClipboard;
    document.getElementById('defaultEncryption').value = settings.defaultEncryption;
    document.getElementById('qrSize').value = settings.qrSize;
    document.getElementById('qrColorDark').value = settings.qrColorDark;
    document.getElementById('qrColorLight').value = settings.qrColorLight;
    document.getElementById('soundEffects').checked = settings.soundEffects;
    document.getElementById('notifications').checked = settings.notifications;
}

/**
 * Load stats from localStorage
 */
function loadStats() {
    const saved = localStorage.getItem('appStats');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
    }
}

/**
 * Save stats to localStorage
 */
function saveStats() {
    localStorage.setItem('appStats', JSON.stringify(stats));
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
    document.getElementById('totalEncrypted').textContent = stats.totalEncrypted;
    document.getElementById('totalDecrypted').textContent = stats.totalDecrypted;
    document.getElementById('totalQR').textContent = stats.totalQR;
}

/**
 * Setup history functionality
 */
function setupHistory() {
    const clearHistory = document.getElementById('clearHistory');
    const exportHistory = document.getElementById('exportHistory');
    
    // Clear history
    clearHistory.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
            localStorage.removeItem('messageHistory');
            loadHistory();
            showNotification('🗑️ Đã xóa lịch sử!', 'success');
        }
    });
    
    // Export history
    exportHistory.addEventListener('click', () => {
        const history = JSON.parse(localStorage.getItem('messageHistory') || '[]');
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `history_${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('📥 Đã xuất file lịch sử!', 'success');
    });
    
    loadHistory();
}

/**
 * Load and display history
 */
function loadHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">📭 Chưa có tin nhắn nào trong lịch sử</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item">
            <div class="history-item-header">
                <strong>${item.type === 'encrypt' ? '🔒 Mã hóa' : '🔓 Giải mã'}</strong>
                <span class="history-item-time">${new Date(item.timestamp).toLocaleString('vi-VN')}</span>
            </div>
            <div class="history-item-message">${item.message.substring(0, 100)}${item.message.length > 100 ? '...' : ''}</div>
            <div class="history-item-actions">
                <button onclick="copyHistoryItem(${index})" class="btn-secondary">📋 Sao chép</button>
                <button onclick="deleteHistoryItem(${index})" class="btn-secondary">🗑️ Xóa</button>
            </div>
        </div>
    `).join('');
}

/**
 * Add item to history
 */
function addToHistory(message, type) {
    const history = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    history.unshift({
        message,
        type,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 items
    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('messageHistory', JSON.stringify(history));
}

/**
 * Copy history item
 */
function copyHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    const item = history[index];
    
    navigator.clipboard.writeText(item.message).then(() => {
        showNotification('📋 Đã sao chép!', 'success');
    });
}

/**
 * Delete history item
 */
function deleteHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('messageHistory') || '[]');
    history.splice(index, 1);
    localStorage.setItem('messageHistory', JSON.stringify(history));
    loadHistory();
    showNotification('🗑️ Đã xóa!', 'success');
}

/**
 * Setup settings functionality
 */
function setupSettings() {
    // Dark mode toggle
    document.getElementById('darkMode').addEventListener('change', (e) => {
        settings.darkMode = e.target.checked;
        document.body.classList.toggle('dark-mode', e.target.checked);
        saveSettings();
    });
    
    // Theme color
    document.getElementById('themeColor').addEventListener('change', (e) => {
        settings.themeColor = e.target.value;
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${e.target.value}`);
        if (settings.darkMode) document.body.classList.add('dark-mode');
        saveSettings();
    });
    
    // Other settings
    document.getElementById('autoLock').addEventListener('change', (e) => {
        settings.autoLock = e.target.checked;
        saveSettings();
    });
    
    document.getElementById('clearClipboard').addEventListener('change', (e) => {
        settings.clearClipboard = e.target.checked;
        saveSettings();
    });
    
    document.getElementById('defaultEncryption').addEventListener('change', (e) => {
        settings.defaultEncryption = e.target.value;
        saveSettings();
    });
    
    document.getElementById('qrSize').addEventListener('change', (e) => {
        settings.qrSize = parseInt(e.target.value);
        saveSettings();
    });
    
    document.getElementById('qrColorDark').addEventListener('change', (e) => {
        settings.qrColorDark = e.target.value;
        saveSettings();
    });
    
    document.getElementById('qrColorLight').addEventListener('change', (e) => {
        settings.qrColorLight = e.target.value;
        saveSettings();
    });
    
    document.getElementById('soundEffects').addEventListener('change', (e) => {
        settings.soundEffects = e.target.checked;
        saveSettings();
    });
    
    document.getElementById('notifications').addEventListener('change', (e) => {
        settings.notifications = e.target.checked;
        if (e.target.checked && 'Notification' in window) {
            Notification.requestPermission();
        }
        saveSettings();
    });
    
    // Reset settings
    document.getElementById('resetSettings').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn đặt lại tất cả cài đặt?')) {
            settings = {
                darkMode: false,
                themeColor: 'purple',
                autoLock: false,
                clearClipboard: false,
                defaultEncryption: 'aes',
                qrSize: 256,
                qrColorDark: '#000000',
                qrColorLight: '#ffffff',
                soundEffects: true,
                notifications: false
            };
            saveSettings();
            applySettings();
            showNotification('🔄 Đã đặt lại cài đặt!', 'success');
        }
    });
    
    // Save settings
    document.getElementById('saveSettings').addEventListener('click', () => {
        saveSettings();
        showNotification('💾 Đã lưu cài đặt!', 'success');
    });
}

/**
 * Load from URL parameters (share link)
 */
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const encrypted = params.get('msg');
    const password = params.get('key');
    
    if (encrypted && password) {
        // Switch to decrypt tab
        document.querySelector('[data-tab="decrypt"]').click();
        
        // Fill in the form
        document.getElementById('encryptedInput').value = decodeURIComponent(encrypted);
        document.getElementById('decryptKey').value = decodeURIComponent(password);
        
        showNotification('📩 Đã tải tin nhắn từ link chia sẻ!', 'info');
        
        // Clear URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}