import React from 'react';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ExportPdfButton = ({ targetElementId = "report-container" }) => {
  const handleExport = () => {
    const element = document.getElementById(targetElementId);
    if (!element) {
      alert("Report container not found.");
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     'AQI_Health_Advisory_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg transition"
    >
      <Download size={16} />
      Export PDF Report
    </button>
  );
};

export default ExportPdfButton;