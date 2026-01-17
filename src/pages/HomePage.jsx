// src/pages/HomePage.jsx
// src/pages/HomePage.jsx - Updated imports
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaRocket, FaMagic, FaDownload, FaShieldAlt, 
  FaSync, FaMobileAlt, FaChartLine, FaStar,
  FaCheckCircle, FaArrowRight, FaPlayCircle,
  FaUsers, FaAward, FaLightbulb, FaSearch,
  FaFileAlt, FaEdit, FaFileExport, FaArrowUp,
  FaFilePdf // Add this import
} from 'react-icons/fa';
import styles from './HomePage.module.css';
import EnhancedNavbar from '../components/ui/EnhancedNavbar';
import EnhancedCarousel from '../components/ui/EnhancedCarousel';

const HomePage = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const stats = {
    resumesCreated: '10,000+',
    templates: '50+',
    jobPlacements: '5,000+',
    satisfaction: '98%'
  };
  
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer at Google',
      text: 'This resume builder helped me land my dream job at Google. The ATS optimization is a game-changer!',
      rating: 5,
      avatarColor: '#3b82f6'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      text: 'From zero to hired in 3 weeks. The templates are professional and the editor is incredibly intuitive.',
      rating: 5,
      avatarColor: '#10b981'
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Marketing Director',
      text: 'Created a stunning resume in under 30 minutes. The design options helped me stand out from 200+ applicants.',
      rating: 5,
      avatarColor: '#8b5cf6'
    },
    {
      id: 4,
      name: 'John Smith',
      role: 'UX Designer',
      text: 'The AI suggestions improved my resume by 40%. Landed 3 interviews in the first week of using it.',
      rating: 5,
      avatarColor: '#f59e0b'
    }
  ];
  
  const features = [
    {
      icon: <FaLightbulb />,
      title: 'AI-Powered Suggestions',
      description: 'Get intelligent recommendations to improve your resume content and formatting',
      color: '#3b82f6',
      delay: '100ms'
    },
    {
      icon: <FaSearch />,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes through applicant tracking systems',
      color: '#10b981',
      delay: '200ms'
    },
    {
      icon: <FaSync />,
      title: 'Real-time Preview',
      description: 'See changes instantly with our live preview editor',
      color: '#8b5cf6',
      delay: '300ms'
    },
    {
      icon: <FaFileExport />,
      title: 'Multiple Formats',
      description: 'Export as PDF, DOCX, or share via secure link',
      color: '#f59e0b',
      delay: '400ms'
    },
    {
      icon: <FaMobileAlt />,
      title: 'Mobile Editor',
      description: 'Create and edit resumes on any device',
      color: '#ec4899',
      delay: '500ms'
    },
    {
      icon: <FaChartLine />,
      title: 'Analytics Dashboard',
      description: 'Track resume views and download statistics',
      color: '#06b6d4',
      delay: '600ms'
    }
  ];
  
  const steps = [
    {
      number: '01',
      title: 'Choose Your Template',
      description: 'Select from 50+ professionally designed, ATS-optimized templates',
      icon: <FaFileAlt />,
      color: '#3b82f6'
    },
    {
      number: '02',
      title: 'Fill with Smart Editor',
      description: 'Use our intelligent editor with auto-suggestions and formatting',
      icon: <FaEdit />,
      color: '#10b981'
    },
    {
      number: '03',
      title: 'Download & Apply',
      description: 'Export in multiple formats and start landing interviews',
      icon: <FaDownload />,
      color: '#8b5cf6'
    }
  ];
  
  const pricingPlans = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      period: 'forever free',
      features: [
        { text: '3 Professional Templates', included: true },
        { text: '3 Downloads per Month', included: true },
        { text: 'Basic ATS Check', included: true },
        { text: 'Watermarked PDFs', included: true },
        { text: 'Community Support', included: true },
        { text: 'Premium Templates', included: false },
        { text: 'Unlimited Downloads', included: false },
        { text: 'AI Resume Review', included: false }
      ],
      cta: 'Start Building Free',
      popular: false,
      color: '#6b7280'
    },
    {
      id: 'premium',
      name: 'Professional',
      price: '$9',
      period: 'per month',
      features: [
        { text: 'All 50+ Templates', included: true },
        { text: 'Unlimited Downloads', included: true },
        { text: 'Advanced ATS Optimization', included: true },
        { text: 'No Watermarks', included: true },
        { text: 'Priority Support', included: true },
        { text: 'PDF & DOCX Export', included: true },
        { text: 'Analytics Dashboard', included: true },
        { text: 'AI Resume Review', included: false }
      ],
      cta: 'Start 7-Day Free Trial',
      popular: true,
      color: '#8b5cf6',
      save: 'Save 25%'
    },
    {
      id: 'vip',
      name: 'VIP',
      price: '$19',
      period: 'per month',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'VIP Templates Access', included: true },
        { text: 'AI Resume Review', included: true },
        { text: '24/7 Priority Support', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'Resume Analytics Pro', included: true },
        { text: 'Team Collaboration', included: true },
        { text: 'Career Coaching Sessions', included: true }
      ],
      cta: 'Go VIP',
      popular: false,
      color: '#f59e0b'
    }
  ];
  
  const templates = [
    { id: 1, name: 'Modern Tech', category: 'Technology', color: '#3b82f6' },
    { id: 2, name: 'Executive', category: 'Management', color: '#10b981' },
    { id: 3, name: 'Creative Pro', category: 'Design', color: '#8b5cf6' },
    { id: 4, name: 'Minimalist', category: 'All Industries', color: '#f59e0b' },
    { id: 5, name: 'Classic', category: 'Traditional', color: '#06b6d4' },
    { id: 6, name: 'Corporate', category: 'Business', color: '#ec4899' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    navigate(token ? '/dashboard' : '/register');
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.container}>
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badge}>
              <FaAward /> Trusted by 10,000+ Professionals
            </div>
            <h1 className={styles.heroTitle}>
              Craft Your <span className={styles.highlight}>Perfect Resume</span> 
              in Minutes
            </h1>
            <p className={styles.heroSubtitle}>
              AI-powered resume builder with 50+ professional templates, ATS optimization, 
              and real-time editing. Land your dream job faster.
            </p>
            
            <div className={styles.heroButtons}>
              <button 
                className={`${styles.button} ${styles.primaryButton}`}
                onClick={handleGetStarted}
              >
                <FaRocket /> Build Resume Free
              </button>
              <button 
                className={`${styles.button} ${styles.secondaryButton}`}
                onClick={() => navigate('/templates')}
              >
                <FaPlayCircle /> View Templates
              </button>
            </div>
            
            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <FaShieldAlt />
                <span>100% Secure</span>
              </div>
              <div className={styles.trustItem}>
                <FaUsers />
                <span>Trusted by Top Companies</span>
              </div>
              <div className={styles.trustItem}>
                <FaCheckCircle />
                <span>ATS Guarantee</span>
              </div>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.resumePreview}>
              <div className={styles.previewHeader}>
                <div className={styles.previewAvatar}>JD</div>
                <div className={styles.previewInfo}>
                  <div className={styles.previewName}>John Doe</div>
                  <div className={styles.previewTitle}>Senior Software Engineer</div>
                  <div className={styles.previewTags}>
                    <span>8+ Years Experience</span>
                    <span>React Expert</span>
                  </div>
                </div>
              </div>
              <div className={styles.previewContent}>
                <div className={styles.previewSection}>
                  <div className={styles.sectionTitle}>Professional Experience</div>
                  <div className={styles.previewItem}>
                    <div className={styles.itemTitle}>Senior Developer at Tech Corp</div>
                    <div className={styles.itemDuration}>2020 - Present</div>
                    <div className={styles.itemDescription}>
                      Led development of scalable web applications using React and Node.js
                    </div>
                  </div>
                </div>
                <div className={styles.previewSection}>
                  <div className={styles.sectionTitle}>Technical Skills</div>
                  <div className={styles.skillTags}>
                    <span>React</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                    <span>AWS</span>
                    <span>GraphQL</span>
                  </div>
                </div>
              </div>
              <div className={styles.previewFooter}>
                <div className={styles.atsScore}>
                  <FaSearch /> ATS Score: 98/100
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {Object.entries(stats).map(([key, value], index) => (
              <div key={key} className={styles.statCard} style={{ animationDelay: `${index * 100}ms` }}>
                <div className={styles.statNumber}>{value}</div>
                <div className={styles.statLabel}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
<section className={styles.features}>
  <div className={styles.sectionHeader}>
    <div className={styles.sectionBadge}>Features</div>
    <h2>Everything You Need for Career Success</h2>
    <p>Professional tools designed to help you create resumes that get noticed</p>
  </div>
  
  <div className={styles.featuresGrid}>
    {features.map((feature, index) => (
      <div 
        key={index} 
        className={styles.featureCard}
        style={{ animationDelay: feature.delay }}
      >
        <div 
          className={styles.featureIconWrapper}
          style={{ '--feature-color': feature.color }}
        >
          {feature.icon}
        </div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    ))}
  </div>
</section>
      
   {/* How It Works */}
<section className={styles.howItWorks}>
  <div className={styles.sectionHeader}>
    <div className={styles.sectionBadge}>Process</div>
    <h2>Create Your Resume in 3 Simple Steps</h2>
    <p>From blank page to job-ready resume in minutes</p>
  </div>
  
  <div className={styles.stepsContainer}>
    {steps.map((item, index) => (
      <div key={index} className={styles.step}>
        <div className={styles.stepNumber}>{item.number}</div>
        <div className={styles.stepContent}>
          <div 
            className={styles.stepIcon}
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
        {index < steps.length - 1 && (
          <div className={styles.stepConnector}></div>
        )}
      </div>
    ))}
  </div>
</section>
      
     {/* Templates Section */}
<section className={styles.templates}>
  <div className={styles.sectionHeader}>
    <div className={styles.sectionBadge}>Templates</div>
    <h2>Professional Templates for Every Industry</h2>
    <p>Choose from our collection of ATS-optimized, professionally designed templates</p>
  </div>
  
  <EnhancedCarousel>
    {templates.map((templateItem) => (
      <div key={templateItem.id} className={styles.templateCard}>
        <div 
          className={styles.templatePreview}
          style={{ '--template-color': templateItem.color }}
        >
          <div className={styles.templateCategory}>{templateItem.category}</div>
          <div className={styles.templateName}>{templateItem.name}</div>
        </div>
        <div className={styles.templateInfo}>
          <h4>{templateItem.name}</h4>
          <p>{templateItem.category}</p>
          <button 
            className={styles.templateButton}
            onClick={() => navigate(`/templates/${templateItem.id}`)}
          >
            Preview Template <FaArrowRight />
          </button>
        </div>
      </div>
    ))}
  </EnhancedCarousel>
  
  <div className={styles.templatesCta}>
    <button 
      className={`${styles.button} ${styles.primaryButton}`}
      onClick={() => navigate('/templates')}
    >
      Explore All Templates
    </button>
  </div>
</section>
      
      {/* Testimonials */}
<section className={styles.testimonials}>
  <div className={styles.sectionHeader}>
    <div className={styles.sectionBadge}>Success Stories</div>
    <h2>Trusted by Professionals Worldwide</h2>
    <p>See how our users landed their dream jobs</p>
  </div>
  
  <EnhancedCarousel>
    {testimonials.map((testimonialItem) => (
      <div key={testimonialItem.id} className={styles.testimonialCard}>
        <div className={styles.testimonialRating}>
          {[...Array(testimonialItem.rating)].map((_, i) => (
            <FaStar key={i} className={styles.star} />
          ))}
        </div>
        <p className={styles.testimonialText}>"{testimonialItem.text}"</p>
        <div className={styles.testimonialAuthor}>
          <div 
            className={styles.authorAvatar}
            style={{ backgroundColor: testimonialItem.avatarColor }}
          >
            {testimonialItem.name.charAt(0)}
          </div>
          <div className={styles.authorInfo}>
            <h4>{testimonialItem.name}</h4>
            <p>{testimonialItem.role}</p>
          </div>
        </div>
      </div>
    ))}
  </EnhancedCarousel>
</section>
      
     <section className={styles.pricing}>
  <div className={styles.sectionHeader}>
    <div className={styles.sectionBadge}>Pricing</div>
    <h2>Simple, Transparent Pricing</h2>
    <p>Choose the plan that fits your career goals</p>
  </div>
  
  <div className={styles.pricingGrid}>
    {pricingPlans.map((plan) => (
      <div 
        key={plan.id} 
        className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}
      >
        {plan.popular && (
          <div className={styles.popularBadge}>
            Most Popular {plan.save && <span className={styles.saveBadge}>{plan.save}</span>}
          </div>
        )}
        
        <div className={styles.planHeader}>
          <h3>{plan.name}</h3>
          <div className={styles.planPrice}>
            <span className={styles.price}>{plan.price}</span>
            <span className={styles.period}>/{plan.period}</span>
          </div>
        </div>
        
        <ul className={styles.planFeatures}>
          {plan.features.map((feature, i) => (
            <li key={i} className={feature.included ? styles.included : styles.excluded}>
              {feature.included ? (
                <FaCheckCircle className={styles.featureIcon} />
              ) : (
                <span className={styles.excludedIcon}>×</span>
              )}
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
        
        <button 
          className={`${styles.button} ${styles.planButton}`}
          onClick={() => navigate(plan.id === 'free' ? '/register' : '/upgrade')}
          style={{ backgroundColor: plan.color }}
        >
          {plan.cta}
        </button>
      </div>
    ))}
  </div>
  
  <div className={styles.pricingNote}>
    <p>All plans include our 14-day money-back guarantee. No questions asked.</p>
  </div>
</section>
      
      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.finalCtaContent}>
          <h2>Ready to Transform Your Career?</h2>
          <p>Join 10,000+ professionals who landed their dream jobs with our resumes</p>
          <div className={styles.finalButtons}>
            <button 
              className={`${styles.button} ${styles.finalPrimaryButton}`}
              onClick={handleGetStarted}
            >
              Start Building Free
            </button>
            <button 
              className={`${styles.button} ${styles.finalSecondaryButton}`}
              onClick={() => navigate('/templates')}
            >
              Browse Templates
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <FaFilePdf /> ResumeBuilder Pro
              </div>
              <p>Professional resume builder trusted by job seekers worldwide</p>
              <div className={styles.socialLinks}>
                {['Twitter', 'LinkedIn', 'GitHub', 'Instagram'].map((social) => (
                  <a key={social} href="#" className={styles.socialLink}>
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            <div className={styles.footerLinks}>
              <div className={styles.linkColumn}>
                <h4>Product</h4>
                <Link to="/templates">Templates</Link>
                <Link to="/features">Features</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/upgrade">Upgrade</Link>
              </div>
              
              <div className={styles.linkColumn}>
                <h4>Resources</h4>
                <Link to="/blog">Blog</Link>
                <Link to="/guides">Resume Guides</Link>
                <Link to="/examples">Examples</Link>
                <Link to="/tools">Tools</Link>
              </div>
              
              <div className={styles.linkColumn}>
                <h4>Support</h4>
                <Link to="/help">Help Center</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/status">Status</Link>
                <Link to="/privacy">Privacy</Link>
              </div>
              
              <div className={styles.linkColumn}>
                <h4>Company</h4>
                <Link to="/about">About</Link>
                <Link to="/careers">Careers</Link>
                <Link to="/press">Press</Link>
                <Link to="/terms">Terms</Link>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} ResumeBuilder Pro. All rights reserved.</p>
            <div className={styles.footerLegal}>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to Top Button */}
      {scrollPosition > 500 && (
        <button className={styles.scrollTop} onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default HomePage;