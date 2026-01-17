// src/components/ui/CustomerSupport.jsx
import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaPhone, FaCommentDots, FaTimes } from 'react-icons/fa';
import styles from './CustomerSupport.module.css';

const CustomerSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const supportOptions = [
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      description: 'Quick chat support',
      action: () => window.open('https://wa.me/1234567890', '_blank'),
      color: '#25D366'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      description: 'support@resumebuilder.com',
      action: () => (window.location.href = 'mailto:support@resumebuilder.com'),
      color: '#EA4335'
    },
    {
      icon: <FaPhone />,
      title: 'Call',
      description: '+1 (555) 123-4567',
      action: () => (window.location.href = 'tel:+15551234567'),
      color: '#4285F4'
    },
    {
      icon: <FaCommentDots />,
      title: 'Live Chat',
      description: 'Chat with support',
      action: () => setIsChatOpen(true),
      color: '#8B5CF6'
    }
  ];

  return (
    <>
      {/* Floating Support Button */}
      <button
        className={styles.supportButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : '💬'}
      </button>

      {/* Support Options Panel */}
      {isOpen && (
        <div className={styles.supportPanel}>
          <div className={styles.panelHeader}>
            <h3>Customer Support</h3>
            <p>How can we help you?</p>
          </div>
          <div className={styles.optionsGrid}>
            {supportOptions.map((option, index) => (
              <button
                key={index}
                className={styles.optionCard}
                onClick={option.action}
                style={{ '--option-color': option.color }}
              >
                <div
                  className={styles.optionIcon}
                  style={{
                    backgroundColor: option.color + '20',
                    color: option.color
                  }}
                >
                  {option.icon}
                </div>
                <div className={styles.optionContent}>
                  <h4>{option.title}</h4>
                  <p>{option.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className={styles.panelFooter}>
            <p>Average response time: 2 hours</p>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {isChatOpen && (
        <div className={styles.chatModal}>
          <div className={styles.chatHeader}>
            <h3>Live Chat Support</h3>
            <button
              className={styles.closeChat}
              onClick={() => setIsChatOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className={styles.chatMessages}>
            <div className={`${styles.message} ${styles.agent}`}>
              <p>Hello! How can I help you today?</p>
            </div>
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type your message..."
              disabled
            />
            <button className={styles.sendButton}>Send</button>
          </div>
          <div className={styles.chatNotice}>
            <p>💡 Live chat coming soon! For now, please use WhatsApp or Email support.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerSupport;