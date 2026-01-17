// src/pages/Templates.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../data/templates';
import TemplatePreview from '../components/templates/TemplatePreview';
import styles from './Templates.module.css';

const Templates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userSubscription, setUserSubscription] = useState('free'); // free, premium, vip
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedTemplateForUpgrade, setSelectedTemplateForUpgrade] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user subscription from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserSubscription(user.subscription || 'free');
  }, []);

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋' },
    { id: 'free', name: 'Free', icon: '🎁' },
    { id: 'premium', name: 'Premium', icon: '⭐' },
    { id: 'vip', name: 'VIP', icon: '👑' }
  ];

  // Filter templates based on search and category
  const filteredTemplates = Object.values(TEMPLATES).filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort templates: free first, then premium, then VIP
  const sortedTemplates = filteredTemplates.sort((a, b) => {
    const order = { 'free': 0, 'premium': 1, 'vip': 2 };
    return order[a.category] - order[b.category];
  });

  // Check if user can use template based on subscription
  const canUseTemplate = (template) => {
    if (template.category === 'free') return true;
    if (template.category === 'premium' && userSubscription !== 'free') return true;
    if (template.category === 'vip' && userSubscription === 'vip') return true;
    return false;
  };

  // Handle template selection
  const handleTemplateSelect = async (template) => {
    // Check if user has access
    if (!canUseTemplate(template)) {
      // Show upgrade modal
      setSelectedTemplateForUpgrade(template);
      setShowSubscriptionModal(true);
      return;
    }


    try {
      setLoading(true);
      
      // Create a new resume with selected template
      const newResume = {
        personal: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        theme: {
          primary: template.colors?.primary || '#3b82f6',
          secondary: template.colors?.secondary || '#8b5cf6'
        },
        template: template.id
      };

      // Save to localStorage
      const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const resumeId = 'resume_' + Date.now();
      
      const resumeToSave = {
        id: resumeId,
        title: 'New Resume',
        data: newResume,
        updatedAt: new Date().toISOString(),
        template: template.id
      };
      
      resumes.push(resumeToSave);
      localStorage.setItem('resumes', JSON.stringify(resumes));
      
      // Navigate to editor with the new resume
      navigate(`/editor/${resumeId}`);
      
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Failed to create resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle subscription upgrade
  const handleUpgrade = (plan) => {
    console.log(`Upgrading to ${plan} plan...`);
    // Update user subscription
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.subscription = plan;
    localStorage.setItem('user', JSON.stringify(user));
    
    setUserSubscription(plan);
    setShowSubscriptionModal(false);
    
    // If there's a template waiting, use it now
    if (selectedTemplateForUpgrade && canUseTemplate(selectedTemplateForUpgrade)) {
      handleTemplateSelect(selectedTemplateForUpgrade);
    }
  };
// In Templates.jsx - Add this useEffect
useEffect(() => {
  const handleSubscriptionUpdate = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserSubscription(user.subscription || 'free');
  };

  window.addEventListener('subscription-updated', handleSubscriptionUpdate);
  
  return () => {
    window.removeEventListener('subscription-updated', handleSubscriptionUpdate);
  };
}, []);
  // Quick preview function
  const handleQuickPreview = (template) => {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${template.name} - Preview</title>
        <style>
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }
          .preview-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
          .template-name { color: #3b82f6; margin-bottom: 10px; }
          .close-btn { background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <h1 class="template-name">${template.name}</h1>
          <p>${template.description || 'Professional resume template'}</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <div style="color: #6b7280; margin-bottom: 10px;">Template Preview</div>
            <div style="font-size: 24px;">📄</div>
            <div style="font-size: 14px; color: #9ca3af;">This is a preview of the ${template.name} template</div>
          </div>
          <button class="close-btn" onclick="window.close()">Close Preview</button>
        </div>
      </body>
      </html>
    `);
    previewWindow.document.close();
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🎨 Professional Resume Templates</h1>
          <p className={styles.subtitle}>
            Choose from {Object.keys(TEMPLATES).length}+ professionally designed templates 
            to create your perfect resume
          </p>
          
          {/* User Subscription Status */}
          <div className={styles.subscriptionStatus}>
            <div className={styles.currentPlan}>
              <span className={styles.planLabel}>Your Plan:</span>
              <span className={`${styles.planBadge} ${styles[userSubscription]}`}>
                {userSubscription.toUpperCase()}
              </span>
              {userSubscription === 'free' && (
                <button 
                  className={styles.upgradeLink}
                  onClick={() => setShowSubscriptionModal(true)}
                >
                  Upgrade for more templates →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search templates by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className={styles.searchStats}>
            Showing {filteredTemplates.length} of {Object.keys(TEMPLATES).length} templates
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryTab} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className={styles.tabIcon}>{category.icon}</span>
              <span className={styles.tabText}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className={styles.templatesContainer}>
        {sortedTemplates.length > 0 ? (
          <div className={styles.templatesGrid}>
            {sortedTemplates.map(template => {
              const canUse = canUseTemplate(template);
              
              return (
                <div 
                  key={template.id} 
                  className={`${styles.templateCard} ${canUse ? '' : styles.locked}`}
                  data-category={template.category}
                >
                  {/* Template Preview */}
                  <div className={styles.previewSection}>
                    <TemplatePreview
                      template={template}
                      resumeData={{
                        personal: { 
                          name: 'John Doe', 
                          title: 'Software Developer',
                          email: 'john@example.com'
                        },
                        skills: ['React', 'JavaScript', 'Node.js', 'CSS']
                      }}
                      isActive={false}
                      onSelect={() => handleTemplateSelect(template)}
                    />
                    
                    {/* Lock Overlay for locked templates */}
                    {!canUse && (
                      <div className={styles.lockOverlay}>
                        <div className={styles.lockIcon}>🔒</div>
                        <div className={styles.lockText}>
                          {template.category === 'premium' ? 'Premium Template' : 'VIP Template'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Template Details */}
                  <div className={styles.templateDetails}>
                    <div className={styles.templateHeader}>
                      <h3 className={styles.templateName}>{template.name}</h3>
                      <div className={styles.templateCategory}>
                        <span className={`${styles.categoryBadge} ${styles[template.category]}`}>
                          {template.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <p className={styles.templateDescription}>
                      {template.description || 'Professional resume template with modern design'}
                    </p>
                    
                    {/* Template Features */}
                    <div className={styles.templateFeatures}>
                      {template.features?.map((feature, index) => (
                        <div key={index} className={styles.featureItem}>
                          <span className={styles.featureIcon}>✓</span>
                          <span className={styles.featureText}>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                      <button 
                        className={`${styles.useButton} ${canUse ? '' : styles.lockedButton}`}
                        onClick={() => handleTemplateSelect(template)}
                        disabled={loading || !canUse}
                      >
                        {loading ? 'Loading...' : canUse ? '🚀 Use This Template' : '🔒 Upgrade Required'}
                      </button>
                      
                      <button 
                        className={styles.previewButton}
                        onClick={() => handleQuickPreview(template)}
                      >
                        👁️ Quick Preview
                      </button>
                      
                      {!canUse && (
                        <button 
                          className={styles.upgradeButton}
                          onClick={() => {
                            setSelectedTemplateForUpgrade(template);
                            setShowSubscriptionModal(true);
                          }}
                        >
                          ⭐ Upgrade to {template.category === 'premium' ? 'Premium' : 'VIP'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // No Results Found
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No templates found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button 
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Subscription Plans Section */}
      <div className={styles.plansSection}>
        <h2 className={styles.plansTitle}>Unlock More Templates</h2>
        <p className={styles.plansSubtitle}>Upgrade your plan to access premium and VIP templates</p>
        
        <div className={styles.plansGrid}>
          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <h3>Free</h3>
              <div className={styles.planPrice}>$0<span>/month</span></div>
            </div>
            <ul className={styles.planFeatures}>
              <li>✓ Basic Templates</li>
              <li>✓ Resume Editor</li>
              <li>✓ PDF Download</li>
              <li>✗ Premium Templates</li>
              <li>✗ VIP Templates</li>
            </ul>
            <button 
              className={`${styles.planButton} ${userSubscription === 'free' ? styles.currentPlan : ''}`}
              onClick={() => handleUpgrade('free')}
            >
              {userSubscription === 'free' ? 'Current Plan' : 'Select Free'}
            </button>
          </div>
          
          <div className={`${styles.planCard} ${styles.recommended}`}>
            <div className={styles.recommendedBadge}>Most Popular</div>
            <div className={styles.planHeader}>
              <h3>Premium</h3>
              <div className={styles.planPrice}>$9.99<span>/month</span></div>
            </div>
            <ul className={styles.planFeatures}>
              <li>✓ All Free Features</li>
              <li>✓ Premium Templates</li>
              <li>✓ Advanced Customization</li>
              <li>✓ Priority Support</li>
              <li>✗ VIP Templates</li>
            </ul>
            <button 
              className={`${styles.planButton} ${userSubscription === 'premium' ? styles.currentPlan : ''}`}
              onClick={() => handleUpgrade('premium')}
            >
              {userSubscription === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            </button>
          </div>
          
          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <h3>VIP</h3>
              <div className={styles.planPrice}>$19.99<span>/month</span></div>
            </div>
            <ul className={styles.planFeatures}>
              <li>✓ All Premium Features</li>
              <li>✓ VIP Templates</li>
              <li>✓ Unlimited Downloads</li>
              <li>✓ Custom Branding</li>
              <li>✓ Dedicated Support</li>
            </ul>
            <button 
              className={`${styles.planButton} ${userSubscription === 'vip' ? styles.currentPlan : ''}`}
              onClick={() => handleUpgrade('vip')}
            >
              {userSubscription === 'vip' ? 'Current Plan' : 'Go VIP'}
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
     {/* // In Templates.jsx, replace the modal section at the bottom: */}
{showSubscriptionModal && selectedTemplateForUpgrade && (
  <div className={styles.upgradeModalOverlay}>
    <div className={styles.upgradeModal}>
      <div className={styles.modalHeader}>
        <button 
          className={styles.closeModalBtn}
          onClick={() => setShowSubscriptionModal(false)}
        >
          ✕
        </button>
        <h3>🔒 Upgrade Required</h3>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.templateLocked}>
          <div className={styles.lockIcon}>🔒</div>
          <h4>{selectedTemplateForUpgrade.name}</h4>
          <p>This {selectedTemplateForUpgrade.category} template requires a {selectedTemplateForUpgrade.category} subscription.</p>
        </div>
        
        <div className={styles.planOptions}>
          <div className={`${styles.planOption} ${selectedTemplateForUpgrade.category === 'premium' ? styles.recommended : ''}`}>
            <h5>Premium Plan</h5>
            <div className={styles.planPrice}>$9.99<span>/month</span></div>
            <ul>
              <li>✓ All Premium Templates</li>
              <li>✓ Unlimited Downloads</li>
              <li>✓ Priority Support</li>
            </ul>
          </div>
          
          <div className={`${styles.planOption} ${selectedTemplateForUpgrade.category === 'vip' ? styles.recommended : ''}`}>
            <h5>VIP Plan</h5>
            <div className={styles.planPrice}>$19.99<span>/month</span></div>
            <ul>
              <li>✓ All VIP Templates</li>
              <li>✓ Unlimited Everything</li>
              <li>✓ 24/7 Priority Support</li>
            </ul>
          </div>
        </div>
        
       {/* // In Templates.jsx - Update the modalActions section: */}
<div className={styles.modalActions}>
  <button 
    className={styles.viewPlansBtn}
    onClick={() => {
      setShowSubscriptionModal(false);
      navigate('/upgrade', { 
        state: { 
          required: selectedTemplateForUpgrade.category,
          templateName: selectedTemplateForUpgrade.name,
          templateId: selectedTemplateForUpgrade.id
        }
      });
    }}
  >
    View All Plans
  </button>
  <button 
    className={styles.upgradeNowBtn}
    onClick={() => {
      setShowSubscriptionModal(false);
      navigate('/checkout', { 
        state: { 
          plan: selectedTemplateForUpgrade.category,
          templateId: selectedTemplateForUpgrade.id,
          templateName: selectedTemplateForUpgrade.name
        }
      });
    }}
  >
    Upgrade Now
  </button>
</div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Templates;