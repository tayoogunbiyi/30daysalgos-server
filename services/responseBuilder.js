const buildResponse = (message, body, success = false) => ({
  message,
  body,
  success,
});

module.exports = {
  buildResponse,
};
