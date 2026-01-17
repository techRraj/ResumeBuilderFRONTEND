// src/Components/ui/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaCrown, FaFilePdf, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styles from './Navbar.module.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const subscription = user.subscription || 'free';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/templates', label: 'Templates' },
        { path: '/editor', label: 'Create Resume' },
        { path: '/profile', label: 'Profile' }
    ];

    const getSubscriptionBadge = () => {
        const badges = {
            'free': { label: 'Free', color: '#6b7280', icon: null },
            'basic': { label: 'Basic', color: '#3b82f6', icon: null },
            'premium': { label: 'Premium', color: '#8b5cf6', icon: <FaCrown /> },
            'vip': { label: 'VIP', color: '#f59e0b', icon: <FaCrown /> }
        };
        return badges[subscription] || badges.free;
    };

    const badge = getSubscriptionBadge();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo}>
                    <Link to="/dashboard" className={styles.logoLink}>
                        <FaFilePdf className={styles.logoIcon} />
                        <span>ResumePro</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className={styles.menuToggle}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Navigation Links */}
                <div className={`${styles.navLinks} ${isMenuOpen ? styles.show : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`${styles.navLink} ${
                                location.pathname === link.path ? styles.active : ''
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {/* Subscription Badge */}
                    <Link to="/upgrade" className={styles.subscriptionBadge}>
                        <span 
                            className={styles.badgeDot}
                            style={{ backgroundColor: badge.color }}
                        />
                        {badge.icon && <span className={styles.badgeIcon}>{badge.icon}</span>}
                        <span className={styles.badgeLabel}>{badge.label}</span>
                    </Link>

                    {/* User Menu */}
                    <div className={styles.userMenu}>
                        <button 
                            className={styles.userButton}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className={styles.userAvatar}>
                                <FaUser />
                            </div>
                            <span className={styles.userName}>
                                {user.name?.split(' ')[0] || 'User'}
                            </span>
                        </button>

                        {showUserMenu && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.dropdownHeader}>
                                    <p className={styles.userEmail}>{user.email}</p>
                                    <div className={styles.userPlan}>
                                        <span className={styles.planLabel}>Plan:</span>
<span>
  Plan: {user.subscription?.plan || 'Free'} 
  ({user.subscription?.status || 'Active'})
</span>
                                    </div>
                                </div>
                                
                                <div className={styles.dropdownDivider} />

                                <Link 
                                    to="/profile" 
                                    className={styles.dropdownItem}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <FaUser className={styles.dropdownIcon} />
                                    My Profile
                                </Link>
                                
                                <Link 
                                    to="/settings" 
                                    className={styles.dropdownItem}
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Settings
                                </Link>

                                <div className={styles.dropdownDivider} />

                                <button 
                                    className={`${styles.dropdownItem} ${styles.logoutItem}`}
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt className={styles.dropdownIcon} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;