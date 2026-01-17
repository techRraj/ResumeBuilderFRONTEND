// components/DownloadButton.js
import React, { useState } from 'react';
import axios from 'axios';

const DownloadButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Method 1: Using window.location (Recommended for PDFs)
    const handleDownloadSimple = () => {
        // Direct link to the PDF on your backend
        window.open(`${process.env.REACT_APP_API_URL}/api/download-pdf`, '_blank');
    };

    // Method 2: Using axios with blob (For more control)
    const handleDownloadWithAxios = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios({
                url: `${process.env.REACT_APP_API_URL}/api/download-pdf`,
                method: 'GET',
                responseType: 'blob', // IMPORTANT for file downloads
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'document.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            // Clean up
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Download failed. Please try again.');
            console.error('Download error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Method 3: Direct anchor tag (Simplest)
    const DownloadLink = () => (
        <a 
            href={`${process.env.REACT_APP_API_URL}/api/download-pdf`}
            download="document.pdf"
            style={{ textDecoration: 'none' }}
        >
            <button style={styles.button}>
                📥 Download PDF
            </button>
        </a>
    );

    return (
        <div style={styles.container}>
            <h3>Download PDF (Works on All Devices)</h3>
            
            {/* Method 3 - Recommended for simplicity */}
            <DownloadLink />
            
            <div style={{ marginTop: '20px' }}>
                <button 
                    onClick={handleDownloadSimple}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Downloading...' : '⬇️ Method 1: Simple Download'}
                </button>
                
                <button 
                    onClick={handleDownloadWithAxios}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Downloading...' : '⬇️ Method 2: Axios Download'}
                </button>
            </div>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <p style={styles.note}>
                <strong>Note:</strong> Make sure your PDF file is in 
                <code>/server/public/files/document.pdf</code>
            </p>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
    },
    button: {
        padding: '12px 24px',
        margin: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    note: {
        marginTop: '30px',
        fontSize: '14px',
        color: '#666'
    }
};

export default DownloadButton;