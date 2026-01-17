// src/pages/auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaLock, 
  FaCheckCircle, 
  FaEye, 
  FaEyeSlash,
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './Auth.module.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const API_BASE = process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    setError('');
  };

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Include at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Include at least one special character';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_BASE}/api/auth/reset-password/${token}`,
        { password: formData.password },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 
        }
      );

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successfully. Please login with your new password.' }
        });
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else if (err.response?.status === 400) {
        setError('Invalid or expired reset token. Please request a new password reset.');
      } else if (err.response?.status === 422) {
        setError('Invalid password format. Please follow the password requirements.');
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Password reset failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    switch(strength) {
      case 0: return '#ef4444';
      case 1: return '#ef4444';
      case 2: return '#f97316';
      case 3: return '#eab308';
      case 4: return '#22c55e';
      default: return '#9ca3af';
    }
  };

  const getStrengthLabel = (strength) => {
    switch(strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  if (success) {
    return (
      <div className={styles.authPage}>
        <div className={styles.authBackground}>
          <div className={styles.particleContainer}>
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className={styles.particle}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className={styles.authContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.authCard}>
            <div className={styles.successState}>
              <motion.div 
                className={styles.successIconWrapper}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <FaCheckCircle className={styles.successIcon} />
              </motion.div>
              
              <div className={styles.successContent}>
                <h2>Password Reset Successful!</h2>
                <p className={styles.successMessage}>
                  Your password has been reset successfully.
                </p>
                
                <div className={styles.nextSteps}>
                  <h4>Next Steps:</h4>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>1</div>
                    <p>You'll be redirected to the login page</p>
                  </div>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>2</div>
                    <p>Sign in with your new password</p>
                  </div>
                  <div className={styles.stepItem}>
                    <div className={styles.stepNumber}>3</div>
                    <p>Access your dashboard and continue building</p>
                  </div>
                </div>

                <div className={styles.successActions}>
                  <p className={styles.redirectMessage}>
                    Redirecting to login in 3 seconds...
                  </p>
                  <Link to="/login" className={styles.loginNowButton}>
                    Login Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackground}>
        <div className={styles.particleContainer}>
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        className={styles.authContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <Link to="/login" className={styles.backLink}>
              <FaArrowLeft /> Back to Login
            </Link>
            <div className={styles.headerContent}>
              <h1>Create New Password</h1>
              <p>Choose a strong password to secure your account</p>
            </div>
          </div>

          {error && (
            <motion.div 
              className={styles.errorAlert}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            {/* New Password */}
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaLock className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthMeter}>
                    <div 
                      className={styles.strengthBar}
                      style={{ 
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getStrengthColor(passwordStrength)
                      }}
                    />
                  </div>
                  <span className={styles.strengthLabel}>
                    Strength: <strong style={{ color: getStrengthColor(passwordStrength) }}>
                      {getStrengthLabel(passwordStrength)}
                    </strong>
                  </span>
                </div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaLock className={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>

            {/* Password Requirements */}
            <div className={styles.passwordRequirements}>
              <h4>Password Requirements:</h4>
              <ul className={styles.requirementsList}>
                <li className={formData.password.length >= 8 ? styles.requirementMet : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? styles.requirementMet : ''}>
                  One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? styles.requirementMet : ''}>
                  One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.password) ? styles.requirementMet : ''}>
                  One special character
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading || passwordStrength < 3 || formData.password !== formData.confirmPassword}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.buttonSpinner} />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>

          <div className={styles.securityNote}>
            <p>
              <strong>Security Tip:</strong> Use a unique password that you don't use on other websites.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;