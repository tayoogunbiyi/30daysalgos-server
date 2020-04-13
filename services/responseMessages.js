const INVALID_CREDENTIALS = 'Invalid Email / Password';
const ACCOUNT_NOT_VERIFIED = 'Verify your account before proceeding.';
const MISSING_FIELD = 'Missing field in request body ';
const SUCCESS_MESSAGE = 'succesfully';
const EMAIL_NOT_AVAILABLE = 'Email already taken.';
const SERVER_ERROR = 'An error occured.';
const NOT_FOUND = 'not found';
const INVALID_TOKEN = 'Invalid token';
const SPECIALIZATION_EXISTS = 'This specialization exists already.';

const buildDuplicateMessage = (duplicateField) => {
  return `'${duplicateField}' already exists`
}
module.exports = {
  INVALID_CREDENTIALS,
  ACCOUNT_NOT_VERIFIED,
  SUCCESS_MESSAGE,
  EMAIL_NOT_AVAILABLE,
  SERVER_ERROR,
  MISSING_FIELD,
  NOT_FOUND,
  INVALID_TOKEN,
  SPECIALIZATION_EXISTS,
  buildDuplicateMessage,
};
