// src/pages/Editor.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TEMPLATES, getTemplateById } from '../data/templates';
import TemplatePreview from '../components/templates/TemplatePreview';
import FullTemplatePreview from '../components/templates/FullTemplatePreview';
import { generateModernDevPDF } from '../utils/pdfGenerator';
import styles from './Editor.module.css';

const Editor = () => {
  const { id } = useParams();
  
  // Initial resume data
  const initialResume = {
    personal: {
      name: 'John Doe',
      title: 'Software Developer',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      location: 'San Francisco, CA',
      summary: 'Passionate software developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies.'
    },
    experience: [
      { 
        role: 'Senior Frontend Developer', 
        company: 'Tech Solutions Inc.', 
        duration: '2020 - Present', 
        description: 'Led development of customer-facing applications using React and TypeScript. Improved application performance by 40%. Mentored junior developers and conducted code reviews.' 
      },
      { 
        role: 'Full Stack Developer', 
        company: 'StartupXYZ', 
        duration: '2018 - 2020', 
        description: 'Built and maintained full-stack applications using MERN stack. Implemented REST APIs and integrated third-party services.' 
      }
    ],
    education: [
      { 
        degree: 'Bachelor of Science in Computer Science', 
        institute: 'Stanford University', 
        year: '2014 - 2018' 
      }
    ],
    skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'Git', 'Docker'],
    projects: [
      {
        name: 'E-commerce Platform',
        tech: 'React, Node.js, MongoDB',
        desc: 'Built a full-featured e-commerce platform with payment integration and admin dashboard.'
      },
      {
        name: 'Task Management App',
        tech: 'React Native, Firebase',
        desc: 'Developed a cross-platform mobile app for team task management with real-time updates.'
      }
    ],
    theme: {
      primary: '#3b82f6'
    },
    template: 'modern'
  };

  // State management
  const [resume, setResume] = useState(initialResume);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(getTemplateById(resume.template));
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [userSubscription, setUserSubscription] = useState('premium'); // free, premium, vip
  const [isDownloading, setIsDownloading] = useState(false);

  // Filter templates based on user subscription
  const getAvailableTemplates = () => {
    const templatesArray = Object.values(TEMPLATES);
    return templatesArray.filter(template => {
      if (template.category === 'free') return true;
      if (template.category === 'premium' && userSubscription !== 'free') return true;
      if (template.category === 'vip' && userSubscription === 'vip') return true;
      return false;
    });
  };

  const availableTemplates = getAvailableTemplates();

  // Load saved data if editing existing resume - FIXED DEPENDENCY ISSUE
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const loadUserData = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.token) {
        try {
          const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          const res = await fetch(`${API_BASE}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            // Use functional update to avoid dependency warning
            setUserSubscription(u => userData.subscription.plan);
            localStorage.setItem('user', JSON.stringify({ 
              ...user, 
              subscription: userData.subscription.plan 
            }));
          }
        } catch (err) {
          console.warn('Failed to fetch user data');
        }
      } else {
        // Use functional update here too
        setUserSubscription(u => 'free');
      }
    };

    // ✅ LOAD RESUME FROM URL
    if (id) {
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const foundResume = savedResumes.find(r => r.id === id);
      if (foundResume) {
        setResume(foundResume.data);
        setActiveTemplate(getTemplateById(foundResume.data.template || 'modern'));
      }
    }

    loadUserData();

    return () => window.removeEventListener('resize', checkMobile);
  }, [id]);

  // Save resume to localStorage
  const saveResume = () => {
    const resumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const resumeId = id || 'resume_' + Date.now();
    
    const resumeToSave = {
      id: resumeId,
      title: resume.personal.name || 'Untitled Resume',
      data: resume,
      updatedAt: new Date().toISOString(),
      template: activeTemplate.id
    };
    
    // Update or add
    const index = resumes.findIndex(r => r.id === resumeId);
    if (index >= 0) {
      resumes[index] = resumeToSave;
    } else {
      resumes.push(resumeToSave);
    }
    
    localStorage.setItem('resumes', JSON.stringify(resumes));
    
    // ✅ NEW: Sync to backend
    syncResumeToBackend();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'save-success';
    successMsg.textContent = '✓ Resume saved successfully!';
    successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
      if (document.body.contains(successMsg)) {
        document.body.removeChild(successMsg);
      }
    }, 2000);
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    // Check if user has access to the template
    if (template.category === 'vip' && userSubscription !== 'vip') {
      alert('This VIP template requires VIP subscription. Please upgrade your account.');
      return;
    }

    if (template.category === 'premium' && userSubscription === 'free') {
      alert('This premium template requires at least Basic subscription. Please upgrade your account.');
      return;
    }
    
    setActiveTemplate(template);
    setResume(prev => ({
      ...prev,
      template: template.id,
      theme: {
       primary: activeTemplate.colors?.primary || '#3b82f6'
      }
    }));
    
    setShowTemplateSelector(false);
  };

  // Update field helper
  const updateField = (path, value) => {
    setResume(prev => {
      const newResume = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newResume;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        
        // Handle array indices like experience[0]
        const arrayMatch = key.match(/(\w+)\[(\d+)\]/);
        if (arrayMatch) {
          const arrayName = arrayMatch[1];
          const arrayIndex = parseInt(arrayMatch[2]);
          
          if (!current[arrayName]) current[arrayName] = [];
          if (!current[arrayName][arrayIndex]) {
            // Initialize based on array type
            if (arrayName === 'experience') {
              current[arrayName][arrayIndex] = { role: '', company: '', duration: '', description: '' };
            } else if (arrayName === 'education') {
              current[arrayName][arrayIndex] = { degree: '', institute: '', year: '' };
            } else if (arrayName === 'skills') {
              current[arrayName][arrayIndex] = '';
            } else if (arrayName === 'projects') {
              current[arrayName][arrayIndex] = { name: '', tech: '', desc: '' };
            }
          }
          current = current[arrayName][arrayIndex];
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      }
      
      const lastKey = keys[keys.length - 1];
      const lastArrayMatch = lastKey.match(/(\w+)\[(\d+)\]/);
      
      if (lastArrayMatch) {
        const arrayName = lastArrayMatch[1];
        const arrayIndex = parseInt(lastArrayMatch[2]);
        
        if (!current[arrayName]) current[arrayName] = [];
        current[arrayName][arrayIndex] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newResume;
    });
  };

  // Handle form changes
  const handlePersonalChange = (field, value) => {
    updateField(`personal.${field}`, value);
  };

  const handleExperienceChange = (index, field, value) => {
    updateField(`experience[${index}].${field}`, value);
  };

  const handleEducationChange = (index, field, value) => {
    updateField(`education[${index}].${field}`, value);
  };

  const handleSkillChange = (index, value) => {
    updateField(`skills[${index}]`, value);
  };

  const handleProjectChange = (index, field, value) => {
    updateField(`projects[${index}].${field}`, value);
  };

  // Helper function to create text version
  const createResumeText = (resumeData) => {
    let text = '';
    
    text += `RESUME\n`;
    text += `======\n\n`;
    text += `${resumeData.personal?.name || ''}\n`;
    text += `${resumeData.personal?.title || ''}\n`;
    text += `${resumeData.personal?.email || ''} | ${resumeData.personal?.phone || ''} | ${resumeData.personal?.location || ''}\n\n`;
    
    if (resumeData.personal?.summary) {
      text += `SUMMARY\n`;
      text += `${resumeData.personal.summary}\n\n`;
    }
    
    if (resumeData.experience?.length > 0) {
      text += `EXPERIENCE\n`;
      text += `==========\n`;
      resumeData.experience.forEach(exp => {
        text += `${exp.role || ''}\n`;
        text += `${exp.company || ''} | ${exp.duration || ''}\n`;
        text += `${exp.description || ''}\n\n`;
      });
    }
    
    if (resumeData.education?.length > 0) {
      text += `EDUCATION\n`;
      text += `=========\n`;
      resumeData.education.forEach(edu => {
        text += `${edu.degree || ''}\n`;
        text += `${edu.institute || ''} | ${edu.year || ''}\n\n`;
      });
    }
    
    if (resumeData.skills?.length > 0) {
      text += `SKILLS\n`;
      text += `======\n`;
      text += `${resumeData.skills.join(', ')}\n\n`;
    }
    
    text += `Generated with Resume Builder`;
    
    return text;
  };

  // ✅ UPDATED: Fixed download handler with environment variable
  const handleDownloadPDF = async () => {
    console.log('📥 Starting download process...');
    setIsDownloading(true);
    
    // ✅ UPDATED: Track download in backend with environment variable
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token && id) {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        await fetch(`${API_BASE}/api/resumes/${id}/download`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
      } catch (err) {
        console.warn('Failed to track download');
      }
    }

    try {
      // Show loading state on button
      const downloadBtn = document.querySelector('.downloadButton');
      if (downloadBtn) {
        downloadBtn.textContent = '🔄 Creating PDF...';
        downloadBtn.disabled = true;
      }
      
      // ✅ Ensure resume and template are valid
      if (!resume || !activeTemplate) {
        throw new Error('Resume or template is missing');
      }
      
      // Use our improved PDF generator
      const success = await generateModernDevPDF(resume, activeTemplate);
      
      if (!success) {
        // If PDF fails, show alternative options
        const textContent = createResumeText(resume);
        
        // Create a modal for alternative options instead of using confirm()
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        `;
        
        modal.innerHTML = `
          <div style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
          ">
            <h3 style="margin-top: 0;">PDF Generation Failed</h3>
            <p>Would you like to copy the resume text to clipboard instead?</p>
            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
              <button id="copy-text-btn" style="
                background: #3b82f6;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
              ">
                Copy to Clipboard
              </button>
              <button id="close-modal-btn" style="
                background: #e5e7eb;
                color: #4b5563;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
              ">
                Cancel
              </button>
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle copy text button
        modal.querySelector('#copy-text-btn').onclick = () => {
          navigator.clipboard.writeText(textContent).then(() => {
            alert('Resume text copied to clipboard!');
            document.body.removeChild(modal);
          });
        };
        
        // Handle close button
        modal.querySelector('#close-modal-btn').onclick = () => {
          document.body.removeChild(modal);
        };
      }
      
    } catch (error) {
      console.error('Download error:', error);
      
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
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      `;
      errorDiv.textContent = 'PDF generation failed. Please try again.';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      // ✅ Always restore button state
      const downloadBtn = document.querySelector('.downloadButton');
      if (downloadBtn) {
        downloadBtn.textContent = '📥 Download PDF';
        downloadBtn.disabled = false;
      }
      setIsDownloading(false);
    }
  };

  // Sync resume to backend (only if user is logged in)
  const syncResumeToBackend = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.token) return;

    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      await fetch(`${API_BASE}/api/resumes/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title: resume.personal.name || 'Untitled Resume',
          templateId: activeTemplate.id,
          content: resume
        })
      });
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>✨ Resume Editor</h1>
        <p className={styles.subtitle}>Build a professional resume with multiple templates</p>
        
        {/* Subscription Status */}
        <div className={styles.subscriptionStatus}>
          <span className={`${styles.subscriptionBadge} ${styles[userSubscription]}`}>
            {userSubscription.toUpperCase()} PLAN
          </span>
          {userSubscription === 'free' && (
            <button 
              className={styles.upgradeBtn}
              onClick={() => (window.location.href = '/upgrade')}
            >
              Upgrade for Premium Templates
            </button>
          )}
        </div>
      </div>

      <div className={`${styles.layout} ${isMobile ? styles.mobileLayout : ''}`}>
        {/* Left Panel - Edit Form */}
        <div className={`${styles.formPanel} ${isMobile ? styles.mobileFormPanel : ''}`}>
          
          {/* Template Selector Button */}
          <div className={styles.templateSelectorBtn}>
            <button 
              className={styles.templateBtn}
              onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            >
              🎨 Change Template ({activeTemplate.name})
            </button>
          </div>

          {/* Template Selector Modal */}
          {showTemplateSelector && (
            <div className={styles.templateModal}>
              <div className={styles.templateModalHeader}>
                <h3>Choose a Template</h3>
                <button 
                  className={styles.closeModal}
                  onClick={() => setShowTemplateSelector(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className={styles.templateCategories}>
                <div className={styles.category}>
                  <h4>Free Templates</h4>
                  <div className={styles.templateGrid}>
                    {availableTemplates
                      .filter(t => t.category === 'free')
                      .map(template => (
                        <TemplatePreview
                          key={template.id}
                          template={template}
                          resumeData={resume}
                          isActive={activeTemplate.id === template.id}
                          onSelect={() => handleTemplateSelect(template)}
                        />
                      ))
                    }
                  </div>
                </div>
                
                {userSubscription !== 'free' && (
                  <div className={styles.category}>
                    <h4>Premium Templates</h4>
                    <div className={styles.templateGrid}>
                      {availableTemplates
                        .filter(t => t.category === 'premium')
                        .map(template => (
                          <TemplatePreview
                            key={template.id}
                            template={template}
                            resumeData={resume}
                            isActive={activeTemplate.id === template.id}
                            onSelect={() => handleTemplateSelect(template)}
                          />
                        ))
                      }
                    </div>
                  </div>
                )}
                
                {userSubscription === 'vip' && (
                  <div className={styles.category}>
                    <h4>VIP Templates</h4>
                    <div className={styles.templateGrid}>
                      {availableTemplates
                        .filter(t => t.category === 'vip')
                        .map(template => (
                          <TemplatePreview
                            key={template.id}
                            template={template}
                            resumeData={resume}
                            isActive={activeTemplate.id === template.id}
                            onSelect={() => handleTemplateSelect(template)}
                          />
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Info */}
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={resume.personal.name}
              onChange={(e) => handlePersonalChange('name', e.target.value)}
              className={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Job Title</label>
            <input
              type="text"
              value={resume.personal.title}
              onChange={(e) => handlePersonalChange('title', e.target.value)}
              className={styles.input}
              placeholder="Software Developer"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={resume.personal.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              className={styles.input}
              placeholder="john@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              type="tel"
              value={resume.personal.phone}
              onChange={(e) => handlePersonalChange('phone', e.target.value)}
              className={styles.input}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Location</label>
            <input
              type="text"
              value={resume.personal.location}
              onChange={(e) => handlePersonalChange('location', e.target.value)}
              className={styles.input}
              placeholder="San Francisco, CA"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Professional Summary</label>
            <textarea
              value={resume.personal.summary}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              className={styles.textarea}
              placeholder="Passionate software developer with 5+ years of experience..."
              rows="4"
            />
          </div>

          {/* Experience */}
          <h2 className={styles.sectionTitle}>Experience</h2>
          
          {resume.experience.map((exp, index) => (
            <div key={index} className={styles.experienceItem}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Job Title</label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                  className={styles.input}
                  placeholder="Senior Developer"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  className={styles.input}
                  placeholder="Tech Corp Inc."
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                  className={styles.input}
                  placeholder="Jan 2020 - Present"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  className={styles.textarea}
                  placeholder="Key responsibilities and achievements..."
                  rows="3"
                />
              </div>
            </div>
          ))}

          <button
            className={styles.addButton}
            onClick={() => {
              setResume(prev => ({
                ...prev,
                experience: [
                  ...prev.experience,
                  { role: '', company: '', duration: '', description: '' }
                ]
              }));
            }}
          >
            + Add Experience
          </button>

          {/* Skills */}
          <h2 className={styles.sectionTitle}>Skills</h2>
          
          {resume.skills.map((skill, index) => (
            <div key={index} className={styles.formGroup}>
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className={styles.input}
                placeholder="React, JavaScript, Node.js"
              />
            </div>
          ))}

          <button
            className={styles.addButton}
            onClick={() => {
              setResume(prev => ({
                ...prev,
                skills: [...prev.skills, '']
              }));
            }}
          >
            + Add Skill
          </button>

          {/* Education */}
          <h2 className={styles.sectionTitle}>Education</h2>
          
          {resume.education.map((edu, index) => (
            <div key={index} className={styles.educationItem}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  className={styles.input}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Institution</label>
                <input
                  type="text"
                  value={edu.institute}
                  onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                  className={styles.input}
                  placeholder="Stanford University"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Year</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                  className={styles.input}
                  placeholder="2015 - 2019"
                />
              </div>
            </div>
          ))}

          <button
            className={styles.addButton}
            onClick={() => {
              setResume(prev => ({
                ...prev,
                education: [
                  ...prev.education,
                  { degree: '', institute: '', year: '' }
                ]
              }));
            }}
          >
            + Add Education
          </button>

          {/* Projects */}
          <h2 className={styles.sectionTitle}>Projects</h2>

          {resume.projects && resume.projects.length > 0 ? (
            resume.projects.map((project, index) => (
              <div key={index} className={styles.projectItem}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Name</label>
                  <input
                    type="text"
                    value={project.name || ''}
                    onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    className={styles.input}
                    placeholder="E-commerce Platform"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Technologies Used</label>
                  <input
                    type="text"
                    value={project.tech || ''}
                    onChange={(e) => handleProjectChange(index, 'tech', e.target.value)}
                    className={styles.input}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    value={project.desc || ''}
                    onChange={(e) => handleProjectChange(index, 'desc', e.target.value)}
                    className={styles.textarea}
                    placeholder="Built a full-featured e-commerce platform..."
                    rows="3"
                  />
                </div>
                
                {/* Delete project button - FIXED TYPO */}
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => {
                    const updatedProjects = [...resume.projects];
                    updatedProjects.splice(index, 1); // Fixed: removed underscore
                    setResume(prev => ({
                      ...prev,
                      projects: updatedProjects
                    }));
                  }}
                >
                  🗑️ Remove Project
                </button>
              </div>
            ))
          ) : (
            <p className={styles.noData}>No projects added yet.</p>
          )}

          <button
            className={styles.addButton}
            onClick={() => {
              setResume(prev => ({
                ...prev,
                projects: [
                  ...(prev.projects || []),
                  { name: '', tech: '', desc: '' }
                ]
              }));
            }}
          >
            + Add Project
          </button>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={saveResume}>
              💾 Save Resume
            </button>
            
            <button 
              className={`${styles.downloadButton} downloadButton`} 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? '🔄 Creating PDF...' : '📥 Download PDF'}
            </button>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className={`${styles.previewPanel} ${isMobile ? styles.mobilePreviewPanel : ''}`}>
          <div className={styles.previewHeader}>
            <h3>Live Preview</h3>
            <div className={styles.previewActions}>
              <span className={styles.templateName}>
                {activeTemplate.name} Template
              </span>
              <button 
                className={styles.changeTemplateBtn}
                onClick={() => setShowTemplateSelector(true)}
              >
                Change
              </button>
            </div>
          </div>
          
          <div className={styles.previewContainer}>
            <div className={styles.previewFrame} id="resume-preview">
              <FullTemplatePreview 
                template={activeTemplate} 
                resumeData={{
                  ...resume,
                  theme: {
                    primary: activeTemplate.colors?.primary || '#3b82f6',
                    secondary: activeTemplate.colors?.secondary || '#8b5cf6',
                    background: activeTemplate.colors?.background || '#ffffff',
                    text: activeTemplate.colors?.text || '#1f2937'
                  }
                }} 
              />
            </div>
          </div>
          
          <div className={styles.previewInfo}>
            <p><strong>Template:</strong> {activeTemplate.name}</p>
            <p><strong>Type:</strong> {activeTemplate.category.toUpperCase()}</p>
            <p><strong>Layout:</strong> {activeTemplate.layout.replace('-', ' ').toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;