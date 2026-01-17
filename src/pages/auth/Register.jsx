// src/pages/auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaGoogle, 
  FaGithub,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Auth.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);
  
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';

  // Form validation
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
      
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }

      setErrors(newErrors);
      setFormValid(Object.keys(newErrors).length === 0);
    };

    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValid) return;
    
    setLoading(true);
    setSuccess('');
    setErrors({});

    try {
      const response = await axios.post(
        `${API_BASE}/api/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );

      if (response.data.token && response.data.user) {
        const userData = {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          token: response.data.token,
          subscription: response.data.user.subscription?.plan || 'free',
          emailVerified: response.data.user.emailVerified || false
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);

        setSuccess('Registration successful! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
        setErrors({ email: 'This email is already registered' });
      } else if (err.response?.status === 400) {
        setErrors({ general: 'Registration failed. Please check your details.' });
      } else if (err.code === 'ERR_NETWORK') {
        setErrors({ general: 'Cannot connect to server. Check your internet connection.' });
      } else if (err.response?.status === 422) {
        setErrors({ general: 'Invalid data provided. Please check your information.' });
      } else {
        setErrors({ general: 'Registration failed. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Social register with ${provider}`);
    setErrors({ general: `${provider} registration is coming soon!` });
  };

  const passwordStrength = () => {
    if (!formData.password) return { score: 0, label: '', color: '#9ca3af' };
    
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    
    const strength = [
      { label: 'Very Weak', color: '#ef4444' },
      { label: 'Weak', color: '#f97316' },
      { label: 'Fair', color: '#eab308' },
      { label: 'Good', color: '#22c55e' },
      { label: 'Strong', color: '#16a34a' }
    ][score];
    
    return { score, ...strength };
  };

  const strength = passwordStrength();

  return (
    <div className={styles.authPage}>
      <div className={styles.authBackground}>
        <div className={styles.particleContainer}>
          {[...Array(20)].map((_, i) => (
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
          {/* Card Header */}
          <div className={styles.cardHeader}>
            <div className={styles.headerContent}>
              <h1>Create Your Account</h1>
              <p>Join thousands of professionals building their careers</p>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div 
                className={styles.successAlert}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <FaCheckCircle className={styles.successIcon} />
                <div>
                  <strong>Registration Successful!</strong>
                  <p>Redirecting to dashboard...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Alert */}
          <AnimatePresence>
            {errors.general && (
              <motion.div 
                className={styles.errorAlert}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <FaExclamationTriangle className={styles.errorIcon} />
                <div className={styles.errorContent}>
                  <strong>Registration Error</strong>
                  <p>{errors.general}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social Register */}
          <div className={styles.socialLogin}>
            <p className={styles.socialText}>Sign up with</p>
            <div className={styles.socialButtons}>
              <motion.button
                type="button"
                className={`${styles.socialButton} ${styles.googleButton}`}
                onClick={() => handleSocialRegister('google')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGoogle /> Google
              </motion.button>
              
              <motion.button
                type="button"
                className={`${styles.socialButton} ${styles.githubButton}`}
                onClick={() => handleSocialRegister('github')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGithub /> GitHub
              </motion.button>
            </div>
          </div>

          <div className={styles.divider}>
            <span>or register with email</span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {/* Name Field */}
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaUser className={`${styles.inputIcon} ${formData.name && !errors.name ? styles.valid : ''}`} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {formData.name && !errors.name && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </motion.div>

            {/* Email Field */}
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaEnvelope className={`${styles.inputIcon} ${formData.email && !errors.email ? styles.valid : ''}`} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              {formData.email && !errors.email && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </motion.div>

            {/* Password Field */}
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaLock className={`${styles.inputIcon} ${formData.password && !errors.password ? styles.valid : ''}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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
              {formData.password && !errors.password && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthMeter}>
                    <div 
                      className={styles.strengthBar}
                      style={{ 
                        width: `${(strength.score / 4) * 100}%`,
                        backgroundColor: strength.color 
                      }}
                    />
                  </div>
                  <span className={styles.strengthLabel}>
                    Strength: <strong style={{ color: strength.color }}>{strength.label}</strong>
                  </span>
                </div>
              )}
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div 
              className={styles.inputGroup}
              whileFocus={{ scale: 1.02 }}
            >
              <FaLock className={`${styles.inputIcon} ${formData.confirmPassword && !errors.confirmPassword ? styles.valid : ''}`} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
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
              {formData.confirmPassword && !errors.confirmPassword && (
                <FaCheckCircle className={styles.validationIcon} />
              )}
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </motion.div>

            {/* Terms & Conditions */}
            <div className={styles.termsGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className={styles.termsLink}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" target="_blank" className={styles.termsLink}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <span className={styles.errorText}>{errors.acceptTerms}</span>
              )}
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading || !formValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <FaSpinner className={styles.buttonSpinner} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Additional Actions */}
          <div className={styles.additionalActions}>
            <p className={styles.loginPrompt}>
              Already have an account?{' '}
              <Link to="/login" className={styles.loginLink}>
                Sign In
              </Link>
            </p>
            
            <div className={styles.benefits}>
              <h4>Why join ResumeBuilder Pro?</h4>
              <ul className={styles.benefitsList}>
                <li>50+ professional resume templates</li>
                <li>ATS optimization for better results</li>
                <li>Real-time resume preview</li>
                <li>Mobile-friendly editor</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;