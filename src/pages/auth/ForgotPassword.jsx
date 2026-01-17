// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaEnvelope, 
  FaCheckCircle, 
  FaArrowLeft,
  FaShieldAlt,
  FaSpinner
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ email: value });
    setError('');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !emailValid) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${API_BASE}/api/auth/forgot-password`,
        { email: formData.email },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 
        }
      );

      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else if (err.response?.status === 404) {
        setError('No account found with this email address.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please try again in 15 minutes.');
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to send reset email. Please try again.'
        );
      }
    } finally {
      setLoading(false);
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
                <h2>Check Your Email</h2>
                <p className={styles.successMessage}>
                  We've sent password reset instructions to:
                </p>
                <div className={styles.emailDisplay}>
                  <FaEnvelope className={styles.emailIcon} />
                  <span className={styles.emailText}>{formData.email}</span>
                </div>
                
                <div className={styles.instructions}>
                  <div className={styles.instructionItem}>
                    <div className={styles.instructionBullet}>1</div>
                    <p>Open the email from ResumeBuilder Pro</p>
                  </div>
                  <div className={styles.instructionItem}>
                    <div className={styles.instructionBullet}>2</div>
                    <p>Click the reset password link</p>
                  </div>
                  <div className={styles.instructionItem}>
                    <div className={styles.instructionBullet}>3</div>
                    <p>Create your new password</p>
                  </div>
                </div>

                <div className={styles.reminderBox}>
                  <FaShieldAlt className={styles.reminderIcon} />
                  <p>
                    <strong>Security Reminder:</strong> The reset link will expire in 1 hour.
                    If you don't see the email, check your spam folder.
                  </p>
                </div>

                <div className={styles.successActions}>
                  <Link to="/login" className={styles.backLink}>
                    <FaArrowLeft /> Back to Login
                  </Link>
                  <button 
                    className={styles.resendButton}
                    onClick={() => {
                      setSuccess(false);
                      setError('');
                    }}
                  >
                    Use different email
                  </button>
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
            <div className={styles.headerContent}>
              <h1>Forgot Password?</h1>
              <p>Enter your email to receive reset instructions</p>
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
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaEnvelope className={`${styles.inputIcon} ${emailValid ? styles.valid : ''}`} />
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={emailValid ? styles.validInput : ''}
              />
              {emailValid && formData.email && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
            </motion.div>

            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading || !emailValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.buttonSpinner} />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </motion.button>
          </form>

          <div className={styles.securityNote}>
            <FaShieldAlt className={styles.securityIcon} />
            <span>We'll email you a secure link to reset your password</span>
          </div>

          <div className={styles.authFooter}>
            <div className={styles.footerLinks}>
              <Link to="/login" className={styles.footerLink}>
                <FaArrowLeft /> Back to Login
              </Link>
              <p className={styles.signupPrompt}>
                Don't have an account?{' '}
                <Link to="/register" className={styles.signupLink}>
                  Sign Up
                </Link>
              </p>
            </div>
            
            <div className={styles.supportNote}>
              <p>
                Need help? <Link to="/contact">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;