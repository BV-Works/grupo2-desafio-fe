export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;


//  Funciones Validadoras (Devuelven true o false)
export const validateEmail = (email) => {
    if (!email) return false;
    return EMAIL_PATTERN.test(email.trim());
};

export const validatePassword = (password) => {
    if (!password) return false;
    return PASSWORD_PATTERN.test(password.trim());
};