import type {
  BioOutput,
  BlogTitleOutput,
  ColdEmailOutput,
  CoverLetterOutput,
  EmailOutput,
  InvoiceOutput,
  ProductDescriptionOutput,
  ResumeOutput,
  SocialCaptionOutput,
  ToolId,
  YouTubeScriptOutput,
} from '../schemas';

/**
 * Reflows structured tool output into clean plain text — used for
 * copy-as-text, .txt export, and history previews.
 */

const RULE = '----------------------------------------';

function section(title: string): string {
  return `\n${title.toUpperCase()}\n${RULE}`;
}

export function resumeToText(r: ResumeOutput): string {
  const lines: string[] = [];
  lines.push(r.header.name);
  if (r.header.title) lines.push(r.header.title);
  lines.push(
    [r.header.email, r.header.phone, r.header.location, r.header.linkedin]
      .filter(Boolean)
      .join(' | ')
  );
  if (r.summary) {
    lines.push(section('Professional Summary'), r.summary);
  }
  if (r.experience.length) {
    lines.push(section('Experience'));
    for (const exp of r.experience) {
      lines.push(`${exp.role} — ${exp.company} (${exp.dates})`);
      for (const b of exp.bullets) lines.push(`  • ${b}`);
      lines.push('');
    }
  }
  if (r.education.length) {
    lines.push(section('Education'));
    for (const edu of r.education) {
      lines.push(`${edu.degree}, ${edu.institution} (${edu.year})`);
      if (edu.details) lines.push(`  ${edu.details}`);
    }
  }
  const { technical, tools, soft } = r.skills;
  if (technical.length + tools.length + soft.length > 0) {
    lines.push(section('Skills'));
    if (technical.length) lines.push(`Technical: ${technical.join(', ')}`);
    if (tools.length) lines.push(`Tools: ${tools.join(', ')}`);
    if (soft.length) lines.push(`Soft skills: ${soft.join(', ')}`);
  }
  return lines.join('\n').trim();
}

