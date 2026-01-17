// components/PDFDownloadButton.jsx
import React, { useState } from 'react';
import './PDFDownloadButton.css';

const PDFDownloadButton = ({ 
    pdfUrl = '/templates/resume-template.pdf',
    fileName = 'MyResume.pdf',
    buttonText = 'Download PDF',
    variant = 'primary'
}) => {
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            setError(null);
            
            // Method 1: Direct download (works on most devices)
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = fileName;
            link.style.display = 'none';
            
            // Append to body for iOS compatibility
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Fallback for iOS Safari
            setTimeout(() => {
                if (!downloading) {
                    window.open(pdfUrl, '_blank');
                }
            }, 1000);
            
        } catch (err) {
            setError('Download failed. Please try again.');
            console.error('Download error:', err);
            
            // Final fallback
            window.open(pdfUrl, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    // Alternative: Force download via fetch
    const handleDownloadViaFetch = async () => {
        try {
            setDownloading(true);
            setError(null);
            
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);
            
        } catch (err) {
            setError('Failed to download PDF');
            console.error(err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="pdf-download-container">
            <button
                onClick={handleDownload}
                disabled={downloading}
                className={`pdf-download-btn ${variant} ${downloading ? 'downloading' : ''}`}
                title="Download PDF file"
            >
                {downloading ? (
                    <>
                        <span className="spinner"></span>
                        Downloading...
                    </>
                ) : (
                    <>
                        <span className="icon">📥</span>
                        {buttonText}
                    </>
                )}
            </button>
            
            {/* Alternative download method button */}
            <button
                onClick={handleDownloadViaFetch}
                className="pdf-download-alt"
                title="Alternative download method"
            >
                ⬇️ Alternative Download
            </button>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="download-note">
                <small>Works on all devices: Mobile, Tablet & Desktop</small>
            </div>
        </div>
    );
};

export default PDFDownloadButton;