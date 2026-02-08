/**
 * Simple validation utility for backend inputs
 */

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
    // Basic phone validation: at least 10 digits, allows +, -, spaces, parentheses
    const re = /^[\d\+\-\s\(\)]{10,20}$/;
    return re.test(String(phone));
};

const validateRequired = (val) => {
    return val !== undefined && val !== null && String(val).trim() !== '';
};

const validateMinLength = (val, length) => {
    return String(val).trim().length >= length;
};

const validateNumeric = (val) => {
    return !isNaN(parseFloat(val)) && isFinite(val);
};

const validateDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};

module.exports = {
    validateEmail,
    validatePhone,
    validateRequired,
    validateMinLength,
    validateNumeric,
    validateDate
};