export function coverLetterToText(c: CoverLetterOutput): string {
  const lines: string[] = [];
  lines.push(c.sender.name);
  lines.push([c.sender.email, c.sender.phone].filter(Boolean).join(' | '));
  lines.push('');
  lines.push(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  lines.push('');
  if (c.recipient.name) lines.push(c.recipient.name);
  if (c.recipient.title) lines.push(c.recipient.title);
  if (c.recipient.company) lines.push(c.recipient.company);
  lines.push('');
  lines.push(c.salutation);
  lines.push('');
  for (const p of c.bodyParagraphs) {
    lines.push(p, '');
  }
  lines.push(c.closing);
  lines.push(c.signature);
  return lines.join('\n').trim();
}

export function emailToText(e: EmailOutput): string {
  return [
    `Subject: ${e.subject}`,
    '',
    e.greeting,
    '',
    ...e.bodyParagraphs.flatMap((p) => [p, '']),
    e.signOff,
    e.signature,
  ]
    .join('\n')
    .trim();
}

export function coldEmailToText(c: ColdEmailOutput): string {
  const lines: string[] = [];
  lines.push('SUBJECT LINE OPTIONS:');
  c.subjectVariants.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
  lines.push('', RULE, '');
  lines.push(c.greeting, '');
  for (const p of c.bodyParagraphs) lines.push(p, '');
  if (c.cta) lines.push(c.cta, '');
  lines.push(c.signOff);
  if (c.followUp.subject || c.followUp.body) {
    lines.push('', RULE, `FOLLOW-UP (after ${c.followUp.delayDays} days):`, `Subject: ${c.followUp.subject}`, '', c.followUp.body);
  }
  return lines.join('\n').trim();
}

export function invoiceToText(inv: InvoiceOutput): string {
  const c = inv.currency || '$';
  const lines: string[] = [];
  lines.push(`INVOICE ${inv.invoiceNumber}`);
  lines.push(`Issued: ${inv.issueDate}   Due: ${inv.dueDate}`);
  lines.push(section('From'), inv.from.name, ...inv.from.addressLines);
  lines.push(section('Bill To'), inv.to.name, ...inv.to.addressLines);
  lines.push(section('Items'));
  for (const item of inv.items) {
    lines.push(`${item.description}  (qty ${item.quantity} × ${c}${item.rate.toFixed(2)}) — ${c}${item.amount.toFixed(2)}`);
  }
  const subtotal = inv.items.reduce((s, i) => s + i.amount, 0);
  const tax = inv.taxRate > 0 ? (subtotal * inv.taxRate) / 100 : 0;
  lines.push('', `Subtotal: ${c}${subtotal.toFixed(2)}`);
  if (tax > 0) lines.push(`Tax (${inv.taxRate}%): ${c}${tax.toFixed(2)}`);
  lines.push(`TOTAL: ${c}${(subtotal + tax).toFixed(2)}`);
  if (inv.paymentTerms) lines.push('', `Payment terms: ${inv.paymentTerms}`);
  if (inv.notes) lines.push(inv.notes);
  return lines.join('\n').trim();
}

export function bioToText(b: BioOutput): string {
  return b.variants
    .map((v) => `${v.length.toUpperCase()} (${v.text.length} chars)\n${RULE}\n${v.text}`)
    .join('\n\n');
}

export function productToText(p: ProductDescriptionOutput): string {
  const lines = [p.headline, '', p.description, ''];
  for (const b of p.bullets) lines.push(`  • ${b}`);
  if (p.seoKeywords.length) lines.push('', `SEO keywords: ${p.seoKeywords.join(', ')}`);
  return lines.join('\n').trim();
}

export function blogTitlesToText(b: BlogTitleOutput): string {
  return b.titles
    .map((t, i) => `${i + 1}. ${t.title}${t.style ? `  [${t.style}]` : ''}${t.rationale ? `\n   ${t.rationale}` : ''}`)
    .join('\n');
}

export function captionToText(s: SocialCaptionOutput): string {
  const lines: string[] = [];
  s.variants.forEach((v, i) => {
    lines.push(`VARIANT ${i + 1}${v.style ? ` — ${v.style}` : ''}`, RULE, v.caption, '');
  });
  if (s.hashtags.length) lines.push(s.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' '));
  return lines.join('\n').trim();
}

export function scriptToText(y: YouTubeScriptOutput): string {
  const lines: string[] = [];
  if (y.titleOptions.length) {
    lines.push('TITLE OPTIONS:');
    y.titleOptions.forEach((t, i) => lines.push(`  ${i + 1}. ${t}`));
    lines.push('');
  }
  lines.push('HOOK (0:00)', RULE, y.hook, '');
  for (const s of y.sections) {
    lines.push(`[${s.timestamp}] ${s.heading}`, RULE, s.content, '');
  }
  if (y.cta) lines.push('CALL TO ACTION', RULE, y.cta, '');
  if (y.description) lines.push('VIDEO DESCRIPTION', RULE, y.description, '');
  if (y.tags.length) lines.push(`Tags: ${y.tags.join(', ')}`);
  return lines.join('\n').trim();
}

/** Dispatch: structured output → plain text for any tool. */
export function toPlainText(toolId: ToolId, data: unknown): string {
  try {
    switch (toolId) {
      case 'resume-builder':
        return resumeToText(data as ResumeOutput);
      case 'cover-letter':
        return coverLetterToText(data as CoverLetterOutput);
      case 'email-writer':
        return emailToText(data as EmailOutput);
      case 'invoice-generator':
        return invoiceToText(data as InvoiceOutput);
      case 'bio-generator':
        return bioToText(data as BioOutput);
      case 'product-description':
        return productToText(data as ProductDescriptionOutput);
      case 'blog-title':
        return blogTitlesToText(data as BlogTitleOutput);
      case 'instagram-caption':
        return captionToText(data as SocialCaptionOutput);
      case 'cold-email':
        return coldEmailToText(data as ColdEmailOutput);
      case 'youtube-script':
        return scriptToText(data as YouTubeScriptOutput);
    }
  } catch {
    // Malformed data (e.g. old history entry): fall through to JSON dump.
  }
  return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

/** Trigger a browser download of plain text content. */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
