// utils/pdfDownloader.js
export const downloadPDF = (content, filename = 'document.pdf') => {
    try {
        // Method 1: Direct URL approach (If PDF is in public folder)
        const pdfUrl = `/templates/${filename}`;
        
        // Create an anchor element
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = filename;
        
        // For mobile devices, append to body first
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (error) {
        console.error('Download error:', error);
        
        // Fallback method for mobile
        window.open(`/templates/${filename}`, '_blank');
        return false;
    }
};

// Alternative: Generate PDF from HTML content using jsPDF
export const generateAndDownloadPDF = (htmlContent, filename = 'document.pdf') => {
    // You'll need to install jsPDF: npm install jspdf html2canvas
    import('jspdf').then(({ jsPDF }) => {
        import('html2canvas').then((html2canvas) => {
            const element = document.createElement('div');
            element.innerHTML = htmlContent;
            document.body.appendChild(element);
            
            html2canvas.default(element).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(filename);
                
                document.body.removeChild(element);
            });
        });
    });
};