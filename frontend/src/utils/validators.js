export const validateEmail = (email = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const required = (value = '') => value.trim().length > 0;

export const validatePassword = (password = '') => password.length >= 8;

