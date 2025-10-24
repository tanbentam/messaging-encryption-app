// encryption.js - Xử lý mã hóa và giải mã AES-256

/**
 * Mã hóa tin nhắn sử dụng AES-256-CBC
 * @param {string} message - Tin nhắn cần mã hóa
 * @param {string} password - Mật khẩu để mã hóa
 * @returns {string} - Tin nhắn đã mã hóa (Base64)
 */
function encryptMessage(message, password) {
    try {
        // Validate input
        if (!message || !password) {
            throw new Error('Tin nhắn và mật khẩu không được để trống!');
        }

        if (password.length < 8) {
            throw new Error('Mật khẩu phải có ít nhất 8 ký tự!');
        }

        // Mã hóa sử dụng CryptoJS
        const encrypted = CryptoJS.AES.encrypt(message, password).toString();
        
        return encrypted;
    } catch (error) {
        console.error('Lỗi mã hóa:', error);
        throw error;
    }
}

/**
 * Giải mã tin nhắn đã được mã hóa
 * @param {string} encryptedMessage - Tin nhắn đã mã hóa
 * @param {string} password - Mật khẩu để giải mã
 * @returns {string} - Tin nhắn gốc
 */
function decryptMessage(encryptedMessage, password) {
    try {
        // Validate input
        if (!encryptedMessage || !password) {
            throw new Error('Tin nhắn mã hóa và mật khẩu không được để trống!');
        }

        // Giải mã sử dụng CryptoJS
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, password);
        const originalMessage = decrypted.toString(CryptoJS.enc.Utf8);

        if (!originalMessage) {
            throw new Error('Mật khẩu không đúng hoặc tin nhắn bị lỗi!');
        }

        return originalMessage;
    } catch (error) {
        console.error('Lỗi giải mã:', error);
        throw new Error('Không thể giải mã tin nhắn. Vui lòng kiểm tra lại mật khẩu!');
    }
}

/**
 * Validate mật khẩu
 * @param {string} password - Mật khẩu cần validate
 * @returns {object} - Kết quả validation
 */
function validatePassword(password) {
    const result = {
        valid: true,
        message: ''
    };

    if (!password) {
        result.valid = false;
        result.message = 'Mật khẩu không được để trống!';
        return result;
    }

    if (password.length < 8) {
        result.valid = false;
        result.message = 'Mật khẩu phải có ít nhất 8 ký tự!';
        return result;
    }

    if (password.length > 32) {
        result.valid = false;
        result.message = 'Mật khẩu không được quá 32 ký tự!';
        return result;
    }

    result.message = 'Mật khẩu hợp lệ!';
    return result;
}

/**
 * Tạo hash từ mật khẩu (để so sánh mật khẩu)
 * @param {string} password 
 * @returns {string}
 */
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

/**
 * Mã hóa với TripleDES
 * @param {string} message 
 * @param {string} password 
 * @returns {string}
 */
function encryptTripleDES(message, password) {
    try {
        const encrypted = CryptoJS.TripleDES.encrypt(message, password).toString();
        return encrypted;
    } catch (error) {
        console.error('Lỗi mã hóa TripleDES:', error);
        throw error;
    }
}

/**
 * Giải mã với TripleDES
 * @param {string} encryptedMessage 
 * @param {string} password 
 * @returns {string}
 */
function decryptTripleDES(encryptedMessage, password) {
    try {
        const decrypted = CryptoJS.TripleDES.decrypt(encryptedMessage, password);
        const originalMessage = decrypted.toString(CryptoJS.enc.Utf8);
        if (!originalMessage) {
            throw new Error('Mật khẩu không đúng!');
        }
        return originalMessage;
    } catch (error) {
        throw new Error('Không thể giải mã tin nhắn!');
    }
}

/**
 * Mã hóa với Rabbit
 * @param {string} message 
 * @param {string} password 
 * @returns {string}
 */
function encryptRabbit(message, password) {
    try {
        const encrypted = CryptoJS.Rabbit.encrypt(message, password).toString();
        return encrypted;
    } catch (error) {
        console.error('Lỗi mã hóa Rabbit:', error);
        throw error;
    }
}

/**
 * Giải mã với Rabbit
 * @param {string} encryptedMessage 
 * @param {string} password 
 * @returns {string}
 */
function decryptRabbit(encryptedMessage, password) {
    try {
        const decrypted = CryptoJS.Rabbit.decrypt(encryptedMessage, password);
        const originalMessage = decrypted.toString(CryptoJS.enc.Utf8);
        if (!originalMessage) {
            throw new Error('Mật khẩu không đúng!');
        }
        return originalMessage;
    } catch (error) {
        throw new Error('Không thể giải mã tin nhắn!');
    }
}

/**
 * Mã hóa với thuật toán được chọn
 * @param {string} message 
 * @param {string} password 
 * @param {string} algorithm 
 * @returns {string}
 */
function encryptWithAlgorithm(message, password, algorithm = 'aes') {
    switch (algorithm) {
        case 'tripledes':
            return encryptTripleDES(message, password);
        case 'rabbit':
            return encryptRabbit(message, password);
        case 'aes':
        default:
            return encryptMessage(message, password);
    }
}

/**
 * Giải mã với thuật toán được chọn
 * @param {string} encryptedMessage 
 * @param {string} password 
 * @param {string} algorithm 
 * @returns {string}
 */
function decryptWithAlgorithm(encryptedMessage, password, algorithm = 'aes') {
    switch (algorithm) {
        case 'tripledes':
            return decryptTripleDES(encryptedMessage, password);
        case 'rabbit':
            return decryptRabbit(encryptedMessage, password);
        case 'aes':
        default:
            return decryptMessage(encryptedMessage, password);
    }
}