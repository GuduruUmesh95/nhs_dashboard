'use client';

import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';

interface PdfExportButtonProps {
  targetId: string;
  filename: string;
  disabled?: boolean;
  title?: string;
  exportUrl?: string;
}

export default function PdfExportButton({ targetId, filename, disabled = false, title, exportUrl }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    setIsExporting(true);
    
    try {
      const currentUrl = exportUrl || window.location.href;
      const apiUrl = `/api/export-pdf?url=${encodeURIComponent(currentUrl)}&targetId=${encodeURIComponent(targetId)}&filename=${encodeURIComponent(filename)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${await response.text()}`);
      }
      
      // Convert the response to a Blob
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link to download the blob
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate PDF. Please check the server logs.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      className="btn btn-outline" 
      onClick={exportPDF} 
      disabled={isExporting || disabled} 
      title={title}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        opacity: disabled ? 0.5 : 1, 
        cursor: disabled ? 'not-allowed' : 'pointer' 
      }}
    >
      {isExporting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <FileDown size={15} />}
      <span>{isExporting ? 'Preparing PDF...' : 'Export PDF'}</span>
      {isExporting && (
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      )}
    </button>
  );
}
