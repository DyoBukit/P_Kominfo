export const validateEmail = (email) => {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format.";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required.`;
  }
  return '';
};
