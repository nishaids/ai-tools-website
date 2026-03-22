'use client';

import { useState } from 'react';
import SmartOutput, { detectContentType } from '@/components/SmartOutput';

interface OutputRendererProps {
  output: string;
  format: string;
}

export default function OutputRenderer({ output, format }: OutputRendererProps) {
  switch (format) {
    case 'resume':
      return <ResumeOutput output={output} />;
    case 'email':
      return <EmailOutput output={output} />;
    case 'invoice':
      return <InvoiceOutput output={output} />;
    case 'social':
      return <SocialOutput output={output} />;
    case 'script':
      return <ScriptOutput output={output} />;
    default:
      return <SmartOutput output={output} title="Generated Content" />;
  }
}

function ResumeOutput({ output }: { output: string }) {
  const [activeStyle, setActiveStyle] = useState<'modern' | 'classic' | 'creative'>('modern');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  const contentType = detectContentType(output);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['modern', 'classic', 'creative'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setActiveStyle(style)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeStyle === style 
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30' 
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {contentType === 'html' ? (
        <div className="border border-gray-700 rounded-xl overflow-hidden">
          <iframe
            srcDoc={wrapResumeForIframe(output, activeStyle)}
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Resume Preview"
            sandbox="allow-same-origin"
          />
        </div>
      ) : (
        <div className="border border-gray-700 rounded-xl overflow-hidden">
          <iframe
            srcDoc={wrapTextAsResume(output, activeStyle)}
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Resume Preview"
            sandbox="allow-same-origin"
          />
        </div>
      )}

      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-400 mb-1">ATS Score</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: '92%' }} />
              </div>
              <span className="text-green-400 font-bold">92%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ATS Optimized
          </div>
        </div>
      </div>
    </div>
  );
}

function wrapTextAsResume(text: string, style: string): string {
  const styleCSS = style === 'classic' 
    ? `{ bg: white, border: '2px solid #1a1a2e', textColor: '#000' }`
    : style === 'creative'
    ? `{ bg: 'linear-gradient(to br, white, #f3e8ff)', border: '4px solid #8b5cf6', accent: '#8b5cf6' }`
    : `{ bg: white, accent: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', textColor: '#1a1a2e' }`;
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; padding: 40px; ${style === 'classic' ? 'background: white;' : style === 'creative' ? 'background: linear-gradient(135deg, white, #f3e8ff);' : 'background: white;'} }
    .container { max-width: 800px; margin: 0 auto; ${style === 'classic' ? 'border: 2px solid #1a1a2e; padding: 40px;' : style === 'creative' ? 'border: 4px solid #8b5cf6; border-radius: 16px; padding: 40px;' : 'padding: 40px;'} }
    .name { ${style === 'modern' ? 'background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 800;' : style === 'classic' ? 'font-size: 28px; font-weight: 800; color: #000; text-transform: uppercase;' : 'font-size: 28px; font-weight: 800; color: #8b5cf6;'} margin-bottom: 8px; }
    .contact { color: #666; font-size: 14px; margin-bottom: 24px; padding-bottom: 16px; ${style !== 'classic' ? 'border-bottom: 2px solid #e5e7eb;' : 'border-bottom: 1px solid #000;'} }
    .section { margin-bottom: 24px; }
    .section-title { ${style === 'modern' ? 'color: #8b5cf6;' : style === 'classic' ? 'color: #000; border-bottom: 2px solid #000; text-transform: uppercase;' : 'color: #8b5cf6; border-bottom: 2px solid #ec4899;'} font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding-bottom: 8px; margin-bottom: 12px; }
    .summary { color: #333; font-size: 14px; line-height: 1.7; }
    .job-title { font-weight: 700; font-size: 16px; ${style === 'classic' ? 'color: #000;' : 'color: #1a1a2e;'} }
    .company { ${style === 'modern' ? 'color: #8b5cf6;' : style === 'classic' ? 'color: #333;' : 'color: #ec4899;'} font-weight: 500; }
    .date { color: #999; font-size: 13px; }
    .bullets { margin-top: 8px; padding-left: 16px; }
    .bullets li { color: #444; font-size: 14px; margin-bottom: 4px; }
    pre { white-space: pre-wrap; font-family: 'Inter', sans-serif; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <pre>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
</body>
</html>`;
}

function wrapResumeForIframe(html: string, style: string): string {
  if (html.includes('<!DOCTYPE') || html.includes('<html')) {
    return html;
  }
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; padding: 20px; background: white; color: #1a1a2e; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    h1, h2, h3 { color: #1a1a2e; margin: 16px 0 8px 0; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    strong { font-weight: 600; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

function EmailOutput({ output }: { output: string }) {
  const contentType = detectContentType(output);
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
            <div>
              <div className="font-semibold text-gray-900">Your Email</div>
              <div className="text-gray-500 text-sm">Draft</div>
            </div>
          </div>
        </div>
        <div className="p-6 min-h-[200px]">
          {contentType === 'html' ? (
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet"></head><body style="font-family: Inter, sans-serif; padding: 20px; background: white;">${output}</body></html>`}
              style={{ width: '100%', minHeight: '200px', border: 'none' }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="prose prose-sm max-w-none text-gray-800">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvoiceOutput({ output }: { output: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleCopy}
          className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
        <button
          onClick={handlePrint}
          className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          srcDoc={wrapInvoiceForIframe(output)}
          style={{ width: '100%', height: '600px', border: 'none' }}
          title="Invoice Preview"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}

function wrapInvoiceForIframe(html: string): string {
  if (html.includes('<!DOCTYPE') || html.includes('<html')) {
    return html;
  }
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; padding: 40px; background: white; color: #1a1a2e; line-height: 1.6; }
    .header { background: linear-gradient(135deg, #1a1a2e, #2d2d44); color: white; padding: 32px; margin: -40px -40px 32px -40px; }
    .header h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    .header p { color: #9ca3af; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 12px 16px; text-align: left; }
    th { background: #f9fafb; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #6b7280; }
    td { font-size: 14px; }
    .total-row td { font-weight: 700; font-size: 16px; background: #f9fafb; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    h2, h3 { color: #1a1a2e; margin: 24px 0 12px 0; }
    p { margin: 8px 0; color: #374151; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    pre { white-space: pre-wrap; font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <p>Professional Invoice</p>
  </div>
  <pre>${html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
}

function SocialOutput({ output }: { output: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      
      <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto">
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
          <span className="font-semibold text-white">your_account</span>
        </div>
        <div className="aspect-square bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600" />
        <div className="p-4">
          <div className="flex gap-4 mb-3">
            <svg className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <svg className="w-6 h-6 text-white cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
          </div>
          <pre className="text-white text-sm whitespace-pre-wrap leading-relaxed font-sans">{output}</pre>
        </div>
      </div>
    </div>
  );
}

function ScriptOutput({ output }: { output: string }) {
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="font-semibold">YouTube Script</span>
        </div>
        <div className="min-h-[200px] max-h-[500px] overflow-auto">
          <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed font-mono">
            {output}
          </pre>
        </div>
      </div>
      
      <div className="glass rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-400">Est. Duration:</span>
            <span className="text-white font-medium">~10 min</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-gray-400">Engagement:</span>
            <span className="text-green-400 font-medium">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
