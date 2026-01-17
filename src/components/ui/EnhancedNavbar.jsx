// src/components/ui/EnhancedNavbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFilePdf, FaBars, FaTimes, FaUser, FaBell } from 'react-icons/fa';
import styles from './EnhancedNavbar.module.css';

const EnhancedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <FaFilePdf className={styles.logoIcon} />
          <span className={styles.logoText}>
            <span className={styles.logoPrimary}>Resume</span>
            <span className={styles.logoSecondary}>Pro</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <div className={styles.navGroup}>
            <Link to="/templates" className={styles.navLink}>
              Templates
            </Link>
            <Link to="/features" className={styles.navLink}>
              Features
            </Link>
            <Link to="/pricing" className={styles.navLink}>
              Pricing
            </Link>
            <Link to="/examples" className={styles.navLink}>
              Examples
            </Link>
          </div>
          
          <div className={styles.authGroup}>
            <button 
              className={styles.notificationButton}
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
            >
              <FaBell />
            </button>
            <button 
              className={styles.loginButton}
              onClick={() => navigate('/login')}
            >
              <FaUser /> Log In
            </button>
            <button 
              className={styles.signupButton}
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileNav}>
          <Link to="/templates" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Templates
          </Link>
          <Link to="/features" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Features
          </Link>
          <Link to="/pricing" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Pricing
          </Link>
          <Link to="/examples" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Examples
          </Link>
          <Link to="/blog" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
            Blog
          </Link>
        </div>
        
        <div className={styles.mobileAuth}>
          <button 
            className={styles.mobileLogin}
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/login');
            }}
          >
            <FaUser /> Log In
          </button>
          <button 
            className={styles.mobileSignup}
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/register');
            }}
          >
            Start Building Free
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedNavbar;