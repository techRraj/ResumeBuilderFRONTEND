// src/utils/pdfGenerator.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ✅ VALIDATE COLORS BEFORE RENDERING
const isValidColor = (color) => {
  if (!color || typeof color !== 'string') return false;
  const trimmed = color.trim();
  if (trimmed === '') return false;
  
  // Check hex colors (#fff, #ffffff)
  if (/^#([0-9a-f]{3}){1,2}$/i.test(trimmed)) return true;
  
  // Check rgb/rgba
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(trimmed)) return true;
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(trimmed)) return true;
  
  // Common named colors
  const validNames = [
    'red', 'blue', 'green', 'black', 'white', 'gray', 'grey', 
    'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta'
  ];
  return validNames.includes(trimmed.toLowerCase());
};

// ✅ SANITIZE TEMPLATE COLORS
const sanitizeTemplateColors = (template) => {
  const safeColors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937'
  };
  
  if (template?.colors) {
    Object.keys(safeColors).forEach(key => {
      if (isValidColor(template.colors[key])) {
        safeColors[key] = template.colors[key];
      }
    });
  }
  
  return safeColors;
};

// ✅ TEMPORARY CSS FIX FOR GRADIENTS
const injectSafeStyles = (previewElement, safeColors) => {
  const style = document.createElement('style');
  style.textContent = `
    /* Override problematic gradients */
    .resume-preview * {
      background: ${safeColors.background} !important;
      color: ${safeColors.text} !important;
    }
    
    /* Ensure no invalid gradients */
    .resume-preview [style*="gradient"] {
      background: ${safeColors.primary} !important;
    }
    
    /* Safe button/link colors */
    .resume-preview a, .resume-preview button {
      color: ${safeColors.primary} !important;
    }
    
    /* Force solid backgrounds */
    .resume-preview {
      background: ${safeColors.background} !important;
    }
  `;
  previewElement.appendChild(style);
  return style;
};

// Pure client-side PDF generator - NO SERVER REQUIRED
export const generateModernDevPDF = async (resumeData, template) => {
  try {
    console.log('🔄 Starting client-side PDF generation...');
    showPDFLoading();
    
    // ✅ SANITIZE COLORS FIRST
    const safeColors = sanitizeTemplateColors(template);
    
    // Method 1: Try direct HTML to PDF
    // ✅ FIX: Pass resumeData to the function
    const success = await generatePDFFromPreview(resumeData, safeColors);
    
    if (success) {
      hidePDFLoading();
      return true;
    }
    
    // Method 2: Fallback - Create printable HTML
    hidePDFLoading();
    return createPrintableHTML(resumeData, safeColors);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    hidePDFLoading();
    return downloadAsJSON(resumeData);
  }
};

// Method 1: Direct PDF from preview
// ✅ FIX: Add resumeData parameter
async function generatePDFFromPreview(resumeData, safeColors) {
  return new Promise(async (resolve) => {
    try {
      const previewElement = document.querySelector('#resume-preview') || 
                           document.querySelector('.previewFrame') ||
                           document.querySelector('[class*="preview"]');
      
      if (!previewElement) {
        console.warn('Preview element not found');
        resolve(false);
        return;
      }
      
      // ✅ INJECT SAFE STYLES
      const styleOverride = injectSafeStyles(previewElement, safeColors);
      
      // Store original styles
      const originalStyles = previewElement.getAttribute('style') || '';
      const originalBodyBackground = document.body.style.background;
      
      // Make print-friendly
      previewElement.style.cssText += `
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 210mm !important;
        min-height: 297mm !important;
        background: ${safeColors.background} !important;
        padding: 20mm !important;
        box-shadow: none !important;
        border: none !important;
        z-index: 99999 !important;
        color: ${safeColors.text} !important;
      `;
      
      document.body.style.background = safeColors.background;
      
      // Hide other elements
      const allElements = Array.from(document.body.children);
      const hiddenElements = allElements
        .filter(el => el !== previewElement && el.style.display !== 'none')
        .map(el => ({ element: el, display: el.style.display }));
      
      hiddenElements.forEach(item => {
        item.element.style.display = 'none';
      });
      
      // ✅ CAPTURE WITH SAFE CONFIG
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: safeColors.background,
        logging: false,
        allowTaint: true,
        ignoreElements: (element) => {
          // Skip problematic elements
          return element.tagName === 'SCRIPT' || 
                 element.classList.contains('no-print');
        }
      });
      
      // Cleanup
      previewElement.setAttribute('style', originalStyles);
      document.body.style.background = originalBodyBackground;
      hiddenElements.forEach(item => {
        item.element.style.display = item.display;
      });
      if (styleOverride.parentNode) {
        styleOverride.parentNode.removeChild(styleOverride);
      }
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // ✅ FIX: Now resumeData is available
      const filename = `Resume_${resumeData.personal?.name?.replace(/\s+/g, '_') || 'My'}_${Date.now()}.pdf`;
      pdf.save(filename);
      
      showDownloadSuccess(filename);
      resolve(true);
      
    } catch (error) {
      console.warn('Direct PDF failed:', error);
      resolve(false);
    }
  });
}

