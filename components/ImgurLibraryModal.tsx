import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Button } from './ui/Button';
import { toast } from './ui/Toaster';
import { Input } from './ui/Input';
import { Label } from './ui/Label';

// This is a public, anonymous client ID for Imgur, suitable for demo/non-commercial apps.
// For a production application, it's recommended to register your own at: https://api.imgur.com/oauth2/addclient
const IMGUR_CLIENT_ID = 'd3108c5c162f138';

interface ImgurLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (imageHtml: string) => void;
}

type ModalView = 'upload' | 'adjust';
type Alignment = 'left' | 'center' | 'right';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M12 12v9"/>
        <path d="m16 16-4-4-4 4"/>
    </svg>
);


export const ImgurLibraryModal: React.FC<ImgurLibraryModalProps> = ({ isOpen, onClose, onImageUploaded }) => {
  const [view, setView] = useState<ModalView>('upload');
  
  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adjust State
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [imageWidth, setImageWidth] = useState('100%');
  const [imageAlignment, setImageAlignment] = useState<Alignment>('center');

  // --- Resizing Logic ---
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const resizeStartRef = useRef<{ startX: number; startWidth: number; } | null>(null);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageRef.current) return;

    resizeStartRef.current = {
        startX: e.clientX,
        startWidth: imageRef.current.offsetWidth,
    };
    setIsResizing(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!resizeStartRef.current || !imageRef.current) return;

        const dx = e.clientX - resizeStartRef.current.startX;
        const newWidth = resizeStartRef.current.startWidth + dx;
        
        const containerWidth = imageRef.current.parentElement?.parentElement?.offsetWidth ?? 500;
        const clampedWidth = Math.max(50, Math.min(newWidth, containerWidth));

        setImageWidth(`${Math.round(clampedWidth)}px`);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'nwse-resize';
        document.body.style.userSelect = 'none';
    }

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };
  }, [isResizing, setImageWidth]);

  // --- End Resizing Logic ---

  const handleClose = useCallback(() => {
    setView('upload');
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsUploading(false);
    setUploadedImageUrl(null);
    setAltText('');
    setImageWidth('100%');
    setImageAlignment('center');
    if (isResizing) setIsResizing(false);
    onClose();
  }, [onClose, isResizing]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error('Please select a valid image file.');
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading image...');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
        body: formData,
      });

      const data = await response.json();
      toast.dismiss(toastId);

      if (data.success) {
        toast.success('Upload complete! Now adjust your image.');
        setUploadedImageUrl(data.data.link);
        const fileName = selectedFile.name.split('.').slice(0, -1).join(' ');
        setAltText(fileName || 'Uploaded image');
        setView('adjust');
      } else {
        toast.error(data.data.error?.message || data.data.error || 'Failed to upload image.');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('An unexpected error occurred during upload.');
      console.error('Imgur upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile]);

  const generatedHtml = useMemo(() => {
    if (!uploadedImageUrl) return '';
    const imageStyle = `width: ${imageWidth}; max-width: 100%; height: auto;`;
    const imgTag = `<img src="${uploadedImageUrl}" alt="${altText}" style="${imageStyle}" />`;
    // For reliable email client rendering, wrap in a div with text-align.
    return `<div style="text-align: ${imageAlignment};">${imgTag}</div>`;
  }, [uploadedImageUrl, altText, imageWidth, imageAlignment]);

  const handleInsert = useCallback(() => {
    onImageUploaded(generatedHtml);
    toast.success('Image added to editor!');
    handleClose();
  }, [onImageUploaded, generatedHtml, handleClose]);

  if (!isOpen) return null;

  const renderUploadView = () => (
    <>
      <div className="p-6 text-gray-300 space-y-6 overflow-y-auto">
          <div 
            className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            ) : (
              <>
                <UploadCloudIcon className="h-12 w-12 text-gray-500" />
                <p className="mt-2 text-gray-400">
                  <span className="font-semibold text-purple-300">Click to browse</span> or drag & drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/gif, image/webp"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <div className="text-center text-sm text-gray-300">
              Selected file: <span className="font-medium text-white">{selectedFile.name}</span>
            </div>
          )}
      </div>
      <footer className="p-4 border-t border-white/10 flex-shrink-0 flex justify-end items-center gap-4">
            <p className="text-xs text-gray-500 mr-auto">Images are uploaded anonymously to Imgur.</p>
             <Button variant="secondary" onClick={handleClose}>Cancel</Button>
             <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload & Adjust'}
             </Button>
      </footer>
    </>
  );

  const renderAdjustView = () => {
    const alignmentClasses: Record<Alignment, string> = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };

    return (
    <>
       <div className="p-6 text-gray-300 space-y-6 overflow-y-auto">
        <div className="p-4 bg-gray-800/50 rounded-md border border-white/10">
          <p className="text-sm text-gray-400 mb-2 font-medium">Live Preview (Drag corner to resize)</p>
          <div className={`bg-white/5 p-2 rounded min-h-[100px] flex items-center overflow-hidden ${alignmentClasses[imageAlignment]}`}>
            <div className="relative">
              {uploadedImageUrl && (
                <img 
                  ref={imageRef}
                  src={uploadedImageUrl} 
                  alt={altText} 
                  style={{ 
                    width: imageWidth, 
                    maxWidth: '100%', 
                    height: 'auto', 
                    display: 'block',
                    pointerEvents: isResizing ? 'none' : 'auto',
                  }} 
                />
              )}
              <div 
                onMouseDown={handleResizeMouseDown}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 border-2 border-gray-900 rounded-full cursor-nwse-resize hover:scale-125 transition-transform"
                title="Drag to resize"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
            <div>
                <Label htmlFor="alt-text" className="text-gray-400">Alt Text (for accessibility)</Label>
                <Input id="alt-text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="Describe the image" className="mt-1" />
            </div>

            <div>
                <Label htmlFor="img-width" className="text-gray-400">Image Width</Label>
                <Input id="img-width" value={imageWidth} onChange={e => setImageWidth(e.target.value)} placeholder="e.g., 100% or 300px" className="mt-1"/>
                <div className="flex flex-wrap gap-2 mt-2">
                    {['50%', '100%', '150px', '300px', '500px'].map(w => (
                        <Button key={w} variant={imageWidth === w ? 'secondary' : 'outline'} size="sm" onClick={() => setImageWidth(w)}>{w}</Button>
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-gray-400">Placement (Reliable for email clients)</Label>
                <div className="flex gap-2 mt-1">
                    <Button variant={imageAlignment === 'left' ? 'secondary' : 'ghost'} onClick={() => setImageAlignment('left')}>Left</Button>
                    <Button variant={imageAlignment === 'center' ? 'secondary' : 'ghost'} onClick={() => setImageAlignment('center')}>Center</Button>
                    <Button variant={imageAlignment === 'right' ? 'secondary' : 'ghost'} onClick={() => setImageAlignment('right')}>Right</Button>
                </div>
            </div>
        </div>
      </div>
      <footer className="p-4 border-t border-white/10 flex-shrink-0 flex justify-end items-center gap-4">
             <Button variant="secondary" onClick={handleClose}>Cancel</Button>
             <Button onClick={handleInsert}>Insert Image</Button>
      </footer>
    </>
  )};

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
    >
      <div 
        className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {view === 'upload' ? 'Upload Image to Imgur' : 'Adjust & Place Image'}
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
            <XIcon className="h-5 w-5" />
          </Button>
        </header>
        {view === 'upload' ? renderUploadView() : renderAdjustView()}
      </div>
    </div>
  );
};