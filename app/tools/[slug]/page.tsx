'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tools, Tool, InputField } from '@/lib/tools';
import OutputRenderer from './OutputRenderer';
import ProModal from './ProModal';

const STEPS = [
  { id: 1, label: 'Fill Details' },
  { id: 2, label: 'AI Processing' },
  { id: 3, label: 'Result Ready' },
];

export default function ToolPage({ params }: { params: { slug: string } }) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(true);

  const FREE_LIMIT = 3;

  useEffect(() => {
    const foundTool = tools.find((t) => t.slug === params.slug);
    setTool(foundTool || null);
    
    const savedUsage = localStorage.getItem(`usage_${params.slug}`);
    if (savedUsage) {
      const { count, date } = JSON.parse(savedUsage);
      const today = new Date().toDateString();
      if (date === today) {
        setUsageCount(count);
      }
    }
  }, [params.slug]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tool) return;

    if (usageCount >= FREE_LIMIT) {
      setShowProModal(true);
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    setCurrentStep(1);

    setTimeout(() => setCurrentStep(2), 500);

    try {
      let prompt = tool.promptTemplate;
      tool.inputs.forEach((input: InputField) => {
        const value = formData[input.name] || '';
        prompt = prompt.replace(new RegExp(`\\{${input.name}\\}`, 'g'), value);
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || 'You have used your free limit. Please try again in an hour.');
        } else {
          setError(data.error || 'Something went wrong. Please try again.');
        }
        setCurrentStep(1);
        return;
      }

      setOutput(data.result);
      setCurrentStep(3);

      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(`usage_${params.slug}`, JSON.stringify({
        count: newCount,
        date: new Date().toDateString()
      }));
    } catch (err: any) {
      setError('Connection failed. Please check your internet and try again.');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool?.name.replace(/\s+/g, '-').toLowerCase() || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRegenerate = async () => {
    if (usageCount >= FREE_LIMIT) {
      setShowProModal(true);
      return;
    }
    
    setLoading(true);
    setOutput('');
    setCurrentStep(2);

    try {
      let prompt = tool!.promptTemplate;
      tool!.inputs.forEach((input: InputField) => {
        const value = formData[input.name] || '';
        prompt = prompt.replace(new RegExp(`\\{${input.name}\\}`, 'g'), value);
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(data.error || 'You have used your free limit. Please try again in an hour.');
        } else {
          setError(data.error || 'Failed to regenerate. Please try again.');
        }
        setCurrentStep(1);
        return;
      }

      setOutput(data.result);
      setCurrentStep(3);

      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(`usage_${params.slug}`, JSON.stringify({
        count: newCount,
        date: new Date().toDateString()
      }));
    } catch (err: any) {
      setError('Connection failed. Please check your internet and try again.');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 gradient-text">Tool Not Found</h1>
          <Link href="/" className="text-violet-400 hover:text-violet-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">AI Career Tools</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition">All Tools</Link>
              <span className="text-gray-500">|</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{FREE_LIMIT - usageCount} free uses left</span>
                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${(usageCount / FREE_LIMIT) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-violet-400 transition">All Tools</Link>
        <div className="glass px-6 py-4 rounded-xl">
          <p className="text-sm text-gray-400 mb-2">{FREE_LIMIT - usageCount} free uses left today</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${(usageCount / FREE_LIMIT) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="pt-24 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Tool Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              All Tools
            </Link>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl`}>
                {tool.icon}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{tool.name}</h1>
                <p className="text-gray-400">{tool.description}</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 md:gap-4">
                  <div className={`progress-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                    <div className="step-number">
                      {currentStep > step.id ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-xs md:text-sm hidden sm:block">{step.label}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 transition-all duration-300 ${currentStep > step.id ? 'bg-violet-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="glass rounded-3xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {tool.inputs.map((input: InputField) => (
                  <div key={input.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {input.label}
                      {input.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    
                    {input.type === 'textarea' ? (
                      <div>
                        <textarea
                          name={input.name}
                          value={formData[input.name] || ''}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          placeholder={input.placeholder}
                          required={input.required}
                          rows={4}
                          maxLength={input.maxLength}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition resize-none"
                        />
                        {input.maxLength && (
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {(formData[input.name] || '').length}/{input.maxLength}
                          </div>
                        )}
                      </div>
                    ) : input.type === 'select' ? (
                      <select
                        name={input.name}
                        value={formData[input.name] || ''}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        required={input.required}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="" className="bg-gray-800">Select {input.label}...</option>
                        {input.options?.map((option) => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={input.name}
                        value={formData[input.name] || ''}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        placeholder={input.placeholder}
                        required={input.required}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition"
                      />
                    )}
                    
                    {input.tooltip && (
                      <div className="tooltip flex items-center gap-1" data-tooltip={input.tooltip}>
                        <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-gray-500">Tips</span>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-lg py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate with AI
                        <span className="pro-badge ml-2">Free</span>
                      </>
                    )}
                  </span>
                </button>

                {usageCount >= FREE_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowProModal(true)}
                    className="w-full mt-3 py-3 border border-amber-500/50 rounded-xl text-amber-400 font-medium hover:bg-amber-500/10 transition"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Upgrade to Pro for Unlimited
                    </span>
                  </button>
                )}
              </form>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6">
              {/* Ad Placeholder */}
              <div className="ad-placeholder h-48">
                Advertisement
              </div>

              {/* Output Section */}
              <div className="glass rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Output
                  </h3>
                  {output && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                        title="Copy"
                      >
                        {copied ? (
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 hover:bg-white/10 rounded-lg transition"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-5/6" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-32 w-full" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                ) : output ? (
                  <div>
                    <OutputRenderer output={output} format={tool.outputFormat} />
                    
                    <button
                      onClick={handleRegenerate}
                      className="w-full mt-6 py-3 border border-white/20 rounded-xl font-medium hover:bg-white/5 transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generate Another Version
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">Your Output Will Appear Here</h4>
                    <p className="text-gray-500">Fill out the form and click generate to see the magic!</p>
                  </div>
                )}
              </div>

              {/* Bottom Ad */}
              <div className="ad-placeholder h-48">
                Advertisement
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Affiliate Banner */}
      <div className="fixed bottom-16 left-0 right-0 glass-dark py-3 px-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">Powered by</span>
          <span className="font-semibold gradient-text">Gemini AI</span>
          <span className="text-gray-400">-</span>
          <a href="#" className="text-violet-400 hover:text-violet-300 transition">Get your free API key</a>
        </div>
      </div>

      {/* Sticky Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-white font-semibold text-sm md:text-base">
              🔥 Limited time: All tools are 100% free today! No signup required.
            </span>
            <button 
              onClick={() => setShowStickyBar(false)}
              className="text-white/80 hover:text-white ml-4 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Pro Modal */}
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}