// Method 2: Create printable HTML (Fallback)
// ✅ UPDATED PRINTABLE HTML WITH SAFE COLORS
function createPrintableHTML(resumeData, safeColors) {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resumeData.personal?.name || 'Resume'}</title>
        <style>
          :root {
            --primary: ${safeColors.primary};
            --secondary: ${safeColors.secondary};
            --background: ${safeColors.background};
            --text: ${safeColors.text};
          }
          
          @media print {
            @page { margin: 15mm; }
            body { margin: 0; background: var(--background) !important; }
            .no-print { display: none !important; }
          }
          
          body {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background: var(--background);
          }
          
          .resume-header {
            border-bottom: 3px solid var(--primary);
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          h1 {
            color: var(--text);
            margin: 0 0 5px 0;
            font-size: 2.5em;
          }
          
          .title {
            color: var(--primary);
            font-size: 1.3em;
            font-weight: 600;
            margin: 0 0 15px 0;
          }
          
          .contact-info {
            color: #6b7280;
            font-size: 1em;
            margin: 10px 0;
          }
          
          .section-title {
            color: var(--text);
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 1.4em;
          }
          
          .skill-tag {
            background: var(--primary);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
          }
          
          .print-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <!-- Resume Content -->
        <div class="resume-header">
          <h1>${resumeData.personal?.name || 'Your Name'}</h1>
          <div class="title">${resumeData.personal?.title || 'Your Title'}</div>
          <div class="contact-info">
            ${resumeData.personal?.email || ''} 
            ${resumeData.personal?.phone ? '| ' + resumeData.personal.phone : ''} 
            ${resumeData.personal?.location ? '| ' + resumeData.personal.location : ''}
          </div>
          ${resumeData.personal?.summary ? `<p>${resumeData.personal.summary}</p>` : ''}
        </div>
        
        <!-- Experience -->
        ${resumeData.experience?.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Experience</h2>
            ${resumeData.experience.map(exp => `
              <div class="experience-item">
                <h3 class="job-title">${exp.role || 'Position'}</h3>
                <div class="company">${exp.company || 'Company'}</div>
                <div class="duration">${exp.duration || 'Duration'}</div>
                <p>${exp.description || 'Description of responsibilities and achievements.'}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Education -->
        ${resumeData.education?.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resumeData.education.map(edu => `
              <div class="education-item">
                <h3 class="job-title">${edu.degree || 'Degree'}</h3>
                <div class="company">${edu.institute || 'Institution'}</div>
                <div class="duration">${edu.year || 'Years'}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        <!-- Skills -->
        ${resumeData.skills?.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">
              ${resumeData.skills.map(skill => `
                <span class="skill-tag">${skill}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="print-actions no-print">
          <button class="print-btn" onclick="window.print()">
            🖨️ Print / Save as PDF
          </button>
          <div class="instructions" style="margin-top: 10px;">
            <button onclick="window.close()" style="background: none; border: none; color: var(--primary); cursor: pointer; text-decoration: underline;">
              Close this window
            </button>
          </div>
        </div>
        
        <script>
          setTimeout(() => window.print(), 1000);
          window.onafterprint = () => setTimeout(() => window.close(), 1000);
        </script>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    return true;
    
  } catch (error) {
    console.error('Printable HTML failed:', error);
    return false;
  }
}

// Method 3: Download as JSON (Ultimate fallback)
function downloadAsJSON(resumeData) {
  try {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `Resume_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('JSON download failed:', error);
    return false;
  }
}

// Loading overlay
let loadingOverlay = null;

export function showPDFLoading() {
  if (loadingOverlay) return;
  
  loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'pdf-loading-overlay';
  loadingOverlay.innerHTML = `
    <div class="loading-content">
      <div class="spinner"></div>
      <h3>Creating Your Resume PDF</h3>
      <p>Please wait while we generate your professional resume...</p>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    #pdf-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      backdrop-filter: blur(5px);
    }
    .loading-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      text-align: center;
      max-width: 400px;
      animation: fadeIn 0.3s ease;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .loading-content h3 {
      margin: 0 0 10px 0;
      color: #111827;
    }
    .loading-content p {
      margin: 0;
      color: #6b7280;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(loadingOverlay);
}

export function hidePDFLoading() {
  if (loadingOverlay && document.body.contains(loadingOverlay)) {
    document.body.removeChild(loadingOverlay);
    loadingOverlay = null;
  }
}

// Success notification
export function showDownloadSuccess(filename) {
  const success = document.createElement('div');
  success.id = 'pdf-success-toast';
  success.innerHTML = `
    <div class="success-toast">
      <span class="success-icon">✅</span>
      <span class="success-message">
        <strong>Resume Downloaded!</strong><br>
        <small>${filename} saved to your device</small>
      </span>
      <button class="close-btn" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    #pdf-success-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 100000;
      animation: slideInUp 0.3s ease;
    }
    @keyframes slideInUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .success-toast {
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      min-width: 300px;
    }
    .success-icon {
      font-size: 24px;
    }
    .success-message {
      flex: 1;
      line-height: 1.4;
    }
    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      padding: 5px;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(success);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.getElementById('pdf-success-toast')) {
      document.getElementById('pdf-success-toast').remove();
    }
  }, 5000);
}

// Simple print function (optional)
export function printResume(resumeData) {
  const safeColors = {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937'
  };
  return createPrintableHTML(resumeData, safeColors);
}
