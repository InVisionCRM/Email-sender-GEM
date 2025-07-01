import React from 'react';
import { EmailTemplate } from '../types';
import { Button } from './ui/Button';
import { Separator } from './ui/Separator';

interface SidebarProps {
  templates: EmailTemplate[];
  activeTemplateId: string | null;
  onSelectTemplate: (id: string) => void;
  onCreateNew: () => void;
  onDeleteTemplate: (id: string) => void;
  onSelectHowToTopic: (topic: string) => void;
  onOpenIntro: () => void;
}

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const FilePlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" x2="12" y1="18" y2="12" />
        <line x1="9" x2="15" y1="15" y2="15" />
    </svg>
);

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
);

const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.33-.04-3.1-.74-.77-2.26-.79-3.1-.04Z"/>
        <path d="m13.5 18.5-2-2"/>
        <path d="m21.5 2.5-1.9 2.5-3.3 1.4A2.5 2.5 0 0 0 14 8l-4.4 4.4 1.4 3.3L14 21.5l2.5-1.9 5-6.5Z"/>
    </svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ templates, activeTemplateId, onSelectTemplate, onCreateNew, onDeleteTemplate, onSelectHowToTopic, onOpenIntro }) => {
  return (
    <aside className="w-72 flex-shrink-0 bg-gray-900/30 backdrop-blur-lg border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Resend</h1>
        <p className="text-sm text-gray-400">Email Campaign Builder</p>
      </div>
      <div className="p-4 space-y-2">
        <Button onClick={onCreateNew} className="w-full" variant="outline">
            <FilePlusIcon className="h-4 w-4 mr-2" />
            New Template
        </Button>
        <Button onClick={onOpenIntro} className="w-full" variant="secondary">
            <RocketIcon className="h-4 w-4 mr-2" />
            Quick Start Guide
        </Button>
      </div>
      <nav className="px-4 overflow-y-auto">
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-gray-200">
          HTML Templates
        </h2>
        <ul className="space-y-1">
          {templates.map((template) => (
            <li key={template.id}>
              <button
                onClick={() => onSelectTemplate(template.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex justify-between items-center group ${
                  activeTemplateId === template.id
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white font-semibold shadow-inner'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <span className="truncate">{template.name}</span>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTemplate(template.id);
                    }}
                    className="p-1 rounded-md text-gray-500 hover:text-pink-500 hover:bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete template"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4">
        <Separator className="my-2 bg-white/5"/>
      </div>
      <nav className="flex-1 px-4 overflow-y-auto pb-4">
         <h2 className="mb-2 text-lg font-semibold tracking-tight text-gray-200 flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5 text-purple-400" />
            How-To Topics
        </h2>
        <p className="text-xs text-gray-500 mb-2 px-3">Quick guides on specific topics.</p>
        <ul className="space-y-1 text-sm">
            {[
                { key: 'buy_domain', label: 'Buy a Domain' },
                { key: 'setup_resend', label: 'Set up Resend' },
                { key: 'add_dns', label: 'Add Resend DNS' },
                { key: 'season_email', label: 'Season Your Email' },
                { key: 'create_with_ai', label: 'Create HTML with AI' },
                { key: 'add_images', label: 'Add Images to HTML' },
                { key: 'know_limits', label: 'Knowing Your Limits' },
            ].map(item => (
                 <li key={item.key}>
                    <button 
                        onClick={() => onSelectHowToTopic(item.key)}
                        className="w-full text-left px-3 py-1.5 rounded-md text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-colors"
                    >
                        {item.label}
                    </button>
                </li>
            ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10 mt-auto">
        <p className="text-xs text-gray-500">Powered by React & Resend</p>
      </div>
    </aside>
  );
};
