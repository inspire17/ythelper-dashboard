import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser, checkUsernameAvailability } from '../api/AuthApis';
import Select from 'react-select';
import PhoneInput from 'react-phone-number-input';
import { ToastContainer, toast } from 'react-toastify';
import { TOAST_CONFIG, SIGNUP_MESSAGES } from '../constants/Constants';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';
import '../styles/Signup.css';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa'; // Icons

const roleOptions = [
  { value: 'USERS', label: 'USER' },
  { value: 'EDITORS', label: 'EDITOR' },
];

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    emailId: '',
    mobileNumber: '',
    password: '',
    userRole: { value: 'USERS', label: 'USER' },
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = selectedOption => {
    setFormData({ ...formData, userRole: selectedOption });
  };

  // Handle phone number input
  const handlePhoneChange = value => {
    setFormData({ ...formData, mobileNumber: value });
  };

  // Check username availability
  const handleUsernameChange = async e => {
    const username = e.target.value;
    setFormData({ ...formData, username });

    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    try {
      setLoading(true);
      const response = await checkUsernameAvailability(username);
      const data = await response.json();
      setUsernameAvailable(!data.exists);
    } catch (error) {
      setUsernameAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async e => {
    e.preventDefault();

    if (usernameAvailable === false) {
      toast.error(SIGNUP_MESSAGES.USERNAME_TAKEN, TOAST_CONFIG);
      return;
    }

    try {
      const userPayload = {
        ...formData,
        userRole: formData.userRole.value,
      };

      const response = await signupUser(userPayload);
      if (response.status === 400) {
        const data = await response.json();
        if (Array.isArray(data)) {
          data.forEach(error => {
            toast.error(error, TOAST_CONFIG);
          });
        } else {
          toast.error(SIGNUP_MESSAGES.ERROR, TOAST_CONFIG);
        }
        return;
      }

      toast.success(SIGNUP_MESSAGES.SUCCESS, TOAST_CONFIG);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(SIGNUP_MESSAGES.ERROR, TOAST_CONFIG);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-box">
        {/* Company Logo */}
        <img
          src="https://media.sproutsocial.com/uploads/1c_youtube-cover-photo_clean@1x-1.png"
          alt="Company Logo"
          className="company-logo"
        />

        <h2>Sign Up</h2>

        <form onSubmit={handleSignup}>
          {/* Username Input with Tick and Cross Icons */}
          <div className="username-input-container">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleUsernameChange}
              className={`full-width-input ${
                usernameAvailable === null
                  ? ''
                  : usernameAvailable
                    ? 'available'
                    : 'unavailable'
              }`}
              required
            />
            <div className="icon-container">
              {loading && <FaSpinner className="loading-spinner" />}
              {!loading && usernameAvailable === true && (
                <FaCheckCircle className="success-icon" />
              )}
              {!loading && usernameAvailable === false && (
                <FaTimesCircle className="error-icon" />
              )}
            </div>
          </div>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="emailId"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleChange}
            required
          />

          {/* Phone Number Input with Country Code Selection */}
          <PhoneInput
            international
            defaultCountry="US"
            value={formData.mobileNumber}
            onChange={handlePhoneChange}
            className="full-width-input phone-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Role Selection */}
          <Select
            name="userRole"
            value={formData.userRole}
            onChange={handleRoleChange}
            options={roleOptions}
            className="full-width-input"
          />

          <button className="signup-button" type="submit">
            Sign Up
          </button>
        </form>

        <p className="login-text">
          Already have an account?{' '}
          <span className="login-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
