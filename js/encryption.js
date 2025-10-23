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