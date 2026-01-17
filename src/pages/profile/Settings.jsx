/* src/components/ pages/ profile*/

import React, { useState } from 'react';
import { FaLock, FaBell, FaPalette, FaLanguage, FaTrash, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Settings.module.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('security');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        resumeTips: true,
        templateUpdates: false,
        promotional: false
    });

    const tabs = [
        { id: 'security', label: 'Security', icon: <FaLock /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
        { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
        { id: 'language', label: 'Language', icon: <FaLanguage /> },
        { id: 'danger', label: 'Danger Zone', icon: <FaTrash /> }
    ];

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        try {
            // Implement password change API call
            alert('Password changed successfully!');
            setPasswordForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            alert('Failed to change password');
        }
    };

    const handleNotificationToggle = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key]
        });
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
            // Implement account deletion
            alert('Account deletion request sent. Check your email for confirmation.');
        }
    };

    const handleExportData = () => {
        // Implement data export
        alert('Data export started. You will receive an email with your data.');
    };

    const renderSecurityTab = () => (
        <div className={styles.settingsSection}>
            <h3>Change Password</h3>
            <p>Update your password to keep your account secure.</p>
            
            <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                <div className={styles.inputGroup}>
                    <label>Current Password</label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            required
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>New Password</label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            required
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Confirm New Password</label>
                    <div className={styles.passwordInput}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            required
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={styles.passwordRequirements}>
                    <p><strong>Password Requirements:</strong></p>
                    <ul>
                        <li>At least 6 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Includes numbers and special characters</li>
                    </ul>
                </div>

                <button type="submit" className={styles.submitButton}>
                    <FaKey /> Update Password
                </button>
            </form>

            <div className={styles.securityFeatures}>
                <h4>Security Features</h4>
                <div className={styles.featureGrid}>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>🔐</div>
                        <div>
                            <h5>Two-Factor Authentication</h5>
                            <p>Add an extra layer of security to your account</p>
                            <button className={styles.featureButton}>Enable 2FA</button>
                        </div>
                    </div>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>📱</div>
                        <div>
                            <h5>Active Sessions</h5>
                            <p>Manage devices logged into your account</p>
                            <button className={styles.featureButton}>View Sessions</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className={styles.settingsSection}>
            <h3>Notification Preferences</h3>
            <p>Choose what notifications you want to receive.</p>
            
            <div className={styles.notificationSettings}>
                {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className={styles.notificationItem}>
                        <div>
                            <h5>{key.split(/(?=[A-Z])/).join(' ')}</h5>
                            <p>Receive notifications about {key.toLowerCase().replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => handleNotificationToggle(key)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                ))}
            </div>

            <div className={styles.emailPreferences}>
                <h4>Email Preferences</h4>
                <div className={styles.emailFrequency}>
                    <label>Email Frequency:</label>
                    <select className={styles.selectInput}>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                        <option value="monthly">Monthly Report</option>
                        <option value="never">Never</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className={styles.settingsSection}>
            <h3>Appearance Settings</h3>
            <p>Customize how the application looks and feels.</p>
            
            <div className={styles.themeSettings}>
                <h4>Theme</h4>
                <div className={styles.themeOptions}>
                    <button className={`${styles.themeOption} ${styles.active}`}>
                        <div className={styles.themePreviewLight}></div>
                        <span>Light</span>
                    </button>
                    <button className={styles.themeOption}>
                        <div className={styles.themePreviewDark}></div>
                        <span>Dark</span>
                    </button>
                    <button className={styles.themeOption}>
                        <div className={styles.themePreviewAuto}></div>
                        <span>Auto</span>
                    </button>
                </div>
            </div>

            <div className={styles.colorSettings}>
                <h4>Primary Color</h4>
                <div className={styles.colorOptions}>
                    {['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                        <button
                            key={color}
                            className={styles.colorOption}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.fontSettings}>
                <h4>Font Size</h4>
                <div className={styles.fontSizeSlider}>
                    <span>Small</span>
                    <input type="range" min="12" max="20" defaultValue="16" className={styles.slider} />
                    <span>Large</span>
                </div>
            </div>
        </div>
    );

    const renderLanguageTab = () => (
        <div className={styles.settingsSection}>
            <h3>Language & Region</h3>
            <p>Set your preferred language and regional settings.</p>
            
            <div className={styles.languageSettings}>
                <div className={styles.inputGroup}>
                    <label>Language</label>
                    <select className={styles.selectInput}>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Time Zone</label>
                    <select className={styles.selectInput}>
                        <option value="utc-5">Eastern Time (UTC-5)</option>
                        <option value="utc-6">Central Time (UTC-6)</option>
                        <option value="utc-7">Mountain Time (UTC-7)</option>
                        <option value="utc-8">Pacific Time (UTC-8)</option>
                        <option value="utc+5:30">IST (UTC+5:30)</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label>Date Format</label>
                    <select className={styles.selectInput}>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderDangerTab = () => (
        <div className={styles.settingsSection}>
            <h3>Danger Zone</h3>
            <p>Irreversible actions that affect your account.</p>
            
            <div className={styles.dangerActions}>
                <div className={styles.dangerItem}>
                    <div>
                        <h5>Export Account Data</h5>
                        <p>Download all your data including resumes, templates, and settings.</p>
                    </div>
                    <button onClick={handleExportData} className={styles.exportButton}>
                        Export Data
                    </button>
                </div>

                <div className={styles.dangerItem}>
                    <div>
                        <h5>Delete Account</h5>
                        <p>Permanently delete your account and all associated data.</p>
                    </div>
                    <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                        Delete Account
                    </button>
                </div>
            </div>

            <div className={styles.warningBox}>
                <h4>⚠️ Important Notes</h4>
                <ul>
                    <li>Account deletion is permanent and cannot be undone</li>
                    <li>All your resumes and data will be permanently deleted</li>
                    <li>Any active subscriptions will be canceled</li>
                    <li>You will lose access to all premium features immediately</li>
                </ul>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'security': return renderSecurityTab();
            case 'notifications': return renderNotificationsTab();
            case 'appearance': return renderAppearanceTab();
            case 'language': return renderLanguageTab();
            case 'danger': return renderDangerTab();
            default: return renderSecurityTab();
        }
    };

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsHeader}>
                <h1>Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className={styles.settingsLayout}>
                {/* Tabs Sidebar */}
                <div className={styles.tabsSidebar}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className={styles.tabIcon}>{tab.icon}</span>
                            <span className={styles.tabLabel}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className={styles.contentArea}>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Settings;