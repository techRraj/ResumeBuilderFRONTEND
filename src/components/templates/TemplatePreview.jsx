// src/components/templates/TemplatePreview.jsx
import React from 'react';
import styles from './TemplatePreview.module.css';

const TemplatePreview = ({ template, resumeData, isActive, onSelect }) => {
  const { colors, layout, name, category } = template;
  
  const renderPreview = () => {
    const personal = resumeData.personal || {};
    const skills = resumeData.skills || ['React', 'JavaScript', 'Node.js', 'CSS'];
    const experience = resumeData.experience || [];
    // const education = resumeData.education || [];
    
    switch (layout) {
      case 'two-column':
        return (
          <div className={styles.previewTwoColumn} style={{ backgroundColor: colors.background }}>
            {/* Header with accent color */}
            <div className={styles.previewHeader} style={{ backgroundColor: colors.primary }}>
              <div className={styles.headerContent}>
                <div className={styles.avatar} style={{ backgroundColor: colors.secondary }}>
                  {personal.name?.charAt(0) || 'J'}
                </div>
                <div className={styles.headerInfo}>
                  <div className={styles.name} style={{ color: '#fff' }}>
                    {personal.name || 'John Doe'}
                  </div>
                  <div className={styles.title} style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {personal.title || 'Software Developer'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.columnsContainer}>
              {/* Left Column - 40% */}
              <div className={styles.leftColumn} style={{ borderRight: `2px solid ${colors.primary}20` }}>
                {/* Contact */}
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle} style={{ color: colors.primary }}>
                    <span className={styles.icon}>📱</span> Contact
                  </h4>
                  <div className={styles.contactList}>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📧</span>
                      <span className={styles.contactText}>{personal.email || 'john@example.com'}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📞</span>
                      <span className={styles.contactText}>{personal.phone || '+1 234 567 8900'}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <span className={styles.contactIcon}>📍</span>
                      <span className={styles.contactText}>{personal.location || 'San Francisco, CA'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Skills */}
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle} style={{ color: colors.primary }}>
                    <span className={styles.icon}>💻</span> Skills
                  </h4>
                  <div className={styles.skillsGrid}>
                    {skills.slice(0, 6).map((skill, index) => (
                      <div 
                        key={index} 
                        className={styles.skillBadge}
                        style={{ 
                          backgroundColor: colors.primary + '15',
                          color: colors.primary,
                          border: `1px solid ${colors.primary}30`
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - 60% */}
              <div className={styles.rightColumn}>
                {/* Experience */}
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle} style={{ color: colors.primary }}>
                    <span className={styles.icon}>💼</span> Experience
                  </h4>
                  <div className={styles.experienceList}>
                    {experience.slice(0, 2).map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <div className={styles.jobHeader}>
                          <div className={styles.jobTitle} style={{ color: colors.text }}>
                            {exp.role || 'Senior Developer'}
                          </div>
                          <div className={styles.jobDuration} style={{ color: colors.primary }}>
                            {exp.duration || '2020 - Present'}
                          </div>
                        </div>
                        <div className={styles.company} style={{ color: colors.secondary }}>
                          {exp.company || 'Tech Solutions Inc.'}
                        </div>
                        <p className={styles.jobDescription}>
                          {exp.description?.substring(0, 80) || 'Led development of customer-facing applications...'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'single-column':
        return (
          <div className={styles.previewSingleColumn} style={{ backgroundColor: colors.background }}>
            {/* Elegant Header */}
            <div className={styles.singleHeader} style={{ borderBottom: `3px solid ${colors.primary}` }}>
              <div className={styles.mainName} style={{ color: colors.text }}>
                {personal.name || 'JOHN DOE'}
              </div>
              <div className={styles.mainTitle} style={{ color: colors.primary }}>
                {personal.title || 'SENIOR SOFTWARE DEVELOPER'}
              </div>
              
              {/* Contact Bar */}
              <div className={styles.contactBar}>
                <span className={styles.contactItem}>
                  <span className={styles.contactIcon}>📧</span>
                  {personal.email || 'john@example.com'}
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  {personal.phone || '+1 234 567 8900'}
                </span>
                <span className={styles.separator}>•</span>
                <span className={styles.contactItem}>
                  <span className={styles.contactIcon}>📍</span>
                  {personal.location || 'San Francisco, CA'}
                </span>
              </div>
            </div>
            
            {/* Content Sections */}
            <div className={styles.singleContent}>
              {/* Summary */}
              <div className={styles.contentSection}>
                <div className={styles.sectionHeader} style={{ borderLeft: `4px solid ${colors.primary}` }}>
                  <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                    Professional Summary
                  </h3>
                </div>
                <p className={styles.summaryText}>
                  {personal.summary?.substring(0, 120) || 'Passionate software developer with 5+ years of experience building scalable web applications...'}
                </p>
              </div>
              
              {/* Skills */}
              <div className={styles.contentSection}>
                <div className={styles.sectionHeader} style={{ borderLeft: `4px solid ${colors.primary}` }}>
                  <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                    Technical Skills
                  </h3>
                </div>
                <div className={styles.skillsContainer}>
                  {skills.slice(0, 8).map((skill, index) => (
                    <div 
                      key={index} 
                      className={styles.skillChip}
                      style={{ 
                        backgroundColor: colors.primary,
                        color: '#fff'
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'tech':
        return (
          <div className={styles.previewTech} style={{ backgroundColor: colors.background }}>
            {/* Tech Header with gradient */}
            <div 
              className={styles.techHeader} 
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              }}
            >
              <div className={styles.techAvatar}>
                <div className={styles.avatarCircle} style={{ backgroundColor: '#fff', color: colors.primary }}>
                  {personal.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                </div>
              </div>
              <div className={styles.techInfo}>
                <div className={styles.techName} style={{ color: '#fff' }}>
                  {personal.name || 'JOHN DOE'}
                </div>
                <div className={styles.techTitle} style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {personal.title || 'TECH LEAD'}
                </div>
              </div>
            </div>
            
            <div className={styles.techBody}>
              {/* Skills with progress bars */}
              <div className={styles.techSection}>
                <h4 className={styles.techSectionTitle} style={{ color: colors.text }}>
                  <span className={styles.techIcon}>🚀</span> Technical Proficiencies
                </h4>
                <div className={styles.skillBars}>
                  {['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript'].slice(0, 4).map((skill, index) => (
                    <div key={index} className={styles.skillBar}>
                      <div className={styles.skillLabel}>
                        <span>{skill}</span>
                        <span className={styles.skillPercent}>{(index + 8) * 10}%</span>
                      </div>
                      <div className={styles.barContainer}>
                        <div 
                          className={styles.barFill} 
                          style={{ 
                            backgroundColor: colors.primary,
                            width: `${(index + 8) * 10}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Info */}
              <div className={styles.techQuickInfo}>
                <div className={styles.techStat}>
                  <div className={styles.statNumber} style={{ color: colors.primary }}>5+</div>
                  <div className={styles.statLabel}>Years Experience</div>
                </div>
                <div className={styles.techStat}>
                  <div className={styles.statNumber} style={{ color: colors.primary }}>50+</div>
                  <div className={styles.statLabel}>Projects</div>
                </div>
                <div className={styles.techStat}>
                  <div className={styles.statNumber} style={{ color: colors.primary }}>15+</div>
                  <div className={styles.statLabel}>Clients</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className={styles.previewDefault} style={{ backgroundColor: colors.background }}>
            <div className={styles.defaultHeader} style={{ backgroundColor: colors.primary }}>
              <div className={styles.defaultName} style={{ color: '#fff' }}>
                {personal.name || 'Your Name'}
              </div>
            </div>
            <div className={styles.defaultContent}>
              <div className={styles.defaultItem}>
                <div className={styles.defaultLabel} style={{ color: colors.primary }}>Title:</div>
                <div className={styles.defaultValue}>{personal.title || 'Your Title'}</div>
              </div>
              <div className={styles.defaultItem}>
                <div className={styles.defaultLabel} style={{ color: colors.primary }}>Email:</div>
                <div className={styles.defaultValue}>{personal.email || 'email@example.com'}</div>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`${styles.templateCard} ${isActive ? styles.active : ''} ${styles[layout]}`} 
      onClick={onSelect}
      data-category={category}
    >
      <div className={styles.previewWrapper}>
        {renderPreview()}
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.templateName}>{name}</div>
        <div className={styles.templateMeta}>
          <div 
            className={styles.templateBadge} 
            style={{ 
              backgroundColor: 
                category === 'vip' ? '#f59e0b' : 
                category === 'premium' ? '#8b5cf6' : 
                '#10b981'
            }}
          >
            {category === 'vip' ? 'VIP' : category === 'premium' ? 'Premium' : 'Free'}
          </div>
          <div className={styles.templateType}>{layout.replace('-', ' ')}</div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;