import type { CoverLetterOutput, ResumeOutput } from '../schemas';

/**
 * Client-side .docx export for resume and cover letter, built from the
 * structured JSON via the `docx` package (dynamically imported so it never
 * lands in the main bundle).
 */

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ACCENT = '2563EB'; // blue-600
const GRAY = '555555';

export async function exportResumeDocx(resume: ResumeOutput): Promise<void> {
  const docx = await import('docx');
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = docx;

  const children: InstanceType<typeof Paragraph>[] = [];

  // Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: resume.header.name, bold: true, size: 44, font: 'Calibri' })],
    })
  );
  if (resume.header.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: resume.header.title, size: 24, color: ACCENT, font: 'Calibri' })],
      })
    );
  }
  const contact = [resume.header.email, resume.header.phone, resume.header.location, resume.header.linkedin]
    .filter(Boolean)
    .join('  |  ');
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: contact, size: 18, color: GRAY, font: 'Calibri' })],
    })
  );

  const sectionHeading = (text: string) =>
    new Paragraph({
      spacing: { before: 240, after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: ACCENT, font: 'Calibri' })],
    });

  if (resume.summary) {
    children.push(sectionHeading('Professional Summary'));
    children.push(
      new Paragraph({ children: [new TextRun({ text: resume.summary, size: 21, font: 'Calibri' })] })
    );
  }

  if (resume.experience.length) {
    children.push(sectionHeading('Experience'));
    for (const exp of resume.experience) {
      children.push(
        new Paragraph({
          spacing: { before: 120 },
          children: [
            new TextRun({ text: exp.role, bold: true, size: 22, font: 'Calibri' }),
            new TextRun({ text: `  —  ${exp.company}`, size: 21, font: 'Calibri' }),
            new TextRun({ text: `   ${exp.dates}`, size: 19, color: GRAY, italics: true, font: 'Calibri' }),
          ],
        })
      );
      for (const bullet of exp.bullets) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: bullet, size: 21, font: 'Calibri' })],
          })
        );
      }
    }
  }

  if (resume.education.length) {
    children.push(sectionHeading('Education'));
    for (const edu of resume.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: `, ${edu.institution}`, size: 21, font: 'Calibri' }),
            new TextRun({ text: `   ${edu.year}`, size: 19, color: GRAY, font: 'Calibri' }),
          ],
        })
      );
      if (edu.details) {
        children.push(
          new Paragraph({ children: [new TextRun({ text: edu.details, size: 19, color: GRAY, font: 'Calibri' })] })
        );
      }
    }
  }

  const { technical, tools, soft } = resume.skills;
  if (technical.length + tools.length + soft.length > 0) {
    children.push(sectionHeading('Skills'));
    const addSkillLine = (label: string, items: string[]) => {
      if (!items.length) return;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${label}: `, bold: true, size: 21, font: 'Calibri' }),
            new TextRun({ text: items.join(', '), size: 21, font: 'Calibri' }),
          ],
        })
      );
    };
    addSkillLine('Technical', technical);
    addSkillLine('Tools', tools);
    addSkillLine('Soft skills', soft);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 810, right: 810 } }, // ~0.5-0.56"
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = resume.header.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'resume';
  downloadBlob(blob, `${safeName}-resume.docx`);
}

export async function exportCoverLetterDocx(letter: CoverLetterOutput): Promise<void> {
  const docx = await import('docx');
  const { Document, Packer, Paragraph, TextRun } = docx;

  const body = (text: string, opts: { bold?: boolean; after?: number } = {}) =>
    new Paragraph({
      spacing: { after: opts.after ?? 160 },
      children: [new TextRun({ text, size: 22, bold: opts.bold, font: 'Calibri' })],
    });

  const children: InstanceType<typeof Paragraph>[] = [];

  children.push(body(letter.sender.name, { bold: true, after: 40 }));
  children.push(body([letter.sender.email, letter.sender.phone].filter(Boolean).join(' | '), { after: 240 }));
  children.push(
    body(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), { after: 240 })
  );

  const recipientLines = [letter.recipient.name, letter.recipient.title, letter.recipient.company].filter(
    (line): line is string => Boolean(line)
  );
  recipientLines.forEach((line, i) =>
    children.push(body(line, { after: i === recipientLines.length - 1 ? 240 : 40 }))
  );

  children.push(body(letter.salutation, { after: 200 }));
  for (const paragraph of letter.bodyParagraphs) {
    children.push(body(paragraph, { after: 200 }));
  }
  children.push(body(letter.closing, { after: 40 }));
  children.push(body(letter.signature, { bold: true }));

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } }, // 0.75"
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = letter.sender.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'cover-letter';
  downloadBlob(blob, `${safeName}-cover-letter.docx`);
}
