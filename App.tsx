import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EmailComposer } from './components/EmailComposer';
import { HowToModal } from './components/HowToModal';
import { IntroModal } from './components/IntroModal';
import { EmailTemplate } from './types';
import { INITIAL_TEMPLATES } from './constants';
import { toast } from './components/ui/Toaster';
import { Button } from './components/ui/Button';
import { loadTemplates, saveTemplates, getStorageInfo } from './services/templateService';

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors duration-200 text-sm">{children}</a>
);

const FooterCategory = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col items-center sm:items-start gap-y-2">
        <h4 className="font-semibold text-gray-200 text-md">{title}</h4>
        <div className="flex flex-col items-center sm:items-start gap-y-2">
            {children}
        </div>
    </div>
);


function App() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(INITIAL_TEMPLATES[0]?.id || null);
  const [howToTopic, setHowToTopic] = useState<string | null>(null);
  const [isIntroModalOpen, setIntroModalOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());
  
  const activeTemplate = templates.find(t => t.id === activeTemplateId) || null;

  const [recipients, setRecipients] = useState<string>('test1@example.com, test2@example.com');
  const [name, setName] = useState<string>(activeTemplate?.name || '');
  const [subject, setSubject] = useState<string>(activeTemplate?.name || '');
  const [htmlBody, setHtmlBody] = useState<string>(activeTemplate?.content || '');
  
  useEffect(() => {
    // Load templates using the template service
    async function fetchTemplates() {
      try {
        const templates = await loadTemplates();
        if (templates.length > 0) {
          // Ensure all templates have a subject field for backward compatibility
          const normalizedTemplates = templates.map(template => ({
            ...template,
            subject: template.subject || template.name || 'Untitled'
          }));
          setTemplates(normalizedTemplates);
          setActiveTemplateId(normalizedTemplates[0]?.id || null);
        } else {
          // Use initial templates if no stored templates found
          setTemplates(INITIAL_TEMPLATES);
          setActiveTemplateId(INITIAL_TEMPLATES[0]?.id || null);
        }
        
        // Log storage info
        const currentStorageInfo = getStorageInfo();
        setStorageInfo(currentStorageInfo);
        console.log('Using storage:', currentStorageInfo);
      } catch (err: any) {
        console.error('Load templates error:', err);
        toast.error('Failed to load templates from storage.');
        // Fallback to initial templates
        setTemplates(INITIAL_TEMPLATES);
        setActiveTemplateId(INITIAL_TEMPLATES[0]?.id || null);
      }
    }
    fetchTemplates();
    const hasSeenIntro = localStorage.getItem('hasSeenResendIntro');
    if (!hasSeenIntro) {
        setIntroModalOpen(true);
    }
  }, []);

  const handleCloseIntro = () => {
    setIntroModalOpen(false);
    localStorage.setItem('hasSeenResendIntro', 'true');
  };
  
  const handleOpenIntro = useCallback(() => {
    setIntroModalOpen(true);
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    const selected = templates.find(t => t.id === templateId);
    if (selected) {
      setActiveTemplateId(selected.id);
      setName(selected.name);
      setSubject(selected.subject || selected.name); // Use saved subject or fallback to name
      setHtmlBody(selected.content);
      console.log('Template loaded:', { name: selected.name, subject: selected.subject, id: selected.id });
      toast.info(`Template "${selected.name}" loaded.`);
    }
  }, [templates]);

  const handleSaveTemplate = useCallback(async (templateName: string) => {
    console.log('Saving template:', { templateName, subject, activeTemplateId, hasActiveTemplate: !!activeTemplateId });
    
    let updatedTemplates: EmailTemplate[];
    
    if (activeTemplateId) {
      // Update existing template
      console.log('Updating existing template:', activeTemplateId);
      updatedTemplates = templates.map(t =>
        t.id === activeTemplateId ? { ...t, name: templateName, subject, content: htmlBody } : t
      );
    } else {
      // Create new template
      console.log('Creating new template');
      const newTemplate: EmailTemplate = {
        id: `temp_${Date.now()}`,
        name: templateName,
        subject,
        content: htmlBody,
      };
      updatedTemplates = [...templates, newTemplate];
      setActiveTemplateId(newTemplate.id);
      console.log('New template created with ID:', newTemplate.id);
    }
    
    setTemplates(updatedTemplates);
    setName(templateName);
    try {
      await saveTemplates(updatedTemplates);
      console.log('Templates saved successfully, total count:', updatedTemplates.length);
    } catch (err: any) {
      console.error('Save error:', err);
      throw new Error(`Failed to save templates: ${err.message}`);
    }
  }, [activeTemplateId, htmlBody, subject, templates, setName]);

  const handleCreateNewTemplate = useCallback(() => {
    // Clear current template selection to allow creating a new one
    setActiveTemplateId(null);
    setName('');
    setSubject('New Email Subject');
    setHtmlBody('<h1>New Email Template</h1><p>Start editing here!</p>');
    toast.info('Ready to create new template. Use "Save as Template" to save it.');
  }, []);
  
  const handleDeleteTemplate = useCallback(async (templateId: string) => {
    const toDelete = templates.find(t => t.id === templateId);
    if (!toDelete) return;

    const remainingTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(remainingTemplates);
    
    try {
      await saveTemplates(remainingTemplates);
      toast.error(`Template "${toDelete.name}" deleted.`);
    } catch (err) {
      console.error('Error saving after delete:', err);
      toast.error('Failed to save changes after deletion.');
    }

    if (activeTemplateId === templateId) {
      const nextTemplate = remainingTemplates[0] || null;
      if (nextTemplate) {
         handleSelectTemplate(nextTemplate.id);
      } else {
         setActiveTemplateId(null);
         setSubject('');
         setHtmlBody('');
      }
    }
  }, [templates, activeTemplateId, handleSelectTemplate]);

  const handleSelectHowToTopic = useCallback((topic: string) => {
    setHowToTopic(topic);
  }, []);


  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 text-gray-200 font-sans">
      <div className="flex flex-1 min-h-0">
        <Sidebar 
          templates={templates}
          activeTemplateId={activeTemplateId}
          onSelectTemplate={handleSelectTemplate}
          onCreateNew={handleCreateNewTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onSelectHowToTopic={handleSelectHowToTopic}
          onOpenIntro={handleOpenIntro}
        />
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <EmailComposer
            recipients={recipients}
            setRecipients={setRecipients}
            name={name}
            setName={setName}
            subject={subject}
            setSubject={setSubject}
            htmlBody={htmlBody}
            setHtmlBody={setHtmlBody}
            onSave={handleSaveTemplate}
            isTemplateSelected={!!activeTemplateId}
            storageInfo={storageInfo}
          />
        </main>
      </div>
      <HowToModal
        isOpen={!!howToTopic}
        topic={howToTopic}
        onClose={() => setHowToTopic(null)}
      />
       <IntroModal 
        isOpen={isIntroModalOpen}
        onClose={handleCloseIntro}
      />
       <footer className="w-full p-4 pb-8 border-t border-white/10 text-xs text-gray-500 shrink-0 bg-gray-900/20">
        <div className="max-w-7xl mx-auto grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            <FooterCategory title="Domains">
                <FooterLink href="https://namescheap.com">Namecheap</FooterLink>
                <FooterLink href="https://godaddy.com">GoDaddy</FooterLink>
            </FooterCategory>
            <FooterCategory title="Email Senders">
                <FooterLink href="https://resend.com">Resend</FooterLink>
            </FooterCategory>
             <FooterCategory title="AI LLMs">
                <FooterLink href="https://openai.com">OpenAI</FooterLink>
                 <FooterLink href="https://claude.ai">Claude</FooterLink>
                 <FooterLink href="https://ai.google.dev/">Gemini</FooterLink>
            </FooterCategory>
            <FooterCategory title="AI Coding Agents">
                <FooterLink href="https://v0.dev">v0.dev</FooterLink>
                <FooterLink href="https://cursor.sh">Cursor</FooterLink>
                <FooterLink href="https://windsurf.ai">Windsurf</FooterLink>
            </FooterCategory>
            <FooterCategory title="How To">
                <Button variant="link" className="text-gray-400 p-0 h-auto justify-center md:justify-start" onClick={handleOpenIntro}>Open Guide</Button>
            </FooterCategory>
        </div>
      </footer>
    </div>
  );
}

export default App;
