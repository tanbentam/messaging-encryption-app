// auth.js - Xác thực và quản lý mật khẩu

/**
 * Kiểm tra mật khẩu có hợp lệ không
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {object} - Kết quả validation
 */
function validatePassword(password) {
    const result = {
        valid: true,
        message: '',
        strength: 'weak'
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

    // Đánh giá độ mạnh mật khẩu
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength >= 3) {
        result.strength = 'strong';
        result.message = 'Mật khẩu mạnh!';
    } else if (strength >= 2) {
        result.strength = 'medium';
        result.message = 'Mật khẩu trung bình!';
    } else {
        result.strength = 'weak';
        result.message = 'Mật khẩu yếu! Nên thêm chữ hoa, số và ký tự đặc biệt.';
    }

    return result;
}

/**
 * So sánh hai mật khẩu
 * @param {string} password1 
 * @param {string} password2 
 * @returns {boolean}
 */
function comparePasswords(password1, password2) {
    return password1 === password2;
}

/**
 * Tạo mật khẩu ngẫu nhiên
 * @param {number} length - Độ dài mật khẩu
 * @returns {string}
 */
function generateRandomPassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

/**
 * Lưu mật khẩu vào localStorage (chỉ để demo - không an toàn)
 * @param {string} key 
 * @param {string} password 
 */
function savePasswordLocally(key, password) {
    try {
        const hash = CryptoJS.SHA256(password).toString();
        localStorage.setItem(`pwd_${key}`, hash);
    } catch (error) {
        console.error('Lỗi lưu mật khẩu:', error);
    }
}

/**
 * Kiểm tra mật khẩu từ localStorage
 * @param {string} key 
 * @param {string} password 
 * @returns {boolean}
 */
function verifyPasswordLocally(key, password) {
    try {
        const storedHash = localStorage.getItem(`pwd_${key}`);
        if (!storedHash) return false;
        
        const hash = CryptoJS.SHA256(password).toString();
        return storedHash === hash;
    } catch (error) {
        console.error('Lỗi xác thực mật khẩu:', error);
        return false;
    }
}