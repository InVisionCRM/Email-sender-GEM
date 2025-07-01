import React from 'react';
import { Button } from './ui/Button';
import { HtmlPreview } from './HtmlPreview';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: string;
  subject: string;
  htmlBody: string;
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);


export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ isOpen, onClose, recipients, subject, htmlBody }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Email Preview</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </header>
        <div className="p-6 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex items-baseline">
              <span className="text-sm font-medium text-gray-400 w-16">From:</span>
              <span className="text-sm text-gray-200">you@example.com</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-sm font-medium text-gray-400 w-16">To:</span>
              <span className="text-sm text-gray-200 truncate">{recipients}</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-sm font-medium text-gray-400 w-16">Subject:</span>
              <span className="text-sm font-semibold text-gray-200">{subject}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 flex-1 p-1 overflow-hidden bg-white/5 rounded-b-lg">
            <HtmlPreview htmlContent={htmlBody} />
        </div>
      </div>
    </div>
  );
};