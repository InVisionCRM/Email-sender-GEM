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

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
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

const CodeBlock = ({ children, language = "html" }: { children: string; language?: string }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-2 right-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    aria-label="Copy code"
                >
                    <CopyIcon className="h-4 w-4" />
                </Button>
            </div>
            <pre className="mt-1 p-4 bg-gray-800/50 rounded-md text-sm text-gray-300 font-mono border border-white/10 overflow-x-auto">
                <code>{children}</code>
            </pre>
        </div>
    );
};

const LivePreview = ({ htmlCode }: { htmlCode: string }) => {
    const [key, setKey] = React.useState(0);

    const handleRefresh = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-200">Live Preview</h4>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-xs text-gray-400 hover:text-white"
                >
                    ↻ Refresh
                </Button>
            </div>
            <div className="bg-white rounded-md border border-white/20 overflow-hidden">
                <iframe
                    key={key}
                    srcDoc={htmlCode}
                    className="w-full h-64 border-0"
                    title="HTML Preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
};

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
                <p>A new domain sending thousands of emails at once looks suspicious and can get you blacklisted. Here's how to do it right:</p>
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
    // HTML Tips
    countdown_timer: {
        title: "Countdown Timer",
        content: (
            <ContentSection title="Simple Countdown Timer">
                <p>Create a countdown timer that updates every second. Perfect for sales, events, or any time-sensitive content.</p>
                <CodeBlock>{`<div id="timer"></div>
<script>
  const end = new Date(Date.now() + 60000); // 1 min
  const timer = document.getElementById('timer');
  setInterval(() => {
    const now = new Date();
    const diff = Math.max(0, end - now);
    const sec = Math.floor(diff / 1000);
    timer.textContent = \`Countdown: \${sec}s\`;
  }, 1000);
</script>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #timer { font-size: 2rem; font-weight: bold; color: #f472b6; text-align: center; letter-spacing: 0.05em; }
    </style>
</head>
<body>
    <div class="preview-card">
      <div id="timer"></div>
    </div>
    <script>
        const end = new Date(Date.now() + 60000); // 1 min
        const timer = document.getElementById('timer');
        setInterval(() => {
            const now = new Date();
            const diff = Math.max(0, end - now);
            const sec = Math.floor(diff / 1000);
            timer.textContent = \`Countdown: \${sec}s\`;
        }, 1000);
    </script>
</body>
</html>`} />
            </ContentSection>
        )
    },
    tabs_interface: {
        title: "Tabs Interface",
        content: (
            <ContentSection title="Interactive Tabs">
                <p>Create a tabbed interface that switches between different content sections. Great for organizing information.</p>
                <CodeBlock>{`<style>
.tabs button { padding: 8px; margin: 2px; }
.tab-content { display: none; }
.tab-content.active { display: block; padding: 10px; border: 1px solid #ccc; }
</style>

<div class="tabs">
  <button onclick="showTab(0)">Tab 1</button>
  <button onclick="showTab(1)">Tab 2</button>
</div>

<div class="tab-content active">This is Tab 1 content</div>
<div class="tab-content">This is Tab 2 content</div>

<script>
  function showTab(i) {
    document.querySelectorAll('.tab-content').forEach((el, index) => {
      el.classList.toggle('active', index === i);
    });
  }
</script>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .tabs button { padding: 8px 16px; margin: 2px; border: 1px solid #a78bfa; background: #fff; color: #6d28d9; font-weight: 600; border-radius: 0.5rem; cursor: pointer; transition: background 0.2s; }
        .tabs button:hover { background: #f3e8ff; }
        .tab-content { display: none; padding: 15px; border: 1px solid #a78bfa; background: #fff; margin-top: 5px; border-radius: 0.5rem; color: #6d28d9; font-size: 1.1rem; }
        .tab-content.active { display: block; }
    </style>
</head>
<body>
    <div class="preview-card">
      <div class="tabs">
        <button onclick="showTab(0)">Tab 1</button>
        <button onclick="showTab(1)">Tab 2</button>
      </div>
      <div class="tab-content active">This is Tab 1 content with some sample text.</div>
      <div class="tab-content">This is Tab 2 content with different information.</div>
    </div>
    <script>
        function showTab(i) {
            document.querySelectorAll('.tab-content').forEach((el, index) => {
                el.classList.toggle('active', index === i);
            });
        }
    </script>
</body>
</html>`} />
            </ContentSection>
        )
    },
    accordion: {
        title: "Accordion",
        content: (
            <ContentSection title="Collapsible Accordion">
                <p>Create expandable/collapsible sections. Perfect for FAQs or organizing content into digestible chunks.</p>
                <CodeBlock>{`<style>
.accordion { cursor: pointer; padding: 10px; border: 1px solid #ccc; }
.panel { display: none; padding: 10px; border: 1px solid #ccc; }
</style>

<div class="accordion" onclick="this.nextElementSibling.style.display ^= 'block'">Click me</div>
<div class="panel">Accordion content here.</div>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .accordion { cursor: pointer; padding: 12px; border: 1px solid #a78bfa; background: #ede9fe; font-weight: bold; border-radius: 0.5rem; color: #6d28d9; margin-bottom: 0.5rem; transition: background 0.2s; }
        .accordion:hover { background: #f3e8ff; }
        .panel { display: none; padding: 15px; border: 1px solid #a78bfa; background: #fff; margin-top: 1px; border-radius: 0.5rem; color: #6d28d9; }
    </style>
</head>
<body>
    <div class="preview-card">
      <div class="accordion" onclick="this.nextElementSibling.style.display ^= 'block'">Click me to expand</div>
      <div class="panel">Accordion content here with some sample text.</div>
      <div class="accordion" onclick="this.nextElementSibling.style.display ^= 'block'">Another section</div>
      <div class="panel">More accordion content here.</div>
    </div>
</body>
</html>`} />
            </ContentSection>
        )
    },
    modal_popup: {
        title: "Modal Popup",
        content: (
            <ContentSection title="Modal Dialog">
                <p>Create a popup modal that appears over the current content. Great for forms, confirmations, or additional information.</p>
                <CodeBlock>{`<style>
#modal { display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
 background:white; padding:20px; border:1px solid #ccc; box-shadow:0 0 10px #000 }
</style>

<button onclick="modal.style.display='block'">Open Modal</button>
<div id="modal">
  <p>This is a modal!</p>
  <button onclick="modal.style.display='none'">Close</button>
</div>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        button { padding: 8px 16px; background: #a78bfa; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin-bottom: 1rem; transition: background 0.2s; }
        button:hover { background: #f472b6; }
        #modal { display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; border:1px solid #a78bfa; box-shadow:0 0 24px #6d28d9; border-radius: 1rem; color: #6d28d9; min-width: 220px; }
    </style>
</head>
<body>
    <div class="preview-card">
      <button onclick="modal.style.display='block'">Open Modal</button>
      <div id="modal">
        <p>This is a modal!</p>
        <button onclick="modal.style.display='none'">Close</button>
      </div>
    </div>
</body>
</html>`} />
            </ContentSection>
        )
    },
    image_slider: {
        title: "Image Slider",
        content: (
            <ContentSection title="Automatic Image Carousel">
                <p>Create an image slider that automatically cycles through images. Perfect for showcasing products or creating visual interest.</p>
                <CodeBlock>{`<style>
.slider img { display:none; width:100%; }
.slider img.active { display:block; }
</style>

<div class="slider">
  <img src="https://imgur.com/E6WnsTO.jpg" class="active">
  <img src="https://imgur.com/DRQHpCY.jpg">
  <img src="https://imgur.com/kKKqFrX.jpg">
</div>

<script>
let index = 0;
setInterval(() => {
  const imgs = document.querySelectorAll('.slider img');
  imgs.forEach(img => img.classList.remove('active'));
  imgs[index = (index + 1) % imgs.length].classList.add('active');
}, 2000);
</script>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .slider {
            width: 340px; height: 220px;
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 4px 24px 0 rgba(109,40,217,0.25);
            border: 2px solid #a78bfa;
            background: #18181b;
            margin-bottom: 1rem;
        }
        .slider img {
            display: none;
            width: 100%; height: 100%; object-fit: cover;
            transition: opacity 0.7s cubic-bezier(.4,0,.2,1);
        }
        .slider img.active {
            display: block;
            opacity: 1;
        }
        .caption {
            color: #f472b6;
            font-size: 1rem;
            margin-top: 0.5rem;
            letter-spacing: 0.03em;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="preview-card">
      <div class="slider">
        <img src="https://imgur.com/E6WnsTO.jpg" class="active" alt="Slide 1">
        <img src="https://imgur.com/DRQHpCY.jpg" alt="Slide 2">
        <img src="https://imgur.com/kKKqFrX.jpg" alt="Slide 3">
      </div>
      <div class="caption">Stunning image slider with gradient background</div>
    </div>
    <script>
        let index = 0;
        setInterval(() => {
            const imgs = document.querySelectorAll('.slider img');
            imgs.forEach(img => img.classList.remove('active'));
            imgs[index = (index + 1) % imgs.length].classList.add('active');
        }, 2000);
    </script>
</body>
</html>`} />
            </ContentSection>
        )
    },
    tooltip_hover: {
        title: "Tooltip on Hover",
        content: (
            <ContentSection title="CSS Tooltip">
                <p>Create tooltips that appear when hovering over elements. Uses pure CSS for smooth, lightweight tooltips.</p>
                <CodeBlock>{`<style>
.tooltip:hover::after {
  content: attr(data-tip);
  position: absolute;
  background: #333; color: #fff;
  padding: 4px 8px; border-radius: 4px;
  font-size: 12px; top: 100%; left: 0;
}
</style>

<span class="tooltip" data-tip="This is a tooltip">Hover me</span>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .tooltip { position: relative; display: inline-block; cursor: help; color: #a78bfa; text-decoration: underline; font-size: 1.2rem; }
        .tooltip:hover::after {
            content: attr(data-tip);
            position: absolute;
            background: #333; color: #fff;
            padding: 8px 12px; border-radius: 4px;
            font-size: 14px; top: 100%; left: 0; white-space: nowrap;
            z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="preview-card">
      <p>Try hovering over this element: <span class="tooltip" data-tip="This is a helpful tooltip">Hover me</span></p>
    </div>
</body>
</html>`} />
            </ContentSection>
        )
    },
    star_rating: {
        title: "Star Rating System",
        content: (
            <ContentSection title="Interactive Star Rating">
                <p>Create a clickable star rating system. Users can click to rate items, and the stars change color accordingly.</p>
                <CodeBlock>{`<div id="stars">
  <span onclick="rate(1)">★</span>
  <span onclick="rate(2)">★</span>
  <span onclick="rate(3)">★</span>
  <span onclick="rate(4)">★</span>
  <span onclick="rate(5)">★</span>
</div>

<script>
function rate(n) {
  document.querySelectorAll('#stars span').forEach((s, i) => {
    s.style.color = i < n ? 'gold' : 'gray';
  });
}
</script>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #stars { font-size: 2.2rem; cursor: pointer; color: #a78bfa; }
        #stars span { color: #ccc; transition: color 0.2s; }
        #stars span:hover, #stars span.active { color: gold; }
        .star-label { color: #f472b6; font-size: 1rem; margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <div class="preview-card">
      <div class="star-label">Click the stars to rate:</div>
      <div id="stars">
        <span onclick="rate(1)">★</span>
        <span onclick="rate(2)">★</span>
        <span onclick="rate(3)">★</span>
        <span onclick="rate(4)">★</span>
        <span onclick="rate(5)">★</span>
      </div>
    </div>
    <script>
        function rate(n) {
            document.querySelectorAll('#stars span').forEach((s, i) => {
                s.style.color = i < n ? 'gold' : '#ccc';
            });
        }
    </script>
</body>
</html>`} />
            </ContentSection>
        )
    },
    copy_clipboard: {
        title: "Copy to Clipboard",
        content: (
            <ContentSection title="Clipboard API">
                <p>Allow users to copy text to their clipboard with a single click. Uses the modern Clipboard API.</p>
                <CodeBlock>{`<input id="copyText" value="Copy me!" />
<button onclick="navigator.clipboard.writeText(copyText.value)">Copy</button>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        input { padding: 8px; border: 1px solid #a78bfa; border-radius: 0.5rem; margin-right: 8px; font-size: 1.1rem; }
        button { padding: 8px 16px; background: #a78bfa; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin-left: 0.5rem; transition: background 0.2s; }
        button:hover { background: #f472b6; }
        .success { color: #22c55e; font-weight: bold; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <div class="preview-card">
      <input id="copyText" value="Copy me!" />
      <button onclick="copyText()">Copy</button>
      <div id="message"></div>
    </div>
    <script>
        function copyText() {
            navigator.clipboard.writeText(document.getElementById('copyText').value)
                .then(() => {
                    document.getElementById('message').innerHTML = '<span class="success">Copied!</span>';
                    setTimeout(() => {
                        document.getElementById('message').innerHTML = '';
                    }, 2000);
                })
                .catch(err => {
                    document.getElementById('message').innerHTML = '<span style="color: red;">Failed to copy</span>';
                });
        }
    </script>
</body>
</html>`} />
            </ContentSection>
        )
    },
    show_hide_password: {
        title: "Show/Hide Password",
        content: (
            <ContentSection title="Password Toggle">
                <p>Create a password field with a toggle button to show or hide the password. Improves user experience for password entry.</p>
                <CodeBlock>{`<input type="password" id="pass" />
<button onclick="pass.type = pass.type === 'password' ? 'text' : 'password'">Toggle</button>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        input { padding: 8px; border: 1px solid #a78bfa; border-radius: 0.5rem; margin-right: 8px; font-size: 1.1rem; }
        button { padding: 8px 16px; background: #a78bfa; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin-left: 0.5rem; transition: background 0.2s; }
        button:hover { background: #f472b6; }
    </style>
</head>
<body>
    <div class="preview-card">
      <p>Password field:</p>
      <input type="password" id="pass" value="secret123" />
      <button onclick="togglePassword()">Toggle</button>
    </div>
    <script>
        function togglePassword() {
            const pass = document.getElementById('pass');
            pass.type = pass.type === 'password' ? 'text' : 'password';
        }
    </script>
</body>
</html>`} />
            </ContentSection>
        )
    },
    progress_bar: {
        title: "Progress Bar Animation",
        content: (
            <ContentSection title="Animated Progress">
                <p>Create an animated progress bar that fills up over time. Great for showing loading states or completion progress.</p>
                <CodeBlock>{`<progress id="bar" max="100" value="0"></progress>
<script>
let val = 0;
const bar = document.getElementById('bar');
setInterval(() => { if (val < 100) bar.value = ++val; }, 100);
</script>`}</CodeBlock>
                <LivePreview htmlCode={`<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 0; margin: 0;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
        }
        .preview-card {
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border-radius: 1.5rem;
            overflow: hidden;
            border: 1.5px solid rgba(255,255,255,0.08);
            background: linear-gradient(135deg, #111827 0%, #1e293b 50%, #6d28d9 100%);
            padding: 2rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        progress { width: 100%; height: 24px; border-radius: 0.5rem; background: #ede9fe; }
        button { padding: 8px 16px; background: #a78bfa; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; margin-top: 1rem; transition: background 0.2s; }
        button:hover { background: #f472b6; }
    </style>
</head>
<body>
    <div class="preview-card">
      <p style="color:#f472b6;font-size:1rem;margin-bottom:0.5rem;">Progress bar:</p>
      <progress id="bar" max="100" value="0"></progress>
      <button onclick="startProgress()">Start Progress</button>
    </div>
    <script>
        let val = 0;
        let interval;
        function startProgress() {
            val = 0;
            const bar = document.getElementById('bar');
            bar.value = 0;
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                if (val < 100) {
                    bar.value = ++val;
                } else {
                    clearInterval(interval);
                }
            }, 100);
        }
    </script>
</body>
</html>`} />
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
