export const CONSTANTS = {
  TOKEN_KEY: 'ytHelper_jwtToken',
};

export const LOGIN_MESSAGES = {
  USER_APPROVAL_PENDING: 'User need to wait for approval. Contact admin.',
  EMAIL_NOT_VERIFIED: 'Email is not verified.',
  EMAIL_NOT_VERIFIED_FULL_TEXT:
    'Email is not verified. Please check your email for verification.',
  INVALID_CREDENTIALS: 'Invalid username or password',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again later.',
};

export const SIGNUP_MESSAGES = {
  SUCCESS: 'Account created successfully! Redirecting to login...',
  VALIDATION_ERROR: 'Validation error. Please check your inputs.',
  GENERAL_ERROR: 'An unexpected error occurred.',
  USERNAME_TAKEN: 'Username is already taken. Try another one.',
  ERROR: 'An unexpected error occurred. Please try again later.',
};

export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 6000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export const RESET_MESSAGES = {
  OTP_SENT: 'OTP has been sent to your email.',
  PASSWORD_UPDATED: 'Password updated successfully! Redirecting...',
  ERROR: 'Something went wrong. Please try again.',
};

export const UPLOAD_VIDEO_MESSAGES = {
  UPLOAD_SUCCESS: 'Video uploaded successfully!',
  REQ_VALID_FILE: 'Please upload a valid video file.',
  ALL_COL_FILL: 'Please fill in all fields and select a video file.',
  UPLOAD_FAILED: 'Upload failed.',
  UPLOAD_CANCELED: 'Upload canceled.',
};
