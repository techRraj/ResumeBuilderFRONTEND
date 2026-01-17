// src/pages/payment/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaShieldAlt, FaCreditCard, FaCheck, FaArrowLeft } from 'react-icons/fa';
import styles from './Checkout.module.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    address: '',
    city: '',
    country: 'US'
  });

  // Get plan details from location state
  const { subscription, templateId, templateName, requiredPlan } = location.state || {};
  
  // Plan information
  const plans = {
    premium: {
      name: 'Premium',
      price: 9.99,
      period: 'month',
      features: [
        'Access to all Premium templates',
        'Unlimited downloads',
        'Priority email support',
        'No watermarks',
        'PDF & DOCX export'
      ]
    },
    vip: {
      name: 'VIP',
      price: 19.99,
      period: 'month',
      features: [
        'All Premium features',
        'Exclusive VIP templates',
        '24/7 priority support',
        'AI resume review',
        'Custom branding options'
      ]
    },
    basic: {
      name: 'Basic',
      price: 4.99,
      period: 'month',
      features: [
        '10+ premium templates',
        '20 downloads/month',
        'Email support',
        'No watermarks'
      ]
    }
  };

  // Use subscription data or default based on required plan
  const selectedPlan = subscription || (requiredPlan ? plans[requiredPlan] : plans.premium);

  useEffect(() => {
    // Redirect if no plan selected
    if (!subscription && !requiredPlan) {
      navigate('/upgrade');
    }
  }, [subscription, requiredPlan, navigate]);

  const handleCardInput = (e, field) => {
    let value = e.target.value;
    
    // Format card number
    if (field === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      if (value.length > 0) {
        value = value.match(/.{1,4}/g).join(' ');
      }
    }
    
    // Format expiry date
    if (field === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }
    
    // Format CVC
    if (field === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user subscription in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const planId = subscription?.id || requiredPlan || 'premium';
      
      user.subscription = planId;
      user.subscriptionDate = new Date().toISOString();
      localStorage.setItem('user', JSON.stringify(user));
      
      // Dispatch event for subscription update
      const event = new CustomEvent('subscription-updated', { 
        detail: { 
          subscription: planId,
          planName: selectedPlan.name
        } 
      });
      window.dispatchEvent(event);
      
      // Navigate to success page
      navigate('/payment/success', { 
        state: { 
          subscription: {
            id: planId,
            name: selectedPlan.name,
            price: selectedPlan.price,
            billingCycle: subscription?.billingCycle || 'monthly'
          },
          templateId,
          templateName
        }
      });
      
    } catch (error) {
      console.error('Payment failed:', error);
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      `;
      errorDiv.textContent = 'Payment failed. Please try again.';
      
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Calculate yearly price for comparison
  const yearlyPrice = selectedPlan.price * 12 * 0.8; // 20% discount
  const yearlySavings = (selectedPlan.price * 12) - yearlyPrice;

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutWrapper}>
        {/* Header */}
        <div className={styles.checkoutHeader}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/upgrade')}
          >
            <FaArrowLeft /> Back to Plans
          </button>
          <h1>Complete Your Purchase</h1>
          <p className={styles.subtitle}>
            You're upgrading to: <strong>{selectedPlan.name} Plan</strong>
            {templateName && (
              <span> to access <strong>"{templateName}"</strong></span>
            )}
          </p>
        </div>

        <div className={styles.checkoutContent}>
          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              
              <div className={styles.planDetails}>
                <div className={styles.planName}>
                  <div>
                    <strong>{selectedPlan.name} Plan</strong>
                    <div className={styles.billingCycle}>
                      {subscription?.billingCycle === 'yearly' ? 'Yearly billing' : 'Monthly billing'}
                    </div>
                  </div>
                  <div className={styles.planPrice}>
                    ${selectedPlan.price.toFixed(2)}
                    <span className={styles.period}>/{subscription?.billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  </div>
                </div>
                
                {subscription?.billingCycle === 'yearly' && (
                  <div className={styles.yearlySavings}>
                    <span className={styles.savingsBadge}>💰</span>
                    You save ${yearlySavings.toFixed(2)} yearly
                  </div>
                )}
              </div>
              
              <div className={styles.featuresList}>
                <h4>What's included:</h4>
                <ul>
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index}>
                      <FaCheck className={styles.featureCheck} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${selectedPlan.price.toFixed(2)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                {subscription?.billingCycle === 'yearly' && (
                  <div className={styles.totalRow}>
                    <span>Yearly Discount</span>
                    <span className={styles.discount}>-${yearlySavings.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.totalRow} style={{ borderTop: '2px solid #e5e7eb', paddingTop: '15px' }}>
                  <strong>Total</strong>
                  <strong className={styles.totalPrice}>
                    ${selectedPlan.price.toFixed(2)}
                    <span className={styles.totalPeriod}>/{subscription?.billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  </strong>
                </div>
              </div>
            </div>
            
            {/* Security Features */}
            <div className={styles.securityFeatures}>
              <div className={styles.securityItem}>
                <FaLock className={styles.securityIcon} />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className={styles.securityItem}>
                <FaShieldAlt className={styles.securityIcon} />
                <span>PCI DSS Compliant</span>
              </div>
              <div className={styles.securityItem}>
                <FaCreditCard className={styles.securityIcon} />
                <span>Secure Payment Processing</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className={styles.paymentSection}>
            <form onSubmit={handleSubmit} className={styles.paymentForm}>
              <h3>Payment Details</h3>
              
              {/* Payment Method */}
              <div className={styles.paymentMethods}>
                <button
                  type="button"
                  className={`${styles.paymentMethod} ${paymentMethod === 'card' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard />
                  Credit/Debit Card
                </button>
                <button
                  type="button"
                  className={`${styles.paymentMethod} ${paymentMethod === 'paypal' ? styles.active : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  PayPal
                </button>
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className={styles.cardForm}>
                  <div className={styles.formGroup}>
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInput(e, 'number')}
                      required
                      maxLength="19"
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => handleCardInput(e, 'expiry')}
                        required
                        maxLength="5"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => handleCardInput(e, 'cvc')}
                        required
                        maxLength="4"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className={styles.paypalSection}>
                  <div className={styles.paypalInfo}>
                    <p>You will be redirected to PayPal to complete your payment.</p>
                    <p>After completing the payment, you'll be redirected back to activate your subscription.</p>
                  </div>
                </div>
              )}
              
              {/* Billing Info */}
              <div className={styles.billingInfo}>
                <h4>Billing Information</h4>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      value={billingInfo.city}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <select
                      value={billingInfo.country}
                      onChange={(e) => setBillingInfo(prev => ({ ...prev, country: e.target.value }))}
                    >
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Terms */}
              <div className={styles.terms}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" required />
                  <span>
                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  </span>
                </label>
                
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" defaultChecked />
                  <span>
                    Subscribe to our newsletter for tips and updates
                  </span>
                </label>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Pay ${selectedPlan.price.toFixed(2)} Now
                  </>
                )}
              </button>
              
              <p className={styles.guarantee}>
                🔒 30-day money-back guarantee • Cancel anytime
              </p>
              
              <p className={styles.secureNote}>
                <FaLock /> Your payment is secured with bank-level encryption
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;