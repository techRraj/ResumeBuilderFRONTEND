// src/utils
export const generateResumeHTML = (resumeData, activeTemplate) => {
  const { personal, experience, education, skills, projects } = resumeData;
  const { colors } = activeTemplate;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personal.name || 'Resume'}</title>
      <style>
        /* Reset and base styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: ${colors.text || '#1f2937'};
          background: white;
          width: 210mm;
          min-height: 297mm;
          padding: 20mm;
          margin: 0 auto;
        }
        
        /* Print styles */
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            padding: 15mm;
            width: 100%;
            min-height: 100%;
          }
        }
        
        /* Header */
        .resume-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid ${colors.primary};
        }
        
        .name {
          font-size: 36px;
          font-weight: 800;
          color: ${colors.text || '#1f2937'};
          margin-bottom: 8px;
          line-height: 1.1;
        }
        
        .title {
          font-size: 20px;
          font-weight: 600;
          color: ${colors.primary};
          margin-bottom: 15px;
        }
        
        .contact-info {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 14px;
          color: #6b7280;
        }
        
        /* Sections */
        .section {
          margin-bottom: 25px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: ${colors.primary};
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid ${colors.primary};
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        /* Summary */
        .summary {
          font-size: 14px;
          line-height: 1.6;
          text-align: justify;
        }
        
        /* Experience */
        .experience-item {
          margin-bottom: 20px;
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .role {
          font-size: 16px;
          font-weight: 700;
          color: ${colors.text || '#1f2937'};
        }
        
        .company {
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
        }
        
        .duration {
          font-size: 13px;
          color: #6b7280;
          font-style: italic;
        }
        
        .description {
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* Skills */
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .skill-tag {
          background: ${colors.primary}20;
          color: ${colors.primary};
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }
        
        /* Education */
        .education-item {
          margin-bottom: 15px;
        }
        
        .degree {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .institute {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 3px;
        }
        
        .year {
          font-size: 13px;
          color: #6b7280;
          font-style: italic;
        }
        
        /* Projects */
        .project-item {
          margin-bottom: 20px;
        }
        
        .project-name {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .project-tech {
          font-size: 13px;
          color: #6b7280;
          font-style: italic;
          margin-bottom: 8px;
        }
        
        .project-desc {
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* Two column layout for larger content */
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        /* Print button (only shows in browser) */
        .print-controls {
          text-align: center;
          padding: 20px;
          background: #f0f9ff;
          border-radius: 10px;
          margin-bottom: 30px;
          display: none;
        }
        
        @media screen {
          .print-controls {
            display: block;
          }
        }
        
        .print-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin: 10px;
        }
        
        .print-btn:hover {
          background: #2563eb;
        }
        
        .auto-print-notice {
          background: #10b981;
          color: white;
          padding: 10px;
          border-radius: 8px;
          margin-top: 15px;
          font-size: 14px;
        }
      </style>
      <script>
        window.onload = function() {
          // Show print controls
          const printControls = document.querySelector('.print-controls');
          if (printControls) {
            printControls.style.display = 'block';
          }
          
          // Auto-print after 2 seconds (only if not already printed)
          setTimeout(() => {
            if (!window.sessionStorage.getItem('resume_printed')) {
              window.print();
              window.sessionStorage.setItem('resume_printed', 'true');
              setTimeout(() => {
                if (window.opener) {
                  window.close();
                }
              }, 1000);
            }
          }, 2000);
        };
        
        function manualPrint() {
          window.print();
        }
        
        function closeWindow() {
          window.close();
        }
      </script>
    </head>
    <body>
      <!-- Print Controls -->
      <div class="print-controls">
        <h3>📄 Resume Ready for Download</h3>
        <p>Click the button below to print/save as PDF</p>
        <p><small>In print dialog, select "Save as PDF" as destination</small></p>
        <button class="print-btn" onclick="manualPrint()">
          🖨️ Print / Save as PDF
        </button>
        <button class="print-btn" onclick="closeWindow()" style="background: #6b7280;">
          ✕ Close
        </button>
        <div class="auto-print-notice">
          ⏳ Auto-printing in 2 seconds...
        </div>
      </div>
      
      <!-- Resume Content -->
      <div class="resume-content">
        <!-- Header -->
        <div class="resume-header">
          <h1 class="name">${personal.name || 'Your Name'}</h1>
          <h2 class="title">${personal.title || 'Professional Title'}</h2>
          <div class="contact-info">
            ${personal.email ? `<span>✉️ ${personal.email}</span>` : ''}
            ${personal.phone ? `<span>📞 ${personal.phone}</span>` : ''}
            ${personal.location ? `<span>📍 ${personal.location}</span>` : ''}
          </div>
        </div>
        
        <!-- Summary -->
        ${personal.summary ? `
          <div class="section">
            <h3 class="section-title">Professional Summary</h3>
            <p class="summary">${personal.summary}</p>
          </div>
        ` : ''}
        
        <div class="two-column">
          <!-- Left Column -->
          <div>
            <!-- Experience -->
            ${experience && experience.length > 0 && experience[0].role ? `
              <div class="section">
                <h3 class="section-title">Work Experience</h3>
                ${experience.map(exp => `
                  <div class="experience-item">
                    <div class="experience-header">
                      <div>
                        <div class="role">${exp.role || ''}</div>
                        ${exp.company ? `<div class="company">${exp.company}</div>` : ''}
                      </div>
                      ${exp.duration ? `<div class="duration">${exp.duration}</div>` : ''}
                    </div>
                    ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            <!-- Projects -->
            ${projects && projects.length > 0 && projects[0].name ? `
              <div class="section">
                <h3 class="section-title">Projects</h3>
                ${projects.map(proj => `
                  <div class="project-item">
                    <div class="project-name">${proj.name || ''}</div>
                    ${proj.tech ? `<div class="project-tech">${proj.tech}</div>` : ''}
                    ${proj.desc ? `<p class="project-desc">${proj.desc}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <!-- Right Column -->
          <div>
            <!-- Skills -->
            ${skills && skills.length > 0 ? `
              <div class="section">
                <h3 class="section-title">Skills</h3>
                <div class="skills-container">
                  ${skills.filter(s => s).map(skill => `
                    <span class="skill-tag">${skill}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <!-- Education -->
            ${education && education.length > 0 && education[0].degree ? `
              <div class="section">
                <h3 class="section-title">Education</h3>
                ${education.map(edu => `
                  <div class="education-item">
                    <div class="degree">${edu.degree || ''}</div>
                    ${edu.institute ? `<div class="institute">${edu.institute}</div>` : ''}
                    ${edu.year ? `<div class="year">${edu.year}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <p>Generated with Resume Builder Pro • ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
};

// Simple print function
export const printResume = (resumeData, activeTemplate) => {
  const html = generateResumeHTML(resumeData, activeTemplate);
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Focus the window
  printWindow.focus();
};

// Download as HTML file
export const downloadResumeHTML = (resumeData, activeTemplate) => {
  const html = generateResumeHTML(resumeData, activeTemplate);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${resumeData.personal.name.replace(/\s+/g, '_') || 'resume'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
