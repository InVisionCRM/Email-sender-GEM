import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EmailComposer } from './components/EmailComposer';
import { HowToModal } from './components/HowToModal';
import { IntroModal } from './components/IntroModal';
import { EmailTemplate } from './types';
import { INITIAL_TEMPLATES } from './constants';
import { toast } from './components/ui/Toaster';
import { Button } from './components/ui/Button';

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
  
  const activeTemplate = templates.find(t => t.id === activeTemplateId) || null;

  const [recipients, setRecipients] = useState<string>('test1@example.com, test2@example.com');
  const [subject, setSubject] = useState<string>(activeTemplate?.name || '');
  const [htmlBody, setHtmlBody] = useState<string>(activeTemplate?.content || '');
  
  useEffect(() => {
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
      setSubject(selected.name);
      setHtmlBody(selected.content);
      toast.info(`Template "${selected.name}" loaded.`);
    }
  }, [templates]);

  const handleSaveTemplate = useCallback(() => {
    if (!activeTemplateId) return;
    setTemplates(prev => prev.map(t => 
      t.id === activeTemplateId ? { ...t, name: subject, content: htmlBody } : t
    ));
    toast.success(`Template "${subject}" saved.`);
  }, [activeTemplateId, subject, htmlBody]);

  const handleCreateNewTemplate = useCallback(() => {
    const newId = `temp_${Date.now()}`;
    const newTemplate: EmailTemplate = {
      id: newId,
      name: 'Untitled Template',
      content: '<h1>New Email Template</h1><p>Start editing here!</p>',
    };
    setTemplates(prev => [...prev, newTemplate]);
    setActiveTemplateId(newId);
    setSubject(newTemplate.name);
    setHtmlBody(newTemplate.content);
    toast.info('New template created.');
  }, []);
  
  const handleDeleteTemplate = useCallback((templateId: string) => {
    const toDelete = templates.find(t => t.id === templateId);
    if (!toDelete) return;

    const remainingTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(remainingTemplates);
    toast.error(`Template "${toDelete.name}" deleted.`);

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
            subject={subject}
            setSubject={setSubject}
            htmlBody={htmlBody}
            setHtmlBody={setHtmlBody}
            onSave={handleSaveTemplate}
            isTemplateSelected={!!activeTemplateId}
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
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center sm:text-left">
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
                <Button variant="link" className="text-gray-400 p-0 h-auto justify-center sm:justify-start" onClick={handleOpenIntro}>Open Guide</Button>
            </FooterCategory>
        </div>
      </footer>
    </div>
  );
}

export default App;
