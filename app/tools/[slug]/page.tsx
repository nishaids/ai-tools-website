'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { tools, InputField } from '@/lib/tools';
import type { ToolId } from '@/lib/schemas';
import OutputRenderer from '@/components/renderers/OutputRenderer';
import OutputSkeleton from '@/components/renderers/Skeletons';
import OutputHistory, { HistoryEntry, saveToHistory } from '@/components/OutputHistory';
import Toaster, { toast } from '@/components/Toast';
import ProModal from './ProModal';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

const FLOW_STEPS = [
  { id: 1, label: 'Fill Details' },
  { id: 2, label: 'AI Processing' },
  { id: 3, label: 'Result Ready' },
];

// Labels for the multi-step form (resume / cover letter).
const FORM_STEP_LABELS: Partial<Record<ToolId, string[]>> = {
  'resume-builder': ['Contact', 'Experience & Education', 'Skills & Target'],
  'cover-letter': ['Your Details', 'The Company', 'Your Experience'],
};

const DEFAULT_TEXTAREA_MAX = 2000;
const FREE_LIMIT = 3; // per-tool daily soft limit (client-side, drives the Pro modal)

interface GenerationResult {
  data?: unknown;
  fallbackText?: string;
}

interface Credits {
  remaining: number;
  limit: number;
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const tool = tools.find((t) => t.slug === slug) || null;

