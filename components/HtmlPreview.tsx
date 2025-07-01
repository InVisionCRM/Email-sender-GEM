import React from 'react';

interface HtmlPreviewProps {
  htmlContent: string;
}

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlContent }) => {
  return (
    <div className="h-full w-full bg-white text-gray-900 border border-gray-200 rounded-md shadow-sm overflow-auto">
      <iframe
        srcDoc={`<style>body { margin: 0; padding: 1rem; color: #1a202c; background: #fff; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; } ::-webkit-scrollbar-thumb:hover { background: #555; }</style>${htmlContent}`}
        title="HTML Preview"
        className="w-full h-full border-0"
        sandbox="allow-scripts"
      />
    </div>
  );
};
