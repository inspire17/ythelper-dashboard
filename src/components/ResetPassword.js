import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendResetEmail, verifyOtpAndResetPassword } from '../api/AuthApis';
import { ToastContainer, toast } from 'react-toastify';
import { TOAST_CONFIG } from '../constants/Constants';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    emailId: '',
    otp: '',
    newPassword: '',
  });

  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.emailId) {
      toast.error('Please enter your email.', TOAST_CONFIG);
      return;
    }

    setLoading(true);
    try {
      const response = await sendResetEmail({ emailId: formData.emailId });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, TOAST_CONFIG);
        setEmailSent(true);
      } else {
        toast.error(data.message, TOAST_CONFIG);
      }
    } catch (error) {
      toast.error('Failed to send OTP. Try again.', TOAST_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async e => {
    e.preventDefault();

    if (!formData.otp || !formData.newPassword) {
      toast.error('Enter OTP and new password.', TOAST_CONFIG);
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtpAndResetPassword(formData);
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, TOAST_CONFIG);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message, TOAST_CONFIG);
      }
    } catch (error) {
      toast.error('Failed to reset password. Try again.', TOAST_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <ToastContainer />
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          {/* Email Input */}
          <input
            type="email"
            name="emailId"
            placeholder="Enter your registered email"
            value={formData.emailId}
            onChange={handleChange}
            required
            disabled={emailSent}
          />
          {!emailSent && (
            <button
              type="button"
              className="otp-button"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Generate OTP'}
            </button>
          )}

          {/* OTP & New Password Fields - Show only after OTP is sent */}
          {emailSent && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
