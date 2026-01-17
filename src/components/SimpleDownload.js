// components/SimpleDownload.js
import React from 'react';
import pdfFile from '../public/files/document.pdf'; // or directly reference

const SimpleDownload = () => {
    return (
        <div>
            {/* Method A: Direct link to public folder */}
            <a 
                href="/files/document.pdf" 
                download="document.pdf"
                style={styles.link}
            >
                📥 Click to Download PDF
            </a>
            
            {/* Method B: Using import */}
            <a 
                href={pdfFile}
                download="document.pdf"
                style={styles.link}
            >
                📥 Click to Download PDF (Imported)
            </a>
            
            {/* Method C: For mobile optimization */}
            <button
                onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/files/document.pdf';
                    link.download = 'document.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}
                style={styles.button}
            >
                📱 Mobile-Friendly Download
            </button>
        </div>
    );
};

const styles = {
    link: {
        display: 'inline-block',
        padding: '15px 30px',
        backgroundColor: '#28a745',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        margin: '10px',
        fontSize: '16px'
    },
    button: {
        padding: '15px 30px',
        backgroundColor: '#ff6b35',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '10px',
        fontSize: '16px'
    }
};

export default SimpleDownload;