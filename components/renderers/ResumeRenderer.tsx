'use client';

import { useState } from 'react';
import type { ResumeOutput } from '@/lib/schemas';
import { computeAtsScore } from '@/lib/atsScore';
import { downloadTextFile, resumeToText } from '@/lib/exporters/text';
import { exportResumeDocx } from '@/lib/exporters/docx';
import { toast } from '@/components/Toast';
import {
  ActionButton,
  CopyIcon,
  DownloadIcon,
  ImproveButton,
  PrintIcon,
  ScaledPaper,
  useCopy,
} from './shared';

type TemplateId = 'modern' | 'classic' | 'creative';

interface Props {
  data: ResumeOutput;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}

export default function ResumeRenderer({ data, onImprove, improvingSection }: Props) {
  const [template, setTemplate] = useState<TemplateId>('modern');
  const copy = useCopy();

  const handleDocx = async () => {
    try {
      await exportResumeDocx(data);
      toast('DOCX downloaded');
    } catch (err) {
      console.error(err);
      toast('DOCX export failed', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(['modern', 'classic', 'creative'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTemplate(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                template === t
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={() => copy(resumeToText(data))} title="Copy as plain text">
            {CopyIcon} Copy
          </ActionButton>
          <ActionButton onClick={() => window.print()} title="Print → Save as PDF (selectable text)" primary>
            {PrintIcon} Print / PDF
          </ActionButton>
          <ActionButton onClick={handleDocx} title="Download Word document">
            {DownloadIcon} DOCX
          </ActionButton>
          <ActionButton
            onClick={() => downloadTextFile('resume.txt', resumeToText(data))}
            title="Download plain text"
          >
            {DownloadIcon} TXT
          </ActionButton>
        </div>
      </div>

      {/* Paper */}
      <ScaledPaper>
        <div className="print-area shadow-2xl">
          {template === 'modern' && <ModernTemplate data={data} onImprove={onImprove} improvingSection={improvingSection} />}
          {template === 'classic' && <ClassicTemplate data={data} onImprove={onImprove} improvingSection={improvingSection} />}
          {template === 'creative' && <CreativeTemplate data={data} onImprove={onImprove} improvingSection={improvingSection} />}
        </div>
      </ScaledPaper>

      <AtsPanel data={data} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Templates — normal React DOM inside a white A4 "paper" (no iframes).
// ---------------------------------------------------------------------------

function contactItems(h: ResumeOutput['header']): string[] {
  return [h.email, h.phone, h.location, h.linkedin].filter((x): x is string => Boolean(x));
}

/** Modern: accent sidebar, clean sans-serif. */
function ModernTemplate({ data, onImprove, improvingSection }: Props) {
  const accent = '#0e7490'; // cyan-700 — prints well
  return (
    <div className="bg-white text-gray-900 min-h-[1123px] flex print-exact" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 text-white p-8 space-y-7 print-exact" style={{ backgroundColor: '#134e4a' }}>
        <div>
          <h1 className="text-[26px] font-extrabold leading-tight">{data.header.name}</h1>
          {data.header.title && <p className="text-teal-200 text-[13px] font-medium mt-1">{data.header.title}</p>}
        </div>
        <div className="space-y-1.5">
          <SidebarHeading>Contact</SidebarHeading>
          {contactItems(data.header).map((item) => (
            <p key={item} className="text-[11px] text-teal-50 break-words leading-relaxed">{item}</p>
          ))}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <SidebarHeading>Skills</SidebarHeading>
            <ImproveButton section="skills" onImprove={onImprove} improvingSection={improvingSection} />
          </div>
          <SidebarSkills label="Technical" items={data.skills.technical} />
          <SidebarSkills label="Tools" items={data.skills.tools} />
          <SidebarSkills label="Soft" items={data.skills.soft} />
        </div>
      </aside>

      {/* Main column */}
      <main className="flex-1 p-9 space-y-6">
        <section>
          <MainHeading accent={accent}>
            Summary <ImproveButton section="summary" onImprove={onImprove} improvingSection={improvingSection} />
          </MainHeading>
          <p className="text-[12.5px] leading-relaxed text-gray-700">{data.summary}</p>
        </section>

        <section>
          <MainHeading accent={accent}>
            Experience <ImproveButton section="experience" onImprove={onImprove} improvingSection={improvingSection} />
          </MainHeading>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[13.5px] font-bold text-gray-900">
                    {exp.role} <span className="font-medium" style={{ color: accent }}>· {exp.company}</span>
                  </h3>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">{exp.dates}</span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-[12px] leading-relaxed text-gray-700 pl-3.5 relative">
                      <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full print-exact" style={{ backgroundColor: accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <MainHeading accent={accent}>Education</MainHeading>
          <div className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-[12.5px] font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-[11.5px] text-gray-600">
                    {edu.institution}
                    {edu.details ? ` — ${edu.details}` : ''}
                  </p>
                </div>
                <span className="text-[11px] text-gray-500 whitespace-nowrap">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10.5px] font-bold uppercase tracking-[2px] text-teal-300 border-b border-teal-600 pb-1 mb-2">
      {children}
    </h2>
  );
}

function SidebarSkills({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-200">{label}</p>
      <p className="text-[11px] text-teal-50 leading-relaxed">{items.join(' · ')}</p>
    </div>
  );
}

function MainHeading({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <h2
      className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[2.5px] pb-1.5 mb-3 border-b-2"
      style={{ color: accent, borderColor: accent }}
    >
      {children}
    </h2>
  );
}

/** Classic: serif single column, black on white — the ATS-safest layout. */
function ClassicTemplate({ data, onImprove, improvingSection }: Props) {
  return (
    <div
      className="bg-white text-black min-h-[1123px] px-14 py-12"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <header className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-[30px] font-bold tracking-wide uppercase">{data.header.name}</h1>
        {data.header.title && <p className="text-[13px] mt-1 italic">{data.header.title}</p>}
        <p className="text-[11.5px] mt-2 text-gray-800">{contactItems(data.header).join('  •  ')}</p>
      </header>

      <ClassicSection
        title="Professional Summary"
        action={<ImproveButton section="summary" onImprove={onImprove} improvingSection={improvingSection} />}
      >
        <p className="text-[12.5px] leading-relaxed">{data.summary}</p>
      </ClassicSection>

      <ClassicSection
        title="Experience"
        action={<ImproveButton section="experience" onImprove={onImprove} improvingSection={improvingSection} />}
      >
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[13px] font-bold">
                  {exp.role}, <span className="font-normal italic">{exp.company}</span>
                </h3>
                <span className="text-[11.5px] whitespace-nowrap">{exp.dates}</span>
              </div>
              <ul className="mt-1 space-y-0.5 list-disc pl-5">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="text-[12px] leading-relaxed">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ClassicSection>

      <ClassicSection title="Education">
        <div className="space-y-1.5">
          {data.education.map((edu, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3">
              <p className="text-[12.5px]">
                <span className="font-bold">{edu.degree}</span>, {edu.institution}
                {edu.details ? ` — ${edu.details}` : ''}
              </p>
              <span className="text-[11.5px] whitespace-nowrap">{edu.year}</span>
            </div>
          ))}
        </div>
      </ClassicSection>

      <ClassicSection
        title="Skills"
        action={<ImproveButton section="skills" onImprove={onImprove} improvingSection={improvingSection} />}
      >
        <div className="text-[12px] space-y-0.5">
          {data.skills.technical.length > 0 && (
            <p><span className="font-bold">Technical:</span> {data.skills.technical.join(', ')}</p>
          )}
          {data.skills.tools.length > 0 && (
            <p><span className="font-bold">Tools:</span> {data.skills.tools.join(', ')}</p>
          )}
          {data.skills.soft.length > 0 && (
            <p><span className="font-bold">Soft Skills:</span> {data.skills.soft.join(', ')}</p>
          )}
        </div>
      </ClassicSection>
    </div>
  );
}

function ClassicSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-[3px] border-b border-black pb-1 mb-2.5">
        {title} {action}
      </h2>
      {children}
    </section>
  );
}

/** Creative: subtle color header band, modern but restrained. */
function CreativeTemplate({ data, onImprove, improvingSection }: Props) {
  const accent = '#7c3aed'; // violet-600
  return (
    <div className="bg-white text-gray-900 min-h-[1123px]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header
        className="px-12 py-9 text-white print-exact"
        style={{ background: 'linear-gradient(120deg, #6d28d9 0%, #4f46e5 100%)' }}
      >
        <h1 className="text-[30px] font-extrabold">{data.header.name}</h1>
        {data.header.title && <p className="text-violet-100 text-[14px] font-medium mt-0.5">{data.header.title}</p>}
        <p className="text-[11.5px] text-violet-200 mt-3">{contactItems(data.header).join('   •   ')}</p>
      </header>

      <div className="px-12 py-8 space-y-6">
        <section>
          <CreativeHeading accent={accent}>
            About <ImproveButton section="summary" onImprove={onImprove} improvingSection={improvingSection} />
          </CreativeHeading>
          <p className="text-[12.5px] leading-relaxed text-gray-700">{data.summary}</p>
        </section>

        <section>
          <CreativeHeading accent={accent}>
            Experience <ImproveButton section="experience" onImprove={onImprove} improvingSection={improvingSection} />
          </CreativeHeading>
          <div className="space-y-4 border-l-2 pl-5" style={{ borderColor: '#ddd6fe' }}>
            {data.experience.map((exp, i) => (
              <div key={i} className="relative">
                <span
                  className="absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full print-exact"
                  style={{ backgroundColor: accent }}
                />
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[13.5px] font-bold">{exp.role}</h3>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">{exp.dates}</span>
                </div>
                <p className="text-[12px] font-medium" style={{ color: accent }}>{exp.company}</p>
                <ul className="mt-1.5 space-y-1 list-disc pl-4">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-[12px] leading-relaxed text-gray-700">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-8">
          <section>
            <CreativeHeading accent={accent}>Education</CreativeHeading>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-[12.5px] font-semibold">{edu.degree}</p>
                  <p className="text-[11.5px] text-gray-600">
                    {edu.institution} · {edu.year}
                    {edu.details ? ` — ${edu.details}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <CreativeHeading accent={accent}>
              Skills <ImproveButton section="skills" onImprove={onImprove} improvingSection={improvingSection} />
            </CreativeHeading>
            <div className="flex flex-wrap gap-1.5">
              {[...data.skills.technical, ...data.skills.tools, ...data.skills.soft].map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium print-exact"
                  style={{ backgroundColor: '#ede9fe', color: '#5b21b6' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CreativeHeading({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[2.5px] mb-2.5" style={{ color: accent }}>
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// ATS score panel — computed from the JSON, with per-criterion bars and tips.
// ---------------------------------------------------------------------------

function AtsPanel({ data }: { data: ResumeOutput }) {
  const score = computeAtsScore(data);
  const color = score.total >= 80 ? '#10b981' : score.total >= 60 ? '#f59e0b' : '#ef4444';
  const tips = score.criteria.filter((c) => c.tip);

  return (
    <div className="no-print glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white">ATS Score</h4>
          <p className="text-xs text-gray-400">Computed from your actual resume content</p>
        </div>
        <div className="text-3xl font-extrabold" style={{ color }}>
          {score.total}
          <span className="text-sm font-medium text-gray-400">/100</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {score.criteria.map((c) => (
          <div key={c.key}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-300">{c.label}</span>
              <span className="text-gray-400 tabular-nums">
                {c.score}/{c.max}
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(c.score / c.max) * 100}%`,
                  backgroundColor: c.score / c.max >= 0.8 ? '#10b981' : c.score / c.max >= 0.5 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {tips.length > 0 && (
        <div className="pt-3 border-t border-white/10 space-y-1.5">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">How to improve</p>
          {tips.map((c) => (
            <p key={c.key} className="text-xs text-gray-300 flex gap-2">
              <span className="text-amber-400 shrink-0">→</span>
              {c.tip}
            </p>
          ))}
        </div>
      )}

      {data.atsKeywords.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Target keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {data.atsKeywords.map((k, i) => (
              <span key={`${k}-${i}`} className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[11px]">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
