export const isEmpty = (obj = {}) => {
  return Object.keys(obj).length === 0;
};

export const generateHTTPError = (message, status) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};