  // Draft autosave: every keystroke persists, so a refresh never loses input.
  const [formData, setFormData, clearDraft] = useLocalStorage<Record<string, string>>(`draft_${slug}`, {});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formStep, setFormStep] = useState(1);

  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flowStep, setFlowStep] = useState(1);
  const [improvingSection, setImprovingSection] = useState<string | null>(null);
  const [historyToken, setHistoryToken] = useState(0);

  const [credits, setCredits] = useState<Credits | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const formSteps = useMemo(() => {
    if (!tool?.multiStep) return 1;
    return Math.max(...tool.inputs.map((i) => i.step ?? 1));
  }, [tool]);

  useEffect(() => {
    const savedUsage = localStorage.getItem(`usage_${slug}`);
    if (savedUsage) {
      try {
        const { count, date } = JSON.parse(savedUsage);
        if (date === new Date().toDateString()) setUsageCount(count);
      } catch {
        // corrupt entry — ignore
      }
    }
  }, [slug]);

  // Fetch remaining server credits without consuming one.
  useEffect(() => {
    fetch('/api/generate')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.rateLimit) setCredits({ remaining: json.rateLimit.remaining, limit: json.rateLimit.limit });
      })
      .catch(() => {
        // non-critical
      });
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateField = useCallback((field: InputField, value: string): string => {
    const trimmed = value.trim();
    if (field.required && !trimmed) return `${field.label} is required.`;
    if (trimmed && field.name.toLowerCase().includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'That doesn’t look like a valid email address.';
    }
    return '';
  }, []);

  const validateFields = useCallback(
    (fields: InputField[]): boolean => {
      const errors: Record<string, string> = {};
      for (const field of fields) {
        const message = validateField(field, formData[field.name] || '');
        if (message) errors[field.name] = message;
      }
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return Object.keys(errors).length === 0;
    },
    [formData, validateField]
  );

  const bumpLocalUsage = () => {
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem(`usage_${slug}`, JSON.stringify({ count: newCount, date: new Date().toDateString() }));
  };

  const callApi = async (body: object) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (json?.rateLimit) setCredits({ remaining: json.rateLimit.remaining, limit: json.rateLimit.limit });
    return { response, json };
  };

  const generate = async () => {
    if (!tool) return;
    if (usageCount >= FREE_LIMIT) {
      setShowProModal(true);
      return;
    }
    if (!validateFields(tool.inputs)) {
      // Jump the multi-step form to the first step containing an error.
      if (tool.multiStep) {
        const firstBad = tool.inputs.find((f) => validateField(f, formData[f.name] || ''));
        if (firstBad?.step) setFormStep(firstBad.step);
      }
      toast('Please fix the highlighted fields', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setFlowStep(2);

    try {
      const { response, json } = await callApi({ toolId: tool.id, inputs: formData });

      if (!response.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setFlowStep(1);
        return;
      }

      const generation: GenerationResult = { data: json.data, fallbackText: json.fallbackText };
      setResult(generation);
      setFlowStep(3);
      saveToHistory(tool.id, generation);
      setHistoryToken((t) => t + 1);
      bumpLocalUsage();
    } catch {
      setError('Connection failed. Please check your internet and try again.');
      setFlowStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void generate();
  };

  /** Section-level "↻ Improve": regenerates one section and swaps it in. */
  const handleImprove = async (section: string) => {
    if (!tool || !result?.data) return;
    if (usageCount >= FREE_LIMIT) {
      setShowProModal(true);
      return;
    }

    setImprovingSection(section);
    try {
      const { response, json } = await callApi({ toolId: tool.id, inputs: formData, section });
      if (!response.ok) {
        toast(json.error || 'Could not improve this section', 'error');
        return;
      }
      if (json.data && typeof json.data === 'object') {
        setResult((prev) =>
          prev?.data ? { ...prev, data: { ...(prev.data as object), ...(json.data as object) } } : prev
        );
        bumpLocalUsage();
        toast('Section improved!');
      } else {
        toast('The AI could not improve this section — try again', 'error');
      }
    } catch {
      toast('Connection failed', 'error');
    } finally {
      setImprovingSection(null);
    }
  };

  const handleRestore = (entry: HistoryEntry) => {
    setResult({ data: entry.data, fallbackText: entry.fallbackText });
    setFlowStep(3);
    setError('');
    toast('Output restored', 'info');
  };

  const fillSampleData = () => {
    if (!tool) return;
    setFormData(tool.sampleData);
    setFieldErrors({});
    toast('Sample data loaded — hit Generate!', 'info');
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

  const visibleInputs = tool.multiStep ? tool.inputs.filter((i) => (i.step ?? 1) === formStep) : tool.inputs;
  const stepLabels = FORM_STEP_LABELS[tool.id] ?? [];

  const goNextStep = () => {
    if (!validateFields(visibleInputs)) return;
    setFormStep((s) => Math.min(formSteps, s + 1));
  };

  return (
    <div className="min-h-screen relative">
      <Toaster />

      {/* Navigation */}
      <nav className="no-print fixed top-0 left-0 right-0 z-50 glass-dark">
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
              {credits && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {credits.remaining} free generation{credits.remaining === 1 ? '' : 's'} left this hour
                  </span>
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${(credits.remaining / credits.limit) * 100}%` }}
                    />
                  </div>
                </div>
              )}
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
      <div className={`mobile-menu no-print ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-violet-400 transition">
          All Tools
        </Link>
        {credits && (
          <div className="glass px-6 py-4 rounded-xl">
            <p className="text-sm text-gray-400 mb-2">
              {credits.remaining} free generation{credits.remaining === 1 ? '' : 's'} left this hour
            </p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${(credits.remaining / credits.limit) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Tool Header */}
          <div className="no-print mb-8">
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

          {/* Flow Progress */}
          <div className="no-print mb-8">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {FLOW_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 md:gap-4">
                  <div className={`progress-step ${flowStep === step.id ? 'active' : ''} ${flowStep > step.id ? 'completed' : ''}`}>
                    <div className="step-number">
                      {flowStep > step.id ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-xs md:text-sm hidden sm:block">{step.label}</span>
                  </div>
                  {index < FLOW_STEPS.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 transition-all duration-300 ${flowStep > step.id ? 'bg-violet-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="no-print glass rounded-3xl p-6 md:p-8 h-fit">
              {/* Form step progress (multi-step tools) */}
              {tool.multiStep && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {stepLabels.map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => i + 1 < formStep && setFormStep(i + 1)}
                        className={`text-xs font-medium transition ${
                          formStep === i + 1 ? 'text-violet-300' : formStep > i + 1 ? 'text-gray-300 hover:text-white' : 'text-gray-600'
                        }`}
                      >
                        {i + 1}. {label}
                      </button>
                    ))}
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${(formStep / formSteps) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">Your draft autosaves — refresh anytime without losing input.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {visibleInputs.map((input: InputField) => {
                  const value = formData[input.name] || '';
                  const errorMessage = fieldErrors[input.name];
                  const inputClass = `w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition ${
                    errorMessage ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-violet-500'
                  }`;
                  return (
                    <div key={input.name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        {input.label}
                        {input.required && <span className="text-red-400 ml-1">*</span>}
                      </label>

                      {input.type === 'textarea' ? (
                        <div>
                          <textarea
                            name={input.name}
                            value={value}
                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                            placeholder={input.placeholder}
                            rows={4}
                            maxLength={input.maxLength ?? DEFAULT_TEXTAREA_MAX}
                            className={`${inputClass} resize-none`}
                          />
                          <div className="text-xs text-gray-500 mt-1 text-right tabular-nums">
                            {value.length}/{input.maxLength ?? DEFAULT_TEXTAREA_MAX}
                          </div>
                        </div>
                      ) : input.type === 'select' ? (
                        <select
                          name={input.name}
                          value={value}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          className={`${inputClass} bg-gray-800 border-gray-600 cursor-pointer appearance-none`}
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
                          value={value}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          onBlur={() => {
                            const message = validateField(input, value);
                            if (message) setFieldErrors((prev) => ({ ...prev, [input.name]: message }));
                          }}
                          placeholder={input.placeholder}
                          className={inputClass}
                        />
                      )}

                      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}

                      {!errorMessage && input.tooltip && (
                        <div className="tooltip flex items-center gap-1" data-tooltip={input.tooltip}>
                          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-gray-500">Tips</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Multi-step navigation / submit */}
                {tool.multiStep && formStep < formSteps ? (
                  <div className="flex gap-3 pt-2">
                    {formStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormStep((s) => s - 1)}
                        className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={goNextStep}
                      className="btn-primary flex-1 py-3"
                    >
                      <span>Continue →</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {tool.multiStep && (
                      <button
                        type="button"
                        onClick={() => setFormStep((s) => Math.max(1, s - 1))}
                        className="text-sm text-gray-400 hover:text-white transition"
                      >
                        ← Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={fillSampleData}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition font-medium"
                  >
                    ✦ Try with sample data
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearDraft();
                      setFieldErrors({});
                      setFormStep(1);
                      toast('Draft cleared', 'info');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-300 transition"
                  >
                    Clear draft
                  </button>
                </div>

                {usageCount >= FREE_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowProModal(true)}
                    className="w-full mt-1 py-3 border border-amber-500/50 rounded-xl text-amber-400 font-medium hover:bg-amber-500/10 transition"
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
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6 min-w-0">
              <div className="glass rounded-3xl p-6 md:p-8 border border-white/10">
                <div className="no-print flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Output
                  </h3>
                  {result && (
                    <button
                      onClick={() => void generate()}
                      disabled={loading}
                      className="flex items-center gap-2 px-3.5 py-2 bg-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/10 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate
                    </button>
                  )}
                </div>

                {loading ? (
                  <OutputSkeleton format={tool.outputFormat} />
                ) : result ? (
                  <div className="animate-fade-in">
                    <OutputRenderer
                      toolId={tool.id}
                      data={result.data}
                      fallbackText={result.fallbackText}
                      onImprove={(section) => void handleImprove(section)}
                      improvingSection={improvingSection}
                    />
                  </div>
                ) : (
                  <div className="no-print text-center py-16">
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

              <OutputHistory toolId={tool.id} onRestore={handleRestore} refreshToken={historyToken} />
            </div>
          </div>
        </div>
      </main>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}
