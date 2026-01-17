// src/utils/downloadFeedback.js
export const showDownloadSuccess = (filename) => {
  // Hide any existing loading states
  // hideLoadingState();
  
  // Create success overlay
  const successDiv = document.createElement('div');
  successDiv.id = 'download-success-overlay';
  successDiv.innerHTML = `
    <div class="success-overlay">
      <div class="success-content">
        <div class="success-animation">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2>Download Complete!</h2>
        <p>Your resume <strong>${filename}</strong> has been downloaded.</p>
        <div class="success-actions">
          <button onclick="window.location.href='/download-success?filename=${encodeURIComponent(filename)}'" class="view-btn">
            View Details
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" class="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    #download-success-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }
    
    .success-overlay {
      background: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      max-width: 400px;
      animation: slideUp 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .checkmark {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
    }
    
    .checkmark__circle {
      stroke: #10b981;
      stroke-width: 2;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    
    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      stroke: #10b981;
    }
    
    @keyframes stroke {
      100% { stroke-dashoffset: 0; }
    }
    
    .success-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
    
    .view-btn, .close-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    
    .view-btn {
      background: #3b82f6;
      color: white;
    }
    
    .close-btn {
      background: #e5e7eb;
      color: #4b5563;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(successDiv);
  
  // Auto-remove after 8 seconds
  setTimeout(() => {
    if (document.getElementById('download-success-overlay')) {
      document.getElementById('download-success-overlay').remove();
    }
  }, 8000);
};