# Resend Email Campaign Builder

This is a powerful, frontend-focused application for creating, previewing, and managing HTML email templates. It's designed to streamline the email campaign workflow, with a modern user interface and helpful in-app guides. The application simulates the email sending process, allowing developers and designers to focus on crafting the perfect email content. For full functionality, it can be connected to the Resend API for email delivery and the Gemini API for AI-powered content generation.

![App Screenshot](https://i.imgur.com/your-screenshot.png) <!-- It's recommended to add a real screenshot here -->

## ✨ Features

- **Template Management**: Create, save, and delete multiple email templates.
- **Rich Email Composer**: Edit recipients, subject lines, and the HTML body.
- **Live HTML Preview**: See a real-time, sandboxed preview of your email as you type.
- **Recipient List Upload**: Import recipients from `.csv` or `.xlsx` files.
- **Image Upload & Adjustment**: Upload images to Imgur, then visually adjust their alt text, size (with interactive resizing), and alignment before inserting them into your email.
- **Paste Image URLs**: Automatically converts a pasted image URL into a responsive `<img>` tag.
-**In-App Guides**:
  - **Quick Start Guide**: A welcoming modal for first-time users explaining how to set up the project for real-world use.
  - **How-To Topics**: Quick guides on specific topics like buying a domain, setting up Resend, and using AI for HTML generation.
- **Modern UI/UX**: Built with Tailwind CSS for a sleek, responsive, and intuitive user experience.

## 🛠️ Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs (for local setup)**:
  - **Resend API**: For sending emails.
  - **Gemini API**: For AI-powered features (e.g., template generation).
  - **Imgur API**: For anonymous image hosting.
- **File Parsing**: PapaParse (CSV), XLSX (Excel).

## 🚀 Getting Started: Local Setup

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Set up Environment Variables:**

    This is the most important step to unlock the full functionality of the app. Create a new file in the root of your project directory called `.env.local`.

    Copy the contents of `.env.example` (or the block below) into your new `.env.local` file and fill in the values with your own secret keys.

    ```env
    # Get this from your Resend dashboard under the "API Keys" section.
    # Required for sending actual emails.
    RESEND_API_KEY=re_xxxxxxxxxxxxxxxx

    # This must be an email address from a domain you have verified in Resend.
    RESEND_FROM_EMAIL=you@yourverifieddomain.com

    # Optional: For AI features. Get a key from Google AI Studio.
    # This key will be used for Gemini API calls.
    API_KEY=gsk_xxxxxxxxxxxxxxxx
    ```
    > **Note:** The development server (like Vite or Next.js) will automatically load these variables. The live version you interact with here simulates these features, but they will work once you run the project locally with your keys.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 📁 Project Structure

The project is organized to be clean and maintainable.

```
/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── ui/           # Generic, reusable UI primitives (Button, Card, etc.)
│   │   ├── App.tsx       # Main application component with state management
│   │   ├── EmailComposer.tsx # The core email editing interface
│   │   ├── ImgurLibraryModal.tsx # Handles image upload and adjustment
│   │   └── ...           # Other components
│   ├── services/         # API clients (e.g., geminiService.ts)
│   ├── types.ts          # Core TypeScript type definitions
│   ├── constants.ts      # Initial data and constants
│   ├── index.css         # Global styles
│   └── index.tsx         # Application entry point
├── .env.local            # Your local environment variables (you create this)
├── index.html            # Main HTML entry file
├── package.json          # Project dependencies and scripts
└── README.md             # You are here!
```

## Usage Guide

1.  **Select a Template**: Choose a pre-built template from the left sidebar or click "New Template" to start from scratch.
2.  **Compose**:
    - Add recipients in the "Recipients" field manually, or click "Upload File" to import from a `.csv` or `.xlsx` file.
    - Edit the email's `Subject`.
    - Write your email content in the `HTML Editor`.
3.  **Add Images**:
    - Click "Upload Image".
    - Select an image from your computer.
    - After it uploads to Imgur, adjust the alt text, width (drag the corner!), and alignment.
    - Click "Insert Image" to add the generated HTML to your editor.
4.  **Preview**: Use the "Live Preview" panel on the right to see how your email looks. Click the "Preview" button in the header for a full-modal preview.
5.  **Save**: Click "Save Template" to save your changes to the currently selected template.
6.  **(Local Only) Send**: Click "Send Email" to simulate sending. If you've set up your `.env.local` file correctly, this is where you would integrate the Resend API call.
