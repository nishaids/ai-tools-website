import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Career Tools - Transform Your Career with AI-Powered Tools',
  description: 'Free AI-powered resume builder, cover letter generator, and career tools. Create professional documents in seconds. No signup required. Powered by Gemini AI.',
  keywords: 'AI resume builder, free resume maker, cover letter generator, AI career tools, job application, ATS resume, professional resume',
  authors: [{ name: 'AI Career Tools' }],
  openGraph: {
    title: 'AI Career Tools - Transform Your Career with AI-Powered Tools',
    description: 'Free AI-powered resume builder and career tools. Create professional documents in seconds.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Career Tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Career Tools - Free AI-Powered Resume Builder',
    description: 'Create professional resumes and career documents with AI. Free forever.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2372917044233355"
     crossOrigin="anonymous"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#070714] antialiased">
        <div className="particles">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        {children}
      </body>
    </html>
  );
}
