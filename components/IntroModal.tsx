import React from 'react';
import { Button } from './ui/Button';

// Reusable components for consistent styling
const Link = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-pink-400 underline hover:text-pink-300 transition-colors font-medium">{children}</a>;
const Code = ({ children }: { children: React.ReactNode }) => <code className="text-sm bg-gray-700/50 text-orange-300 py-0.5 px-1.5 rounded-md font-mono">{children}</code>;

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const Step = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white shadow-md">
            {number}
        </div>
        <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-gray-100 text-md">{title}</h3>
            <div className="text-gray-400 text-sm space-y-3">
                {children}
            </div>
        </div>
    </div>
);


export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Welcome to the Email Campaign Builder!</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <XIcon className="h-5 w-5" />
          </Button>
        </header>

        <div className="p-6 text-gray-300 space-y-6 overflow-y-auto">
            <div>
                <h3 className="font-semibold text-gray-100 text-md mb-2">How It Works</h3>
                <p className="text-sm text-gray-400">
                    This is a powerful frontend tool for crafting, previewing, and managing HTML emails. It currently <strong>simulates</strong> sending emails to let you focus on design. To build a fully-functional app that sends real emails and uses AI, you'll need to follow the setup guide below.
                </p>
            </div>

            <div className="space-y-6">
                <Step number={1} title="Get a Domain">
                    <p>To send professional emails, you need a custom domain (e.g., <Code>yourcompany.com</Code>). This builds brand identity and is required by email services like Resend.</p>
                    <p>You can buy one from a registrar like <Link href="https://namescheap.com">Namecheap</Link> or <Link href="https://godaddy.com">GoDaddy</Link>.</p>
                </Step>

                <Step number={2} title="Set Up Resend">
                    <p>This app is designed to work with the <Link href="https://resend.com">Resend</Link> API for email delivery.</p>
                    <ol className="list-decimal list-inside space-y-1 pl-2">
                        <li>Create a free account on <Link href="https://resend.com/signup">Resend</Link>.</li>
                        <li>In your Resend dashboard, go to the "Domains" section and add the domain you purchased.</li>
                        <li>Resend will give you a list of DNS records you'll need for the next step.</li>
                    </ol>
                </Step>

                <Step number={3} title="Configure Your DNS">
                    <p>To prove you own the domain and authorize Resend to send emails on your behalf, you must add the DNS records from Resend to your domain registrar's settings. These records (like SPF and DKIM) are critical for deliverability and preventing your emails from being marked as spam.</p>
                    <p>For detailed instructions, see Resend's <Link href="https://resend.com/docs/dashboard/domains/introduction">official domain guide</Link>.</p>
                </Step>

                <Step number={4} title="Set Up Your API Keys">
                     <p>To connect the application to services like Resend or AI models (like Gemini), you need to provide API keys. For local development, this is typically done using an environment file.</p>
                     <p>Create a file named <Code>.env.local</Code> in the root folder of this project. Then, add your secret keys to it like this:</p>
                    <pre className="mt-2 p-3 bg-gray-800/50 rounded-md text-sm text-gray-300 font-mono border border-white/10">
                        <code>
                            # Get this from your Resend dashboard under API Keys{"\n"}
                            RESEND_API_KEY=re_xxxxxxxxxxxxxxxx{"\n"}
                            {"\n"}
                            # A "from" address using your verified domain{"\n"}
                            RESEND_FROM_EMAIL=you@yourdomain.com{"\n"}
                            {"\n"}
                            # Optional: For AI features, get a key from Google AI Studio{"\n"}
                            # API_KEY=gsk_xxxxxxxxxxxxxxxx
                        </code>
                    </pre>
                    <p className="mt-2 text-xs italic text-gray-500">Note: A development server (like Vite or Next.js) is required to load these variables into the application. The current setup simulates API calls and does not use these keys directly.</p>
                </Step>
            </div>
        </div>

        <footer className="p-4 border-t border-white/10 flex-shrink-0 text-right">
             <Button onClick={onClose}>Get Started</Button>
        </footer>
      </div>
    </div>
  );
};
