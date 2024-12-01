export const BASIC_ENDPOINT = '/api/users';

export const HTTP_STATUS_CODES_MAP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

export const ERRORS_MAP = {
  BODY_REQUIRED: 'Body is required, please check!',
  BODY_MISSED_KEY: 'Please, check all keys!',
  NOT_UUID: 'User id is invalid(or not uuid), please check it!',
  NO_USER: 'Requested user is not with us, please adress!',
  NO_ENDPOINT: 'Such endpoint is not exists, please check!',
};
