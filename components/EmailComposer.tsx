import React, { useState, useCallback, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { HtmlPreview } from './HtmlPreview';
import { EmailPreviewModal } from './EmailPreviewModal';
import { FileUploadHelpModal } from './FileUploadHelpModal';
import { Separator } from './ui/Separator';
import { toast } from './ui/Toaster';
import { ImgurLibraryModal } from './ImgurLibraryModal';
import { sendEmail } from '../services/resendService';

interface EmailComposerProps {
  recipients: string;
  setRecipients: React.Dispatch<React.SetStateAction<string>>;
  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;
  htmlBody: string;
  setHtmlBody: React.Dispatch<React.SetStateAction<string>>;
  onSave: () => void;
  isTemplateSelected: boolean;
}

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
);

export const EmailComposer: React.FC<EmailComposerProps> = ({
  recipients,
  setRecipients,
  subject,
  setSubject,
  htmlBody,
  setHtmlBody,
  onSave,
  isTemplateSelected,
}) => {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isFileHelpModalOpen, setFileHelpModalOpen] = useState(false);
  const [showImgurLibrary, setShowImgurLibrary] = useState(false);
  const [sendingState, setSendingState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showImgurLibrary) {
      // Remove any existing Imgur embed script
      const existing = document.getElementById('imgur-embed-script');
      if (existing) existing.remove();
      // Inject the Imgur embed script
      const script = document.createElement('script');
      script.id = 'imgur-embed-script';
      script.src = '//s.imgur.com/min/embed.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, [showImgurLibrary]);

  const handleSendEmail = useCallback(async () => {
    if (!recipients || !subject || !htmlBody) {
      toast.error('Please fill in all fields before sending.', { centered: true });
      return;
    }
    setSendingState('sending');
    const toastId = toast.loading('Sending emails...', { centered: true });
    const recipientList = recipients.split(',').map(r => r.trim()).filter(Boolean);
    let successCount = 0;
    let errorCount = 0;
    for (const to of recipientList) {
      try {
        await sendEmail({ to, subject, html: htmlBody });
        successCount++;
      } catch (err) {
        errorCount++;
        console.error('Failed to send to', to, err);
      }
    }
    setSendingState('success');
    toast.dismiss(toastId);
    if (successCount > 0) {
      toast.success(`Sent to ${successCount} recipient${successCount > 1 ? 's' : ''}${errorCount > 0 ? `, ${errorCount} failed` : ''}.`, { centered: true });
    } else {
      toast.error('Failed to send emails.', { centered: true });
      setSendingState('error');
    }
    setTimeout(() => setSendingState('idle'), 3000);
  }, [recipients, subject, htmlBody]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (!content) {
        toast.error("Could not read file content.");
        return;
      }

      let emails: string[] = [];

      try {
        if (fileName.endsWith('.csv')) {
          const result = Papa.parse(content as string, {
            header: true,
            skipEmptyLines: true,
          });
          
          const data: any[] = result.data;

          if (data.length > 0) {
              const emailHeader = Object.keys(data[0]).find(h => h.toLowerCase().includes('email'));
              if (emailHeader) {
                emails = data.map(row => row[emailHeader]).filter(Boolean);
              } else {
                 emails = data.map(row => Object.values(row)[0] as string).filter(Boolean);
              }
          }

        } else if (fileName.endsWith('.xlsx')) {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if(data.length > 1) {
            const headerRow: string[] = data[0].map(String);
            let emailIndex = headerRow.findIndex(h => h.toLowerCase().includes('email'));
            if(emailIndex === -1) emailIndex = 0;

            emails = data.slice(1).map(row => row[emailIndex]).filter(Boolean);
          }
        } else {
          toast.error("Unsupported file type. Please use .csv or .xlsx");
          return;
        }

        if (emails.length > 0) {
          setRecipients(emails.join(', '));
          toast.success(`Successfully imported ${emails.length} emails.`);
        } else {
          toast.error("No valid emails found in the file.");
        }
      } catch (error) {
        console.error("File parsing error:", error);
        toast.error("Failed to parse the file.");
      }
    };
    
    if (fileName.endsWith('.csv')) {
       reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx')) {
        reader.readAsBinaryString(file);
    } else {
        toast.error("Unsupported file type. Please use .csv or .xlsx");
    }

    if(event.target) event.target.value = '';
  };

  const insertTextAtCursor = useCallback((textToInsert: string) => {
    const textarea = document.getElementById('html-body') as HTMLTextAreaElement;
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = textarea.value.substring(0, start);
        const textAfter = textarea.value.substring(end);
        const newValue = textBefore + textToInsert + textAfter;

        setHtmlBody(newValue);

        // Defer setting the cursor position until after React has re-rendered
        const newCursorPos = start + textToInsert.length;
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
            textarea.focus();
        }, 0);
    } else {
        // Fallback if textarea is not found for some reason
        setHtmlBody(prev => prev + '\n' + textToInsert);
    }
  }, [setHtmlBody]);

  const handleImageUploaded = useCallback((imageHtml: string) => {
    insertTextAtCursor(imageHtml);
  }, [insertTextAtCursor]);

  const handlePasteInEditor = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text/plain').trim();
    let imageUrl = pastedText;

    // Convert Imgur page URL to direct image URL
    const imgurMatch = imageUrl.match(/^https?:\/\/imgur\.com\/([a-zA-Z0-9]+)$/);
    if (imgurMatch) {
      imageUrl = `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }

    // If it's any URL, insert as image
    const urlRegex = /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/i;
    if (urlRegex.test(imageUrl)) {
      e.preventDefault();
      const imgTag = `<img src="${imageUrl}" alt="" style="max-width: 100%; height: auto; display: block;" />`;
      insertTextAtCursor(imgTag);
    }
    // Otherwise, let default paste happen
  }, [insertTextAtCursor]);


  return (
    <>
      <div className="p-4 bg-gray-900/20 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Compose Email</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPreviewModalOpen(true)}>
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="secondary" onClick={onSave} disabled={!isTemplateSelected}>Save Template</Button>
          <Button onClick={handleSendEmail} disabled={sendingState === 'sending'}>
            {sendingState === 'sending' ? 'Sending...' : sendingState === 'success' ? 'Sent!' : 'Send Email'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Recipients</CardTitle>
                        <CardDescription>Enter comma-separated emails or upload a file.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <UploadIcon className="h-4 w-4 mr-2" />
                            Upload File
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setFileHelpModalOpen(true)} aria-label="Show file upload help">
                           <InfoIcon className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea 
                    id="recipients"
                    placeholder="user1@example.com, user2@example.com"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    className="min-h-[80px] max-h-[200px] text-sm"
                />
                 <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".csv,.xlsx"
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Subject</CardTitle>
                <CardDescription>This will be the title of your email template.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input 
                    id="subject"
                    placeholder="Your awesome subject line"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </CardContent>
        </Card>
        
        <Separator />

        {/* Side-by-side layout for HTML editor and live preview */}
        <div className="flex flex-row gap-4 h-[1200px] w-full">
          <div className="w-1/2 min-w-0 flex flex-col">
            <Label htmlFor="html-body" className="text-lg font-semibold mb-2 block">HTML Editor</Label>
            <Button variant="outline" size="sm" onClick={() => setShowImgurLibrary(true)} className="mb-2 self-end">
                <ImageIcon className="h-4 w-4 mr-2" />
                Images
            </Button>
            {/* Imgur embed modal */}
            {showImgurLibrary && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowImgurLibrary(false)}>
                <div className="bg-gray-900/90 border border-white/10 rounded-lg shadow-2xl w-full max-w-md h-96 flex flex-col m-4 relative" onClick={e => e.stopPropagation()}>
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setShowImgurLibrary(false)} aria-label="Close">&times;</button>
                  <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
                    <div id="imgur-embed-container" className="w-full h-full">
                      <blockquote className="imgur-embed-pub" lang="en" data-id="a/EHArxOm">
                        <a href="//imgur.com/a/EHArxOm">HEX STUFF</a>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Textarea
              id="html-body"
              className="flex-1 font-mono text-sm"
              placeholder="<html>...</html>"
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              onPaste={handlePasteInEditor}
            />
          </div>
          <div className="w-1/2 min-w-0 flex flex-col border-l border-white/10 pl-4">
            <Label className="text-lg font-semibold mb-2 block">Live Preview</Label>
            <div className="flex-1 overflow-auto">
              <HtmlPreview htmlContent={htmlBody} />
            </div>
          </div>
        </div>
      </div>
      <EmailPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        recipients={recipients}
        subject={subject}
        htmlBody={htmlBody}
      />
      <FileUploadHelpModal
        isOpen={isFileHelpModalOpen}
        onClose={() => setFileHelpModalOpen(false)}
      />
    </>
  );
};