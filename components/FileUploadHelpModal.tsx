import React from 'react';
import { Button } from './ui/Button';

interface FileUploadHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export const FileUploadHelpModal: React.FC<FileUploadHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">File Upload Guide & Sending Limits</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <XIcon className="h-5 w-5" />
          </Button>
        </header>
        <div className="p-6 text-gray-300 space-y-6 overflow-y-auto">
          
          <div>
            <h3 className="font-semibold text-gray-100 mb-2 text-md">Supported File Formats</h3>
            <p className="text-gray-400">You can upload recipient lists using <code className="text-sm bg-gray-700/50 text-orange-300 py-0.5 px-1.5 rounded-md">.csv</code> (Comma-Separated Values) or <code className="text-sm bg-gray-700/50 text-orange-300 py-0.5 px-1.5 rounded-md">.xlsx</code> (Excel) files.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-100 mb-2 text-md">File Structure</h3>
            <p className="text-gray-400">Your file must contain a header row. The parser will automatically look for a column named <strong className="text-pink-400 font-semibold">'email'</strong>. If it's not found, the first column in your file will be used for email addresses.</p>
            <p className="mt-3 text-sm text-gray-300">Example <code className="text-sm bg-gray-700/50 text-orange-300 py-0.5 px-1.5 rounded-md">.csv</code> structure:</p>
            <pre className="mt-1 p-3 bg-gray-800/50 rounded-md text-sm text-gray-300 font-mono border border-white/10">
              <code>
                email,firstName,lastName<br/>
                sally@example.com,Sally,Vee<br/>
                pirate@example.com,Jack,Sparrow
              </code>
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-100 mb-2 text-md">How to Create a Recipient File</h3>
             <ol className="list-decimal list-inside space-y-2 text-gray-400">
                <li>Open your preferred spreadsheet software (e.g., Google Sheets, Excel).</li>
                <li>Create a header row with column titles. Ensure one is named <strong className="font-semibold text-pink-400">email</strong>.</li>
                <li>Add your recipient data in the rows below the header.</li>
                <li>Go to <strong className="font-semibold text-gray-200">File &gt; Download</strong> (or Save As) and choose either <strong className="font-semibold text-pink-400">CSV</strong> or <strong className="font-semibold text-pink-400">Excel (.xlsx)</strong> format.</li>
             </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-100 mb-2 text-md">Resend Free Tier Limits</h3>
            <p className="text-gray-400">This builder is designed for use with the Resend API. Their free plan is generous, but has the following limits:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 pl-2 text-gray-300">
                <li><strong className="font-semibold text-white">100</strong> emails per day.</li>
                <li><strong className="font-semibold text-white">3,000</strong> emails per month.</li>
                <li><strong className="font-semibold text-white">1</strong> custom domain for sending.</li>
            </ul>
             <p className="mt-4 text-sm text-gray-400">
                For more details or to upgrade your plan, visit the official <a href="https://resend.com/pricing" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline hover:text-pink-300 transition-colors">Resend pricing page</a>.
             </p>
          </div>

        </div>
        <footer className="p-4 border-t border-white/10 flex-shrink-0 text-right">
             <Button onClick={onClose}>Got it, thanks!</Button>
        </footer>
      </div>
    </div>
  );
};
