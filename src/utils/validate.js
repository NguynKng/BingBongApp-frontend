export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhoneNumber(phone) {
    const vnPhoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    const intlPhoneRegex = /^\+84[3|5|7|8|9][0-9]{8}$/;
    const cleanPhone = phone.replace(/\s+/g, '');
    return vnPhoneRegex.test(cleanPhone) || intlPhoneRegex.test(cleanPhone);
}