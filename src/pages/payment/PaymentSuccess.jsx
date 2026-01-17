// In src/pages/payment/PaymentSuccess.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaRocket, FaDownload } from 'react-icons/fa';
import styles from './PaymentSuccess.module.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription, templateId, templateName } = location.state || {};

  useEffect(() => {
    // Redirect if no subscription in state
    if (!subscription) {
      navigate('/upgrade');
    }
  }, [subscription, navigate]);

  // Update user subscription in localStorage
  useEffect(() => {
    if (subscription) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.subscription = subscription.id || 'premium';
      user.subscriptionDate = new Date().toISOString();
      localStorage.setItem('user', JSON.stringify(user));
      
      // Show success notification
      const event = new CustomEvent('subscription-updated', { 
        detail: { subscription: subscription.id } 
      });
      window.dispatchEvent(event);
    }
  }, [subscription]);

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        {/* Success Icon */}
        <div className={styles.successIcon}>
          <FaCheckCircle />
        </div>
        
        {/* Success Message */}
        <h1>Payment Successful! 🎉</h1>
        <p className={styles.subtitle}>
          Welcome to the <strong>{subscription?.name || 'Premium'}</strong> plan
        </p>
        
        {/* Order Details */}
        <div className={styles.orderDetails}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Plan:</span>
            <span className={styles.value}>{subscription?.name || 'Premium'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Amount:</span>
            <span className={styles.value}>${subscription?.price?.toFixed(2) || '9.99'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.value} ${styles.active}`}>Active</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Billing:</span>
            <span className={styles.value}>{subscription?.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}</span>
          </div>
        </div>
        
        {/* Template Access (if applicable) */}
        {templateName && (
          <div className={styles.templateAccess}>
            <h3>🎨 Template Unlocked!</h3>
            <p>You now have access to <strong>{templateName}</strong></p>
            <div className={styles.templateActions}>
              <Link 
                to="/templates"
                className={styles.browseTemplatesBtn}
              >
                Browse All Templates
              </Link>
              {templateId && (
                <Link 
                  to={`/editor?template=${templateId}`}
                  className={styles.useTemplateBtn}
                >
                  <FaRocket /> Use This Template
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>What would you like to do next?</h3>
          <div className={styles.actionGrid}>
            <Link to="/templates" className={styles.actionCard}>
              <div className={styles.actionIcon}>🎨</div>
              <h4>Browse Templates</h4>
              <p>Explore all premium templates</p>
            </Link>
            
            <Link to="/editor" className={styles.actionCard}>
              <div className={styles.actionIcon}>✏️</div>
              <h4>Create Resume</h4>
              <p>Start a new resume</p>
            </Link>
            
            <Link to="/dashboard" className={styles.actionCard}>
              <div className={styles.actionIcon}>📊</div>
              <h4>View Dashboard</h4>
              <p>Manage your account</p>
            </Link>
            
            <button 
              className={styles.actionCard}
              onClick={() => {
                // Create a simple invoice
                const invoice = `
                  Invoice for ${subscription?.name || 'Premium'} Plan
                  Amount: $${subscription?.price?.toFixed(2) || '9.99'}
                  Date: ${new Date().toLocaleDateString()}
                  Thank you for your purchase!
                `;
                const blob = new Blob([invoice], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'invoice.txt';
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              <div className={styles.actionIcon}>
                <FaDownload />
              </div>
              <h4>Download Invoice</h4>
              <p>Get payment receipt</p>
            </button>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className={styles.nextSteps}>
          <h3>Getting Started</h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Choose a Template</h4>
                <p>Select from our premium collection</p>
                <Link to="/templates" className={styles.stepLink}>
                  Browse Templates →
                </Link>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Customize Your Resume</h4>
                <p>Fill in your details and style it your way</p>
                <Link to="/editor" className={styles.stepLink}>
                  Start Editing →
                </Link>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Download & Share</h4>
                <p>Export as PDF and share with employers</p>
                <Link to="/dashboard" className={styles.stepLink}>
                  View Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Support */}
        <div className={styles.supportSection}>
          <div className={styles.supportCard}>
            <h4>Need Help?</h4>
            <p>Our support team is here to help you get started</p>
            <div className={styles.supportActions}>
              <a href="mailto:support@resumebuilder.com" className={styles.supportLink}>
                ✉️ Email Support
              </a>
              <button 
                className={styles.supportLink}
                onClick={() => window.open('https://help.resumebuilder.com', '_blank')}
              >
                📚 Help Center
              </button>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className={styles.ctaSection}>
          <Link to="/templates" className={styles.primaryBtn}>
            <FaRocket /> Explore Premium Templates
          </Link>
          <Link to="/dashboard" className={styles.secondaryBtn}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;