// src/components/download/DownloadSuccess.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DownloadSuccess.module.css';

const DownloadSuccess = ({ filename = 'resume.pdf' }) => {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
const handlePrintResume = () => {
  // Don't print this page, open a printable version instead
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head><title>Printable Resume</title></head>
    <body>
      <h1>Your Resume</h1>
      <p>To print your resume:</p>
      <ol>
        <li>Go back to the editor</li>
        <li>Click "Download PDF"</li>
        <li>Open the downloaded file</li>
        <li>Use your PDF viewer's print option</li>
      </ol>
      <button onclick="window.close()">Close</button>
    </body>
    </html>
  `);
  printWindow.document.close();
};

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>✅</div>
        
        <h1 className={styles.successTitle}>Download Complete!</h1>
        
        <div className={styles.successMessage}>
          <p>Your resume has been successfully downloaded as:</p>
          <div className={styles.filename}>
            📄 <strong>{filename}</strong>
          </div>
        </div>
        
        <div className={styles.successActions}>
          <button
            className={styles.printButton}
            onClick={handlePrintResume}
          >
            🖨️ Print Resume
          </button>
          
          <Link to="/editor" className={styles.editButton}>
            ✏️ Edit Again
          </Link>
          
          <button
            className={styles.shareButton}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My Resume',
                  text: 'Check out my resume!',
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
          >
            🔗 Share Resume
          </button>
        </div>
        
        <div className={styles.nextSteps}>
          <h3>What's Next?</h3>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📧</div>
              <div className={styles.stepTitle}>Email to Employers</div>
              <div className={styles.stepDesc}>Send your new resume to potential employers</div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>💼</div>
              <div className={styles.stepTitle}>Upload to Job Portals</div>
              <div className={styles.stepDesc}>Update your profile on LinkedIn, Indeed, etc.</div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>✨</div>
              <div className={styles.stepTitle}>Create Another</div>
              <div className={styles.stepDesc}>Make a customized version for different jobs</div>
            </div>
          </div>
        </div>
        
        <div className={styles.autoRedirect}>
          <p>Returning to editor in <span className={styles.countdown}>{countdown}</span> seconds...</p>
          <Link to="/editor" className={styles.skipLink}>
            Skip and go to editor now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DownloadSuccess;