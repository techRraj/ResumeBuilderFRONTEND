/* src/components/ pages/ profile*/

import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaGlobe, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import styles from './Profile.module.css';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load user data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            location: user.location || '',
            linkedin: user.linkedin || '',
            github: user.github || '',
            website: user.website || ''
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Save profile data
            const API_BASE=process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Update local storage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
                
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
                <h1>My Profile</h1>
                <p>Manage your personal information and account settings</p>
            </div>

            <div className={styles.profileGrid}>
                {/* Left Column - Profile Info */}
                <div className={styles.profileCard}>
                    <div className={styles.cardHeader}>
                        <h2>Personal Information</h2>
                        <button 
                            className={styles.editButton}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? <FaTimes /> : <FaEdit />}
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label>
                                    <FaUser className={styles.inputIcon} />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                ) : (
                                    <p className={styles.profileValue}>{formData.name}</p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    <FaEnvelope className={styles.inputIcon} />
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                ) : (
                                    <p className={styles.profileValue}>{formData.email}</p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    <FaPhone className={styles.inputIcon} />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className={styles.profileValue}>{formData.phone || 'Not provided'}</p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    <FaMapMarkerAlt className={styles.inputIcon} />
                                    Location
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className={styles.profileValue}>{formData.location || 'Not provided'}</p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    <FaLinkedin className={styles.inputIcon} />
                                    LinkedIn
                                </label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/username"
                                    />
                                ) : (
                                    <p className={styles.profileValue}>
                                        {formData.linkedin ? (
                                            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">
                                                {formData.linkedin}
                                            </a>
                                        ) : 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    <FaGithub className={styles.inputIcon} />
                                    GitHub
                                </label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/username"
                                    />
                                ) : (
                                    <p className={styles.profileValue}>
                                        {formData.github ? (
                                            <a href={formData.github} target="_blank" rel="noopener noreferrer">
                                                {formData.github}
                                            </a>
                                        ) : 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>
                                    <FaGlobe className={styles.inputIcon} />
                                    Website
                                </label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://yourwebsite.com"
                                    />
                                ) : (
                                    <p className={styles.profileValue}>
                                        {formData.website ? (
                                            <a href={formData.website} target="_blank" rel="noopener noreferrer">
                                                {formData.website}
                                            </a>
                                        ) : 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className={styles.formActions}>
                                <button 
                                    type="submit" 
                                    className={styles.saveButton}
                                    disabled={loading}
                                >
                                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Right Column - Stats & Info */}
                <div className={styles.statsColumn}>
                    {/* Account Stats */}
                    <div className={styles.statsCard}>
                        <h3>Account Stats</h3>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>12</div>
                                <div className={styles.statLabel}>Resumes Created</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>45</div>
                                <div className={styles.statLabel}>Downloads</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>3</div>
                                <div className={styles.statLabel}>Templates Used</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statValue}>7</div>
                                <div className={styles.statLabel}>Days Active</div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Info */}
                    <div className={styles.subscriptionCard}>
                        <h3>Subscription</h3>
                        <div className={styles.subscriptionInfo}>
                            <div className={styles.planBadge}>
<span className={styles.planName}>
  {typeof user.subscription === 'object' 
    ? user.subscription.plan 
    : user.subscription || 'Free'}
</span>                                <span className={styles.planStatus}>Active</span>
                            </div>
                            <p>Your current plan provides access to basic features</p>
                            <a href="/upgrade" className={styles.upgradeLink}>
                                Upgrade Plan
                            </a>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className={styles.activityCard}>
                        <h3>Recent Activity</h3>
                        <ul className={styles.activityList}>
                            <li>
                                <span className={styles.activityIcon}>📄</span>
                                <div>
                                    <p>Created "Software Engineer Resume"</p>
                                    <span className={styles.activityTime}>2 hours ago</span>
                                </div>
                            </li>
                            <li>
                                <span className={styles.activityIcon}>⬇️</span>
                                <div>
                                    <p>Downloaded PDF resume</p>
                                    <span className={styles.activityTime}>Yesterday</span>
                                </div>
                            </li>
                            <li>
                                <span className={styles.activityIcon}>🎨</span>
                                <div>
                                    <p>Applied "Modern Dev" template</p>
                                    <span className={styles.activityTime}>2 days ago</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
<h2>Profile Settings</h2>
    
    <div className="user-info">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      
      {/* ✅ Correct way to display subscription */}
      <p><strong>Subscription Plan:</strong> 
        <span className="plan-badge">
          {user.subscription?.plan ? 
            user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1) 
            : 'Free'}
        </span>
      </p>
      
      {user.subscription?.status === 'active' && (
        <p className="status-active">✅ Active Subscription</p>
      )}
    </div>

        </div>
    );
};

export default Profile;