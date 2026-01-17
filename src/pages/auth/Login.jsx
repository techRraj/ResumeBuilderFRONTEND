// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaGithub,
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Auth.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // API Configuration
  const API_BASE = process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';

  // Check for saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
    
    // Show success message if redirected from registration
    if (location.state?.registered) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  // Form validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(formData.email));
    setPasswordValid(formData.password.length >= 6);
  }, [formData.email, formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Real API call with enhanced error handling
      const response = await axios.post(
        `${API_BASE}/api/auth/login`,
        formData,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000,
          withCredentials: true
        }
      );

      const { token, user, refreshToken } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      localStorage.setItem('user', JSON.stringify({
        id: user._id || user.id,
        name: user.name || user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role || 'user',
        subscription: user.subscription?.plan || 'free',
        emailVerified: user.emailVerified || false,
        lastLogin: new Date().toISOString()
      }));

      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Store login timestamp for session management
      localStorage.setItem('loginTime', new Date().getTime().toString());

      // Show success animation
      setShowSuccess(true);
      
      // Redirect after short delay to show success state
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
      
      // Enhanced error handling
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again in 15 minutes.');
      } else if (err.response?.status === 403) {
        setError('Account is temporarily locked. Please contact support.');
      } else if (err.response?.status === 423) {
        setError('Please verify your email address before logging in.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
      
      // Clear sensitive data on error
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // In a real app, this would redirect to OAuth endpoint
    console.log(`Social login with ${provider}`);
    setError(`${provider} login is coming soon!`);
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className={styles.authPage}>
      {/* Background Animation */}
      <div className={styles.authBackground}>
        <div className={styles.particleContainer}>
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
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
        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              className={styles.successAlert}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <FaCheckCircle className={styles.successIcon} />
              <div>
                <strong>Login Successful!</strong>
                <p>Redirecting to dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.authCard}>
          {/* Card Header */}
          <div className={styles.cardHeader}>
            <motion.div 
              className={styles.logoWrapper}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUser className={styles.logoIcon} />
              <span className={styles.logoText}>ResumePro</span>
            </motion.div>
            
            <div className={styles.headerContent}>
              <h1>Welcome Back</h1>
              <p>Sign in to access your professional resume builder</p>
            </div>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className={styles.errorAlert}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FaExclamationTriangle className={styles.errorIcon} />
                <div className={styles.errorContent}>
                  <strong>Authentication Error</strong>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Login */}
          <div className={styles.socialLogin}>
            <p className={styles.socialText}>Sign in with</p>
            <div className={styles.socialButtons}>
              <motion.button
                type="button"
                className={`${styles.socialButton} ${styles.googleButton}`}
                onClick={() => handleSocialLogin('google')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGoogle /> Google
              </motion.button>
              
              <motion.button
                type="button"
                className={`${styles.socialButton} ${styles.githubButton}`}
                onClick={() => handleSocialLogin('github')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub /> GitHub
              </motion.button>
            </div>
          </div>

          <div className={styles.divider}>
            <span>or continue with email</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaEnvelope className={`${styles.inputIcon} ${emailValid ? styles.valid : ''}`} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="email"
                className={emailValid ? styles.validInput : ''}
              />
              {emailValid && formData.email && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
            </motion.div>

            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaLock className={`${styles.inputIcon} ${passwordValid ? styles.valid : ''}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="current-password"
                className={passwordValid ? styles.validInput : ''}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordValid && formData.password && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
            </motion.div>

            {/* Form Options */}
            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              
              <button
                type="button"
                className={styles.forgotPassword}
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading || !emailValid || !passwordValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className={styles.spinner}></div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Additional Actions */}
          <div className={styles.additionalActions}>
            <p className={styles.signupPrompt}>
              Don't have an account?{' '}
              <Link to="/register" className={styles.signupLink}>
                Create an account
              </Link>
            </p>
            
            <div className={styles.securityNote}>
              <FaLock className={styles.securityIcon} />
              <span>Your data is secured with 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className={styles.demoCredentials}>
            <details className={styles.demoDetails}>
              <summary>Demo Credentials</summary>
              <div className={styles.demoInfo}>
                <p><strong>Email:</strong> demo@resumebuilder.com</p>
                <p><strong>Password:</strong> demo123</p>
                <small>Try these credentials to explore the platform</small>
              </div>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.authFooter}>
          <p>
            By signing in, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </p>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ResumeBuilder Pro. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;