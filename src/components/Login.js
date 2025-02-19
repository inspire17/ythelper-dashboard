import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/AuthApis';
import { useAuth } from '../context/AuthContext';
import {
  LOGIN_MESSAGES,
  TOAST_CONFIG,
  CONSTANTS,
} from '../constants/Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await loginUser(credentials);
      const data = await response.json();
      const { token, message } = data;

      if (message === LOGIN_MESSAGES.USER_APPROVAL_PENDING) {
        toast.warning(LOGIN_MESSAGES.USER_APPROVAL_PENDING, TOAST_CONFIG);
        return;
      } else if (message === LOGIN_MESSAGES.EMAIL_NOT_VERIFIED) {
        toast.info(LOGIN_MESSAGES.EMAIL_NOT_VERIFIED_FULL_TEXT, TOAST_CONFIG);
        return;
      }

      if (!token) {
        toast.error(LOGIN_MESSAGES.GENERIC_ERROR, TOAST_CONFIG);
        return;
      }

      const payloadToDispatch = {
        token: token,
        user: credentials.username,
      };

      dispatch({ type: 'LOGIN', payload: payloadToDispatch });
      localStorage.setItem(CONSTANTS.TOKEN_KEY, token);

      toast.success(LOGIN_MESSAGES.SUCCESS, TOAST_CONFIG);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Login Error:', err);

      if (err.response) {
        const errorMessage = await err.response.json();
        toast.error(
          errorMessage.message || LOGIN_MESSAGES.INVALID_CREDENTIALS,
          TOAST_CONFIG
        );
      } else {
        toast.error(LOGIN_MESSAGES.INVALID_CREDENTIALS, TOAST_CONFIG);
      }
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />

      <div className="login-box">
        {/* Company Logo */}
        <img
          src="https://media.sproutsocial.com/uploads/1c_youtube-cover-photo_clean@1x-1.png"
          alt="Company Logo"
          className="company-logo"
        />

        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={e =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={e =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        {/* Reset Password Option */}
        <p className="reset-password-text">
          <span
            className="reset-password-link"
            onClick={() => navigate('/reset-password')}
          >
            Forgot Password?
          </span>
        </p>

        {/* Signup Option */}
        <p className="signup-text">
          Don't have an account?{' '}
          <span className="signup-link" onClick={() => navigate('/signup')}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
