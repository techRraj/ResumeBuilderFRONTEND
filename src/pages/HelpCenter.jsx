// src/pages/HelpCenter.jsx
import React, { useState } from 'react';
import { FaSearch, FaQuestionCircle, FaFileDownload, FaEdit, FaLock, FaShare } from 'react-icons/fa';
import styles from './HelpCenter.module.css';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = [
    {
      title: 'Getting Started',
      icon: <FaQuestionCircle />,
      questions: [
        'How do I create my first resume?',
        'What templates are available?',
        'Is there a mobile app?'
      ]
    },
    {
      title: 'Templates',
      icon: <FaEdit />,
      questions: [
        'How do I change templates?',
        'Can I customize templates?',
        'Which template is best for my industry?'
      ]
    },
    {
      title: 'Export & Download',
      icon: <FaFileDownload />,
      questions: [
        'How do I download my resume?',
        'What file formats are supported?',
        'Why is my PDF not downloading?'
      ]
    },
    {
      title: 'Account & Billing',
      icon: <FaLock />,
      questions: [
        'How do I change my password?',
        'How do I upgrade my subscription?',
        'How do I cancel my account?'
      ]
    },
    {
      title: 'Sharing',
      icon: <FaShare />,
      questions: [
        'How do I share my resume?',
        'Can I make my resume public?',
        'How do I get a resume link?'
      ]
    }
  ];

  const popularArticles = [
    {
      title: 'Creating Your First Resume',
      description: 'Step-by-step guide to build your first professional resume',
      readTime: '5 min read'
    },
    {
      title: 'Choosing the Right Template',
      description: 'How to select the perfect template for your industry',
      readTime: '3 min read'
    },
    {
      title: 'Exporting as PDF',
      description: 'Complete guide to downloading and printing your resume',
      readTime: '4 min read'
    },
    {
      title: 'Upgrading Your Account',
      description: 'How to unlock premium features and templates',
      readTime: '3 min read'
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Help Center</h1>
        <p>Find answers to common questions and get help with our platform</p>
        
        {/* Search */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className={styles.searchButton}>Search</button>
        </div>
      </div>

      {/* Categories */}
      <section className={styles.categories}>
        <h2>Browse by Category</h2>
        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <div key={index} className={styles.categoryCard}>
              <div className={styles.categoryIcon}>
                {category.icon}
              </div>
              <h3>{category.title}</h3>
              <ul className={styles.questionsList}>
                {category.questions.map((question, qIndex) => (
                  <li key={qIndex}>{question}</li>
                ))}
              </ul>
              <button className={styles.viewAllButton}>View All</button>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Articles */}
      <section className={styles.popularArticles}>
        <h2>Popular Articles</h2>
        <div className={styles.articlesGrid}>
          {popularArticles.map((article, index) => (
            <div key={index} className={styles.articleCard}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <div className={styles.articleMeta}>
                <span className={styles.readTime}>{article.readTime}</span>
                <button className={styles.readButton}>Read Article</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className={styles.contactSection}>
        <div className={styles.contactCard}>
          <h2>Still Need Help?</h2>
          <p>Our support team is here to assist you</p>
          <div className={styles.contactOptions}>
            <button 
              className={styles.contactButton}
              onClick={() => window.location.href = 'mailto:support@resumebuilder.com'}
            >
              ✉️ Email Support
            </button>
            <button 
              className={styles.contactButton}
              onClick={() => window.open('https://wa.me/1234567890', '_blank')}
            >
              💬 WhatsApp
            </button>
            <button 
              className={styles.contactButton}
              onClick={() => window.location.href = 'tel:+15551234567'}
            >
              📞 Call Us
            </button>
          </div>
          <div className={styles.contactInfo}>
            <p><strong>Email:</strong> support@resumebuilder.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Hours:</strong> Mon-Fri, 9AM-6PM EST</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;