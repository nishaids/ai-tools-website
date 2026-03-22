'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface SmartOutputProps {
  output: string;
  title?: string;
  onCopy?: () => void;
  copied?: boolean;
}

export default function SmartOutput({ output, title, onCopy, copied }: SmartOutputProps) {
  const contentType = detectContentType(output);
  
  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {onCopy && (
            <button
              onClick={onCopy}
              className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
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
          )}
        </div>
      )}
      
      <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/50">
        {contentType === 'html' && (
          <HTMLPreview html={output} />
        )}
        {contentType === 'markdown' && (
          <MarkdownPreview markdown={output} />
        )}
        {contentType === 'plain' && (
          <PlainTextPreview text={output} />
        )}
      </div>
    </div>
  );
}

function detectContentType(content: string): 'html' | 'markdown' | 'plain' {
  const trimmed = content.trim();
  
  if (trimmed.startsWith('<') && (
    trimmed.includes('<!DOCTYPE') || 
    trimmed.includes('<html') || 
    trimmed.includes('<div') ||
    trimmed.includes('<table') ||
    trimmed.includes('<head') ||
    trimmed.includes('<body') ||
    (trimmed.includes('<') && trimmed.includes('>') && trimmed.includes('</'))
  )) {
    return 'html';
  }
  
  if (trimmed.includes('**') || trimmed.includes('###') || trimmed.includes('##') || 
      trimmed.includes('* ') || trimmed.includes('- ') || trimmed.includes('1. ') ||
      trimmed.includes('| ')) {
    return 'markdown';
  }
  
  return 'plain';
}

function HTMLPreview({ html }: { html: string }) {
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <span className="text-xs text-gray-400">HTML Preview</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition"
          >
            {copied ? '✓ Copied' : 'Copy HTML'}
          </button>
          <button
            onClick={handlePrint}
            className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition"
          >
            Print
          </button>
        </div>
      </div>
      <iframe
        key={iframeKey}
        srcDoc={wrapHTMLForIframe(html)}
        style={{ width: '100%', height: '500px', border: 'none' }}
        title="HTML Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}

function wrapHTMLForIframe(html: string): string {
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
    body { 
      font-family: 'Inter', -apple-system, sans-serif; 
      padding: 20px; 
      background: white; 
      color: #1a1a2e;
      line-height: 1.6;
    }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    h1, h2, h3 { color: #1a1a2e; margin: 16px 0 8px 0; }
    h1 { font-size: 24px; }
    h2 { font-size: 18px; }
    h3 { font-size: 16px; }
    p { margin: 8px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    strong { font-weight: 600; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
    .header { text-align: center; margin-bottom: 24px; }
    .footer { text-align: center; margin-top: 24px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-end border-b border-gray-700">
        <button
          onClick={handleCopy}
          className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-6 min-h-[200px] max-h-[600px] overflow-auto">
        <ReactMarkdown
          components={{
            h1: ({children}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-semibold text-violet-400 mb-2 mt-4">{children}</h3>,
            p: ({children}) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
            ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-300">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-300">{children}</ol>,
            li: ({children}) => <li className="text-gray-300">{children}</li>,
            strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
            em: ({children}) => <em className="italic text-gray-400">{children}</em>,
            hr: () => <hr className="border-gray-700 my-6" />,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-400 my-4 bg-white/5 py-2 rounded-r">
                {children}
              </blockquote>
            ),
            code: ({children}) => <code className="bg-gray-800 px-2 py-1 rounded text-sm text-violet-400">{children}</code>,
            pre: ({children}) => <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function PlainTextPreview({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-end border-b border-gray-700">
        <button
          onClick={handleCopy}
          className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-6 min-h-[200px] max-h-[600px] overflow-auto">
        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm">
          {text}
        </pre>
      </div>
    </div>
  );
}

export { detectContentType, HTMLPreview, MarkdownPreview, PlainTextPreview };
