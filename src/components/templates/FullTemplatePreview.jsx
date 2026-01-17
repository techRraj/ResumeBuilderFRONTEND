import React from 'react';
// src/components/templates
import styles from './FullTemplatePreview.module.css';

const FullTemplatePreview = ({ template, resumeData }) => {
  const { colors, layout } = template;
  
  const renderTemplate = () => {
    switch (layout) {
      case 'two-column':
        return (
          <div className={styles.templateTwoColumn} style={{ color: colors.text, backgroundColor: colors.background }}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.name} style={{ color: colors.text }}>
                {resumeData.personal.name || 'Your Name'}
              </h1>
              <h2 className={styles.title} style={{ color: colors.primary }}>
                {resumeData.personal.title || 'Professional Title'}
              </h2>
              <div className={styles.contact}>
                {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                {resumeData.personal.phone && <span> • {resumeData.personal.phone}</span>}
                {resumeData.personal.location && <span> • {resumeData.personal.location}</span>}
              </div>
            </div>
            
            <div className={styles.columns}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {/* Summary */}
                {resumeData.personal.summary && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                      Summary
                    </h3>
                    <p className={styles.summary}>{resumeData.personal.summary}</p>
                  </section>
                )}
                
                {/* Skills */}
                {resumeData.skills && resumeData.skills.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                      Skills
                    </h3>
                    <div className={styles.skillsGrid}>
                      {resumeData.skills.map((skill, index) => (
                        <div key={index} className={styles.skillItem} style={{ backgroundColor: colors.primary + '20' }}>
                          {skill}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {/* Education */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                      Education
                    </h3>
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className={styles.educationItem}>
                        <h4 className={styles.degree}>{edu.degree}</h4>
                        <div className={styles.institute}>{edu.institute}</div>
                        <div className={styles.year}>{edu.year}</div>
                      </div>
                    ))}
                  </section>
                )}
              </div>
              
              {/* Right Column */}
              <div className={styles.rightColumn}>
                {/* Experience */}
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                      Experience
                    </h3>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <div className={styles.experienceHeader}>
                          <h4 className={styles.role}>{exp.role}</h4>
                          <div className={styles.company}>{exp.company}</div>
                          <div className={styles.duration}>{exp.duration}</div>
                        </div>
                        {exp.description && (
                          <p className={styles.description}>{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </section>
                )}
                
                {/* Projects */}
                {resumeData.projects && resumeData.projects.length > 0 && (
                  <section className={styles.section}>
                    <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                      Projects
                    </h3>
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className={styles.projectItem}>
                        <h4 className={styles.projectName}>{project.name}</h4>
                        {project.tech && (
                          <div className={styles.projectTech}>{project.tech}</div>
                        )}
                        {project.desc && (
                          <p className={styles.projectDesc}>{project.desc}</p>
                        )}
                      </div>
                    ))}
                  </section>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'single-column':
        return (
          <div className={styles.templateSingleColumn} style={{ color: colors.text, backgroundColor: colors.background }}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.name} style={{ color: colors.text }}>
                {resumeData.personal.name || 'Your Name'}
              </h1>
              <h2 className={styles.title} style={{ color: colors.primary }}>
                {resumeData.personal.title || 'Professional Title'}
              </h2>
              <div className={styles.contact}>
                {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                {resumeData.personal.phone && <span> • {resumeData.personal.phone}</span>}
                {resumeData.personal.location && <span> • {resumeData.personal.location}</span>}
              </div>
            </div>
            
            {/* Summary */}
            {resumeData.personal.summary && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} style={{ color: colors.primary, borderBottomColor: colors.primary }}>
                  Professional Summary
                </h3>
                <p className={styles.summary}>{resumeData.personal.summary}</p>
              </section>
            )}
            
            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className={styles.section}>
                <h3 className={styles.sectionTitle} style={{ color: colors.primary, borderBottomColor: colors.primary }}>
                  Work Experience
                </h3>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className={styles.experienceItem}>
                    <div className={styles.experienceHeader}>
                      <h4 className={styles.role}>{exp.role}</h4>
                      <div className={styles.companyDuration}>
                        <span className={styles.company}>{exp.company}</span>
                        {exp.duration && <span className={styles.duration}>{exp.duration}</span>}
                      </div>
                    </div>
                    {exp.description && (
                      <p className={styles.description}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* Skills & Education in Row */}
            <div className={styles.rowSections}>
              {/* Skills */}
              {resumeData.skills && resumeData.skills.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle} style={{ color: colors.primary, borderBottomColor: colors.primary }}>
                    Skills
                  </h3>
                  <div className={styles.skillsList}>
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className={styles.skillTag} style={{ backgroundColor: colors.primary, color: 'white' }}>
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Education */}
              {resumeData.education && resumeData.education.length > 0 && (
                <section className={styles.section}>
                  <h3 className={styles.sectionTitle} style={{ color: colors.primary, borderBottomColor: colors.primary }}>
                    Education
                  </h3>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className={styles.educationItem}>
                      <h4 className={styles.degree}>{edu.degree}</h4>
                      <div className={styles.institute}>{edu.institute}</div>
                      <div className={styles.year}>{edu.year}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        );
        
      case 'tech':
        return (
          <div className={styles.templateTech} style={{ color: colors.text, backgroundColor: colors.background }}>
            {/* Header with Background */}
            <div className={styles.techHeader} style={{ backgroundColor: colors.primary }}>
              <div className={styles.techHeaderContent}>
                <h1 className={styles.name}>{resumeData.personal.name || 'Your Name'}</h1>
                <h2 className={styles.title}>{resumeData.personal.title || 'Tech Professional'}</h2>
                <div className={styles.contact}>
                  {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                  {resumeData.personal.phone && <span> • {resumeData.personal.phone}</span>}
                  {resumeData.personal.location && <span> • {resumeData.personal.location}</span>}
                </div>
              </div>
            </div>
            
            <div className={styles.techContent}>
              <div className={styles.columns}>
                {/* Left Column - Skills with Progress */}
                <div className={styles.leftColumn}>
                  {/* Technical Skills with Progress Bars */}
                  {resumeData.skills && resumeData.skills.length > 0 && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                        Technical Skills
                      </h3>
                      <div className={styles.skillBars}>
                        {resumeData.skills.map((skill, index) => (
                          <div key={index} className={styles.skillBar}>
                            <div className={styles.skillName}>{skill}</div>
                            <div className={styles.barContainer}>
                              <div 
                                className={styles.barFill} 
                                style={{ 
                                  backgroundColor: colors.secondary,
                                  width: `${80 - (index * 5)}%` // Decreasing width for demo
                                }}
                              ></div>
                            </div>
                            <div className={styles.skillLevel}>{80 - (index * 5)}%</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  
                  {/* Education */}
                  {resumeData.education && resumeData.education.length > 0 && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                        Education
                      </h3>
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className={styles.educationItem}>
                          <h4 className={styles.degree}>{edu.degree}</h4>
                          <div className={styles.institute}>{edu.institute}</div>
                          <div className={styles.year}>{edu.year}</div>
                        </div>
                      ))}
                    </section>
                  )}
                </div>
                
                {/* Right Column - Experience & Projects */}
                <div className={styles.rightColumn}>
                  {/* Summary */}
                  {resumeData.personal.summary && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                        Profile
                      </h3>
                      <p className={styles.summary}>{resumeData.personal.summary}</p>
                    </section>
                  )}
                  
                  {/* Experience */}
                  {resumeData.experience && resumeData.experience.length > 0 && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                        Professional Experience
                      </h3>
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className={styles.experienceItem}>
                          <div className={styles.experienceHeader}>
                            <h4 className={styles.role}>{exp.role}</h4>
                            <div className={styles.companyDuration}>
                              <span className={styles.company}>{exp.company}</span>
                              {exp.duration && <span className={styles.duration}>{exp.duration}</span>}
                            </div>
                          </div>
                          {exp.description && (
                            <div className={styles.achievements}>
                              {exp.description.split('. ').map((point, i) => (
                                point && <div key={i} className={styles.achievement}>• {point}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </section>
                  )}
                  
                  {/* Projects */}
                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <section className={styles.section}>
                      <h3 className={styles.sectionTitle} style={{ color: colors.primary }}>
                        Projects
                      </h3>
                      {resumeData.projects.map((project, index) => (
                        <div key={index} className={styles.projectItem}>
                          <div className={styles.projectHeader}>
                            <h4 className={styles.projectName}>{project.name}</h4>
                            {project.tech && (
                              <div className={styles.projectTech} style={{ color: colors.secondary }}>
                                {project.tech}
                              </div>
                            )}
                          </div>
                          {project.desc && (
                            <p className={styles.projectDesc}>{project.desc}</p>
                          )}
                        </div>
                      ))}
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className={styles.templateDefault}>
            <h2>{template.name} Template</h2>
            <p>This template is being loaded...</p>
          </div>
        );
    }
  };
  
  return (
    <div className={styles.fullPreview}>
      {renderTemplate()}
    </div>
  );
};

export default FullTemplatePreview;