export const validateLogin = ({ username, password }) => {
  if (!username || !password) {
    throw new Error("El nombre de usuario y la contraseña son obligatorios.");
  }
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres.");
  }
};
