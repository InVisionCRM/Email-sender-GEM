import React from 'react';
import { Button } from './ui/Button';

interface HowToModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string | null;
}

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const Link = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-pink-400 underline hover:text-pink-300 transition-colors font-medium">{children}</a>;
const Code = ({ children }: { children: React.ReactNode }) => <code className="text-sm bg-gray-700/50 text-orange-300 py-0.5 px-1.5 rounded-md font-mono">{children}</code>;
const ContentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h3 className="font-semibold text-gray-100 mb-2 text-md">{title}</h3>
        <div className="text-gray-400 space-y-3">{children}</div>
    </div>
);

const modalContent: { [key: string]: { title: string; content: React.ReactNode } } = {
    buy_domain: {
        title: "How to Buy a Domain",
        content: (
            <ContentSection title="Where to Buy a Domain">
                <p>A custom domain name (e.g., <Code>yourcompany.com</Code>) is essential for sending professional emails. It builds trust and is required by services like Resend to authenticate your sending identity.</p>
                <p>You can purchase a domain from various registrars. Here are a few popular options:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><Link href="https://www.namescheap.com/">Namecheap</Link> - Known for competitive pricing and a user-friendly interface.</li>
                    <li><Link href="https://www.godaddy.com/">GoDaddy</Link> - One of the largest and most well-known domain registrars.</li>
                </ul>
            </ContentSection>
        )
    },
    setup_resend: {
        title: "How to Set Up Your Resend Account",
        content: (
            <ContentSection title="Creating Your Account">
                <p>Resend is the email delivery service this app is built to work with. Follow these steps to get started:</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Go to the <Link href="https://resend.com/signup">Resend Signup Page</Link>.</li>
                    <li>Fill in your details and create your account.</li>
                    <li>Verify your email address by clicking the link sent to your inbox.</li>
                    <li>Once logged in, you will be in your Resend dashboard, where you can add your domain and find your API key.</li>
                </ol>
            </ContentSection>
        )
    },
    add_dns: {
        title: "Add Resend DNS Records to Your Domain",
        content: (
            <ContentSection title="Authenticating Your Domain">
                <p>To send emails from your domain, you must prove to email providers that you own it. This is done by adding DNS records provided by Resend to your domain's settings.</p>
                <p>The primary records (like <Code>SPF</Code> and <Code>DKIM</Code>) handle authentication, ensuring your emails don't get marked as spam.</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>In your Resend dashboard, go to the "Domains" section and click "Add Domain".</li>
                    <li>Enter your domain name and Resend will provide you with a set of DNS records.</li>
                    <li>Log in to your domain registrar (e.g., Namecheap, GoDaddy) and navigate to the DNS management page for your domain.</li>
                    <li>Add the records provided by Resend exactly as they appear.</li>
                    <li>After adding them, go back to Resend and click "Verify". It may take some time for DNS changes to propagate.</li>
                </ol>
                <p>For detailed, provider-specific instructions, see Resend's official <Link href="https://resend.com/docs/dashboard/domains/introduction">Domain guide</Link>.</p>
            </ContentSection>
        )
    },
    season_email: {
        title: "How to Season Your Email (Email Warming)",
        content: (
            <ContentSection title="Building a Good Sender Reputation">
                <p>"Seasoning" or "warming up" your email domain is the process of gradually increasing the volume of emails you send. This builds a positive sending reputation with Internet Service Providers (ISPs) like Gmail and Outlook.</p>
                <p>A new domain sending thousands of emails at once looks suspicious and can get you blacklisted. Here’s how to do it right:</p>
                <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>Start by sending a small number of emails (e.g., 50-100 per day) to your most engaged recipients (people who are likely to open them).</li>
                    <li>Gradually increase your sending volume each day.</li>
                    <li>Monitor your open and bounce rates closely. If you see high bounce rates, slow down.</li>
                    <li>Ensure your content is valuable and you have proper unsubscribe links.</li>
                </ul>
            </ContentSection>
        )
    },
    create_with_ai: {
        title: "Create HTML Templates with AI",
        content: (
            <ContentSection title="Using AI (Gemini or ChatGPT) for Email Design">
                <p>AI can be a powerful tool for generating professional, responsive HTML email templates. The key is to write clear and descriptive prompts.</p>
                <p>Here are some tips to get great results:</p>
                 <ul className="list-disc list-inside mt-2 space-y-4 pl-2 text-gray-400">
                    <li>
                        <strong>Be Specific:</strong> Instead of "make an email," try "Create a product launch email for a new tech gadget. Use a dark theme with blue accents."
                    </li>
                    <li>
                        <strong>Request Inline CSS:</strong> Always specify that the AI must use inline CSS for all styling (e.g., <Code>{'<p style="color: blue;">'}</Code>). This is crucial for compatibility across different email clients. Do not use <Code>{'<style>'}</Code> tags.
                    </li>
                    <li>
                        <strong>Define Structure:</strong> Ask for specific elements like "a header with our logo, a main content area with a two-column layout, and a footer with social media links."
                    </li>
                    <li>
                        <strong>Example Prompt:</strong> <span className="block p-2 mt-1 bg-gray-800/50 rounded-md border border-white/10 font-mono text-pink-300 text-sm">"Generate a responsive HTML email template for a flash sale. The theme should be urgent and exciting, using red and black. All CSS must be inline. Include a large, centered 'Shop Now' button with a red background."</span>
                    </li>
                </ul>
            </ContentSection>
        )
    },
    add_images: {
        title: "How to Add Images to Email HTML",
        content: (
            <ContentSection title="Embedding Images Correctly">
                <p>Images in emails are not embedded in the file itself. Instead, they are loaded from a public web server. This means you must host your images online first.</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Upload your image to an image hosting service (like <Link href="https://imgur.com/upload">Imgur</Link>), a cloud storage provider (like AWS S3), or your own web server.</li>
                    <li>Get the public, direct URL for the image. It should end in <Code>.jpg</Code>, <Code>.png</Code>, or <Code>.gif</Code>.</li>
                    <li>In your HTML, use the <Code>{'<img>'}</Code> tag with the <Code>src</Code> attribute pointing to that URL.</li>
                </ol>
                <p>Example:</p>
                <pre className="mt-1 p-3 bg-gray-800/50 rounded-md text-sm text-gray-300 font-mono border border-white/10">
                    {'<img src="https://i.imgur.com/your-image-id.png" alt="Company Logo" width="150" style="display: block;">'}
                </pre>
            </ContentSection>
        )
    },
    know_limits: {
        title: "Knowing Your Sending Limits",
        content: (
            <ContentSection title="Resend Free Tier Limits">
                <p>This builder is designed for use with the Resend API. Their free plan is generous, but has the following limits:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 pl-2 text-gray-300">
                    <li><strong className="font-semibold text-white">100</strong> emails per day.</li>
                    <li><strong className="font-semibold text-white">3,000</strong> emails per month.</li>
                    <li><strong className="font-semibold text-white">1</strong> custom domain for sending.</li>
                </ul>
                 <p className="mt-4">
                    For more details or to upgrade your plan, visit the official <Link href="https://resend.com/pricing">Resend pricing page</Link>.
                 </p>
            </ContentSection>
        )
    },
};

export const HowToModal: React.FC<HowToModalProps> = ({ isOpen, onClose, topic }) => {
  if (!isOpen || !topic) return null;

  const currentContent = modalContent[topic] || { title: "Not Found", content: <p>Information for this topic could not be found.</p> };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl w-full max-w-3xl h-auto max-h-[90vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{currentContent.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <XIcon className="h-5 w-5" />
          </Button>
        </header>
        <div className="p-6 text-gray-300 space-y-6 overflow-y-auto">
          {currentContent.content}
        </div>
        <footer className="p-4 border-t border-white/10 flex-shrink-0 text-right">
             <Button onClick={onClose}>Got it, thanks!</Button>
        </footer>
      </div>
    </div>
  );
};
