// In src/pages/payment/Upgrade.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCrown, FaCheck, FaShieldAlt} from 'react-icons/fa';
import styles from './Upgrade.module.css';

const Upgrade = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('premium');
    const [billingCycle, setBillingCycle] = useState('monthly');
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { required, templateName, templateId } = location.state || {};

    const plans = {
        free: {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Basic features to get started',
            features: ['3 Free Templates', 'Limited Downloads (3/month)', 'Watermarked PDFs', 'Basic Support'],
            cta: 'Current Plan',
            disabled: true
        },
        basic: {
            name: 'Basic',
            price: { monthly: 4.99, yearly: 49.99 },
            description: 'For casual users',
            features: ['10 Premium Templates', '20 Downloads/month', 'No Watermarks', 'Email Support'],
            cta: 'Upgrade to Basic',
            popular: false
        },
        premium: {
            name: 'Premium',
            price: { monthly: 9.99, yearly: 99.99 },
            description: 'Most popular choice',
            features: ['All 50+ Templates', 'Unlimited Downloads', 'Priority Support', 'Custom Colors', 'PDF & DOCX Export'],
            cta: 'Upgrade to Premium',
            popular: true
        },
        vip: {
            name: 'VIP',
            price: { monthly: 29.99, yearly: 299.99 },
            description: 'For professionals & agencies',
            features: ['VIP Templates (Exclusive)', 'Unlimited Everything', '24/7 Priority Support', 'AI Resume Review', 'Custom Template Design', 'Team Management'],
            cta: 'Go VIP',
            popular: false
        }
    };

    const handleUpgrade = (plan) => {
        if (plan === 'free') return;
        
        navigate('/checkout', {
            state: {
                subscription: {
                    id: plan,
                    name: plans[plan].name,
                    price: billingCycle === 'yearly' 
                        ? plans[plan].price.yearly 
                        : plans[plan].price.monthly,
                    billingCycle
                },
                templateId: templateId,
                templateName: templateName,
                requiredPlan: required
            }
        });
    };

    const calculateSavings = (plan) => {
        if (billingCycle === 'yearly') {
            const monthlyPrice = plans[plan].price.monthly * 12;
            const yearlyPrice = plans[plan].price.yearly;
            return monthlyPrice - yearlyPrice;
        }
        return 0;
    };

    return (
        <div className={styles.upgradeContainer}>
            {/* Header */}
            <div className={styles.header}>
                <h1>Upgrade Your Experience</h1>
                <p>Unlock powerful features to build better resumes faster</p>
                {required && templateName && (
                    <div className={styles.requiredAlert}>
                        ⚠️ The <strong>"{templateName}"</strong> template requires a{' '}
                        <strong>{required === 'premium' ? 'Premium' : 'VIP'}</strong> subscription
                    </div>
                )}
                {required && !templateName && (
                    <div className={styles.requiredAlert}>
                        ⚠️ This feature requires <strong>{required === 'premium' ? 'Premium' : 'VIP'}</strong> subscription
                    </div>
                )}
            </div>

            {/* Billing Toggle */}
            <div className={styles.billingToggle}>
                <div className={styles.toggleContainer}>
                    <button
                        className={`${styles.toggleButton} ${billingCycle === 'monthly' ? styles.active : ''}`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`${styles.toggleButton} ${billingCycle === 'yearly' ? styles.active : ''}`}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        Yearly
                        <span className={styles.saveBadge}>Save 20%</span>
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className={styles.plansGrid}>
                {Object.entries(plans).map(([key, plan]) => {
                    const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
                    const isCurrentPlan = user.subscription === key;
                    const savings = calculateSavings(key);
                    const isRecommended = (required === 'premium' && key === 'premium') || 
                                         (required === 'vip' && key === 'vip') || 
                                         plan.popular;

                    return (
                        <div 
                            key={key}
                            className={`${styles.planCard} ${
                                selectedPlan === key ? styles.selected : ''
                            } ${isRecommended ? styles.recommended : ''} ${
                                isCurrentPlan ? styles.currentPlan : ''
                            }`}
                            onClick={() => !plan.disabled && setSelectedPlan(key)}
                        >
                            {isRecommended && (
                                <div className={styles.recommendedBadge}>
                                    <FaCrown /> Recommended
                                </div>
                            )}

                            {isCurrentPlan && (
                                <div className={styles.currentBadge}>
                                    Current Plan
                                </div>
                            )}

                            <div className={styles.planHeader}>
                                <h3>{plan.name}</h3>
                                <p className={styles.planDescription}>{plan.description}</p>
                                
                                <div className={styles.priceSection}>
                                    <div className={styles.price}>
                                        ${price.toFixed(2)}
                                        <span className={styles.billingPeriod}>
                                            /{billingCycle === 'yearly' ? 'year' : 'month'}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && price > 0 && (
                                        <div className={styles.savings}>
                                            Save ${savings.toFixed(2)} yearly
                                        </div>
                                    )}
                                </div>
                            </div>

                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, index) => (
                                    <li key={index}>
                                        <FaCheck className={styles.featureIcon} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`${styles.upgradeButton} ${
                                    isCurrentPlan ? styles.currentButton : ''
                                } ${plan.disabled ? styles.disabledButton : ''}`}
                                onClick={() => handleUpgrade(key)}
                                disabled={plan.disabled}
                            >
                                {isCurrentPlan ? 'Current Plan' : plan.cta}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Feature Comparison */}
            <div className={styles.featureComparison}>
                <h2>Compare All Features</h2>
                <table className={styles.comparisonTable}>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Free</th>
                            <th>Basic</th>
                            <th>Premium</th>
                            <th>VIP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Templates</td>
                            <td>3</td>
                            <td>10+</td>
                            <td>50+</td>
                            <td>100+</td>
                        </tr>
                        <tr>
                            <td>Downloads</td>
                            <td>3/month</td>
                            <td>20/month</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Watermarks</td>
                            <td>Yes</td>
                            <td>No</td>
                            <td>No</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>Support</td>
                            <td>Basic</td>
                            <td>Email</td>
                            <td>Priority</td>
                            <td>24/7 VIP</td>
                        </tr>
                        <tr>
                            <td>Export Formats</td>
                            <td>PDF</td>
                            <td>PDF</td>
                            <td>PDF, DOCX</td>
                            <td>PDF, DOCX, PNG</td>
                        </tr>
                        <tr>
                            <td>AI Review</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>✓</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* FAQ */}
            <div className={styles.faqSection}>
                <h2>Frequently Asked Questions</h2>
                <div className={styles.faqGrid}>
                    <div className={styles.faqItem}>
                        <h4>Can I cancel anytime?</h4>
                        <p>Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Do you offer refunds?</h4>
                        <p>We offer a 14-day money-back guarantee for all paid plans if you're not satisfied.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Can I switch plans?</h4>
                        <p>Yes, you can upgrade or downgrade your plan at any time. Prorated charges/credits will apply.</p>
                    </div>
                    <div className={styles.faqItem}>
                        <h4>Is my data safe?</h4>
                        <p>Yes, we use bank-level encryption and never share your personal data with third parties.</p>
                    </div>
                </div>
            </div>

            {/* Contact Support */}
            <div className={styles.supportSection}>
                <div className={styles.supportCard}>
                    <FaShieldAlt className={styles.supportIcon} />
                    <h3>Need Help Deciding?</h3>
                    <p>Contact our support team for personalized recommendations</p>
                    <button 
                        className={styles.supportButton}
                        onClick={() => window.open('mailto:support@resumebuilder.com')}
                    >
                        Contact Support
                    </button>
                </div>
            </div>

            {/* Back to Templates */}
            {templateId && (
                <div className={styles.backToTemplates}>
                    <button 
                        className={styles.backButton}
                        onClick={() => navigate('/templates')}
                    >
                        ← Back to Templates
                    </button>
                </div>
            )}
        </div>
    );
};

export default Upgrade;