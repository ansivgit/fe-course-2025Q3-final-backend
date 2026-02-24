export const CONSTANTS = {
  DEFAULT_PORT: 3000,
  HTTP_STATUS_OK: 200,
  HTTP_STATUS_BAD_REQUEST: 400,
  HTTP_STATUS_INTERNAL_ERROR: 500,
};

export const RES_ERROR_MESSAGES = {
  400: 'Invalid credentials',
  401: 'User is not authorized',
  '403_login': 'User not found. Please sign up',
  '403_pswd': 'Invalid password',
  409: 'User already exist. Please login',
  500: 'Internal Server error',
} as const;

export const ROUTES = {
  HEALTH: '/health',
  DOCS: '/api-docs',
  CHAT: '/api/chat',
  DICTIONARIES: '/api/dictionaries',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
};
