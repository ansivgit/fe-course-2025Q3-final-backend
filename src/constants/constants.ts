export const CONSTANTS = {
  DEFAULT_PORT: 3000,
  HTTP_STATUS_OK: 200,
  HTTP_STATUS_CREATED: 201,
  HTTP_STATUS_NO_CONTENT: 204,
  HTTP_STATUS_BAD_REQUEST: 400,
  HTTP_STATUS_INTERNAL_ERROR: 500,
};

export const ROUTES = {
  HEALTH: '/health',
  DOCS: '/docs',
  CHAT: '/agent/chat',
  DICTIONARIES: '/agent/dictionaries',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DATA: '/data',
  USER: '/user',
  PROGRESS: '/progress',
};

export const DB_COLLECTIONS = {
  USERS: 'users',
  PROGRESS: 'progress',
  DATA: 'data',
};
