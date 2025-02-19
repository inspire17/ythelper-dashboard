export const loginUser = async credentials => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  return response;
};

export const signupUser = async userData => {
  const response = await fetch('http://localhost:8080/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (response.status > 400) {
    throw new Error('Something went wrong');
  }

  return response;
};

export const checkUsernameAvailability = async username => {
  return fetch(`http://localhost:8080/api/auth/username_check?q=${username}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
};

export const sendResetEmail = async payload => {
  return fetch('http://localhost:8080/api/auth/reset_pass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

export const verifyOtpAndResetPassword = async payload => {
  return fetch('http://localhost:8080/api/auth/reset_pass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};
