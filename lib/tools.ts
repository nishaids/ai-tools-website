import type { ToolId } from './schemas';

export interface Tool {
  id: ToolId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  inputs: InputField[];
  promptTemplate: string;
  metaTitle: string;
  metaDescription: string;
  outputFormat: 'text' | 'resume' | 'email' | 'invoice' | 'social' | 'script';
  /** Split the form into steps (resume/cover letter). Fields carry a `step`. */
  multiStep?: boolean;
  /** One-click demo values for the "Try with sample data" button. */
  sampleData: Record<string, string>;
}

export interface InputField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
  tooltip?: string;
  maxLength?: number;
  /** 1-based step index for multi-step forms. */
  step?: number;
}

// Shared tail for every prompt — the strict JSON contract.
const JSON_RULES = `
OUTPUT RULES (critical):
- Respond with ONLY valid JSON matching the schema above. No markdown fences, no commentary, no text before or after the JSON.
- Every string must use plain text (no markdown syntax like ** or ##).
- Never invent contact details, employers, or credentials that were not provided.`;

export const tools: Tool[] = [
  // ==========================================================================
  // RESUME BUILDER
  // ==========================================================================
  {
    id: 'resume-builder',
    name: 'AI Resume Builder',
    slug: 'resume-builder',
    description: 'Create a professional, ATS-optimized resume that stands out',
    icon: '📄',
    color: 'from-blue-500 to-cyan-500',
    outputFormat: 'resume',
    multiStep: true,
    inputs: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true, step: 1, tooltip: 'Your full legal name as you want it on your resume' },
      { name: 'email', label: 'Email Address', type: 'text', placeholder: 'john.doe@email.com', required: true, step: 1, tooltip: 'Professional email address' },
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 123-4567', required: true, step: 1, tooltip: 'Best number for recruiters to reach you' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA', required: false, step: 1, tooltip: 'City and state/country' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'linkedin.com/in/johndoe', required: false, step: 1 },
      { name: 'experience', label: 'Work Experience', type: 'textarea', placeholder: 'Job Title | Company | Dates\n- Led development of... (used Agile, mentored 5 junior devs)\n- Increased system efficiency by 40%\n\nJob Title | Company | Dates\n- Built REST APIs handling 1M+ requests/day', required: true, step: 2, maxLength: 2000 },
      { name: 'education', label: 'Education', type: 'textarea', placeholder: 'Degree, University, Graduation Year\nGPA: 3.8/4.0 (optional)', required: true, step: 2, maxLength: 1000 },
      { name: 'jobTitle', label: 'Target Job Title', type: 'text', placeholder: 'Senior Software Engineer', required: true, step: 3, tooltip: 'The position you are applying for' },
      { name: 'skills', label: 'Key Skills', type: 'textarea', placeholder: 'Technical: JavaScript, Python, React, Node.js\nTools: Git, Docker, AWS\nSoft: Leadership, Communication', required: true, step: 3, maxLength: 1000 },
    ],
    sampleData: {
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      linkedin: 'linkedin.com/in/priyasharma',
      jobTitle: 'Senior Frontend Engineer',
      experience:
        'Frontend Engineer | Flipkart | 2021 - Present\n- Rebuilt the checkout flow in React, cut cart abandonment by 18%\n- Led migration to TypeScript across 12 packages, mentored 4 juniors\n\nWeb Developer | Zoho | 2019 - 2021\n- Shipped a dashboard used by 40K customers, improved load time 2.3s to 0.9s',
      education: 'B.Tech Computer Science, NIT Trichy, 2019\nGPA: 8.7/10',
      skills: 'Technical: React, TypeScript, Next.js, Node.js, GraphQL\nTools: Git, Docker, AWS, Figma\nSoft: Mentoring, Cross-team communication',
    },
    promptTemplate: `You are an expert resume writer and former Fortune 500 technical recruiter with 15+ years of experience writing resumes that pass ATS screening and impress hiring managers.

Create an ATS-optimized resume from the candidate data below.

CANDIDATE DATA:
- Name: {name}
- Email: {email}
- Phone: {phone}
- Location: {location}
- LinkedIn: {linkedin}
- Target position: {jobTitle}

WORK EXPERIENCE (raw notes):
{experience}

EDUCATION (raw notes):
{education}

SKILLS (raw notes):
{skills}

QUALITY RULES:
- Summary: 2-3 sentences, lead with years of experience and the single strongest quantified achievement, tailored to the target position. No first person ("I").
- Every experience bullet starts with a strong action verb (Led, Built, Reduced, Shipped, Drove). Never reuse the same verb twice in a row.
- Quantify wherever the raw notes allow (%, $, time saved, users, team size). Do not fabricate numbers not implied by the notes.
- Bullets are 8-20 words. 2-4 bullets per role.
- Banned clichés: "team player", "results-driven", "hard-working", "responsible for", "detail-oriented", "go-getter".
- Example of a BAD bullet: "Responsible for working on the checkout system". Example of a GOOD bullet: "Rebuilt checkout flow in React, cutting cart abandonment 18% across 2M monthly sessions".
- header.title: a professional headline matching the target position (e.g. "Senior Frontend Engineer").
- atsKeywords: 8-15 keywords/phrases an ATS would scan for in the target role (hard skills first). Weave the most important ones naturally into the summary and bullets.
- Sort experience most recent first.

Respond with ONLY valid JSON matching this exact schema:
{
  "header": { "name": string, "title": string, "email": string, "phone": string, "location": string (optional), "linkedin": string (optional) },
  "summary": string,
  "experience": [ { "role": string, "company": string, "dates": string, "bullets": [string] } ],
  "education": [ { "degree": string, "institution": string, "year": string, "details": string (optional) } ],
  "skills": { "technical": [string], "tools": [string], "soft": [string] },
  "atsKeywords": [string]
}
${JSON_RULES}`,
    metaTitle: 'Free AI Resume Builder - Create ATS-Optimized Resumes',
    metaDescription: 'Create a professional, ATS-optimized resume in seconds. Free AI resume builder with modern templates. No signup required.',
  },

  // ==========================================================================
  // COVER LETTER
  // ==========================================================================
  {
    id: 'cover-letter',
    name: 'AI Cover Letter Writer',
    slug: 'cover-letter',
    description: 'Generate compelling cover letters that get interviews',
    icon: '✉️',
    color: 'from-purple-500 to-pink-500',
    outputFormat: 'email',
    multiStep: true,
    inputs: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Sarah Mitchell', required: true, step: 1 },
      { name: 'email', label: 'Your Email', type: 'text', placeholder: 'sarah.m@email.com', required: true, step: 1 },
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 987-6543', required: true, step: 1 },
      { name: 'jobTitle', label: 'Job Position', type: 'text', placeholder: 'Marketing Manager', required: true, step: 2 },
      { name: 'company', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true, step: 2 },
      { name: 'companyDesc', label: 'What You Know About The Company', type: 'textarea', placeholder: 'TechCorp is a leader in AI solutions, recently raised Series B funding...', required: false, step: 2, maxLength: 1000, tooltip: 'Shows you researched the company' },
      { name: 'experience', label: 'Your Relevant Experience', type: 'textarea', placeholder: '5 years in digital marketing, led campaigns increasing ROI by 150%...', required: true, step: 3, maxLength: 1500 },
      { name: 'achievements', label: 'Key Achievements', type: 'textarea', placeholder: '- Increased social engagement by 300%\n- Managed $500K marketing budget\n- Built team of 10 marketers', required: true, step: 3, maxLength: 1500 },
    ],
    sampleData: {
      name: 'Sarah Mitchell',
      email: 'sarah.m@email.com',
      phone: '+1 (555) 987-6543',
      jobTitle: 'Marketing Manager',
      company: 'TechCorp Inc.',
      companyDesc: 'TechCorp is a leader in AI solutions, recently raised Series B funding and is expanding into Europe.',
      experience: '5 years in digital marketing, led multi-channel campaigns increasing ROI by 150%, managed a team of 6.',
      achievements: '- Increased social engagement by 300%\n- Managed $500K marketing budget\n- Built team of 10 marketers',
    },
    promptTemplate: `You are an expert career coach and professional writer who has written thousands of interview-winning cover letters.

Write a cover letter from the data below.

CANDIDATE:
- Name: {name}
- Email: {email}
- Phone: {phone}

POSITION:
- Job title: {jobTitle}
- Company: {company}
- Company research: {companyDesc}

BACKGROUND:
- Experience: {experience}
- Key achievements: {achievements}

QUALITY RULES:
- 3-4 body paragraphs, ~250-350 words total.
- Paragraph 1: a specific hook about the role/company — never "I am writing to apply for".
- Middle paragraphs: 2-3 concrete, quantified achievements mapped to what the role needs.
- Reference the company research naturally (if provided) to show genuine interest.
- Final paragraph: confident call to action requesting an interview.
- Banned clichés: "team player", "perfect fit", "passionate", "dynamic", "I believe".
- Confident, warm, specific. No generic filler.
- salutation: "Dear Hiring Manager," unless a recipient name is known.

Respond with ONLY valid JSON matching this exact schema:
{
  "sender": { "name": string, "email": string, "phone": string },
  "recipient": { "name": string (optional), "title": string (optional), "company": string },
  "salutation": string,
  "bodyParagraphs": [string],
  "closing": string,
  "signature": string
}
${JSON_RULES}`,
    metaTitle: 'Free AI Cover Letter Writer - Professional Cover Letters',
    metaDescription: 'Generate professional cover letters that get interviews. Free AI cover letter generator with custom templates.',
  },

  // ==========================================================================
  // EMAIL WRITER
  // ==========================================================================
  {
    id: 'email-writer',
    name: 'AI Email Writer',
    slug: 'email-writer',
    description: 'Craft professional emails for any situation',
    icon: '📧',
    color: 'from-green-500 to-emerald-500',
    outputFormat: 'email',
    inputs: [
      { name: 'recipient', label: 'Recipient Name', type: 'text', placeholder: 'John Smith', required: true },
      { name: 'recipientTitle', label: 'Recipient Title', type: 'text', placeholder: 'Director of Operations', required: false },
      { name: 'purpose', label: 'Email Purpose', type: 'select', required: true, placeholder: '', options: ['Professional inquiry', 'Follow-up', 'Thank you note', 'Apology', 'Request', 'Introduction', 'Meeting request', 'Job application', 'Networking'] },
      { name: 'tone', label: 'Tone', type: 'select', required: true, placeholder: '', options: ['Professional', 'Friendly', 'Formal', 'Casual', 'Assertive'] },
      { name: 'keyPoints', label: 'Key Points to Include', type: 'textarea', placeholder: 'I want to schedule a meeting to discuss the Q4 marketing strategy...', required: true, maxLength: 1500 },
      { name: 'cta', label: 'Desired Action', type: 'text', placeholder: 'Please confirm your availability for Thursday', required: false },
    ],
    sampleData: {
      recipient: 'John Smith',
      recipientTitle: 'Director of Operations',
      purpose: 'Meeting request',
      tone: 'Professional',
      keyPoints: 'I want to schedule a 30-minute meeting next week to discuss the Q4 marketing strategy and align on the budget before the planning deadline.',
      cta: 'Please confirm your availability for Thursday',
    },
    promptTemplate: `You are an executive communications specialist who writes clear, effective business emails.

Write an email from the data below.

TO: {recipient} ({recipientTitle})
PURPOSE: {purpose}
TONE: {tone}
KEY POINTS: {keyPoints}
DESIRED ACTION: {cta}

QUALITY RULES:
- Subject line: specific and under 60 characters — the recipient should know exactly why to open it.
- 2-3 short paragraphs, under 150 words total. Front-load the ask.
- One clear call to action, never two.
- Match the requested tone precisely.
- No filler openers like "I hope this email finds you well" unless the tone is Formal.

Respond with ONLY valid JSON matching this exact schema:
{
  "subject": string,
  "greeting": string,
  "bodyParagraphs": [string],
  "signOff": string,
  "signature": string
}
${JSON_RULES}`,
    metaTitle: 'Free AI Email Writer - Professional Email Generator',
    metaDescription: 'Write professional emails instantly with AI. Choose your tone and purpose. Free email writer for business.',
  },

  // ==========================================================================
  // INVOICE GENERATOR
  // ==========================================================================
  {
    id: 'invoice-generator',
    name: 'AI Invoice Generator',
    slug: 'invoice-generator',
    description: 'Create professional invoices in seconds',
    icon: '💰',
    color: 'from-yellow-500 to-orange-500',
    outputFormat: 'invoice',
    inputs: [
      { name: 'businessName', label: 'Your Business Name', type: 'text', placeholder: 'Acme Design Studio', required: true },
      { name: 'businessAddress', label: 'Your Business Address', type: 'textarea', placeholder: '123 Creative Lane\nSan Francisco, CA 94102\nhello@acmedesign.com', required: false, maxLength: 500 },
      { name: 'clientName', label: 'Client Name', type: 'text', placeholder: 'TechCorp Industries', required: true },
      { name: 'clientAddress', label: 'Client Address', type: 'textarea', placeholder: '456 Business Ave\nNew York, NY 10001', required: false, maxLength: 500 },
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-2026-001', required: false },
      { name: 'service', label: 'Service/Product Details', type: 'textarea', placeholder: 'Website Design - Homepage + 5 pages - $1500\nSocial Media Graphics Package - $600\nBrand Identity Package - $400', required: true, maxLength: 1500 },
      { name: 'amount', label: 'Total Amount ($)', type: 'text', placeholder: '2500', required: true },
      { name: 'paymentTerms', label: 'Payment Terms', type: 'text', placeholder: 'Net 30 days', required: false },
    ],
    sampleData: {
      businessName: 'Acme Design Studio',
      businessAddress: '123 Creative Lane\nSan Francisco, CA 94102\nhello@acmedesign.com',
      clientName: 'TechCorp Industries',
      clientAddress: '456 Business Ave\nNew York, NY 10001',
      invoiceNumber: 'INV-2026-014',
      service: 'Website Design - Homepage + 5 pages - $1500\nSocial Media Graphics Package - $600\nBrand Identity Package - $400',
      amount: '2500',
      paymentTerms: 'Net 30 days',
    },
    promptTemplate: `You are a professional bookkeeper who prepares clean, accurate invoices.

Prepare an invoice from the data below.

FROM (seller):
- Business: {businessName}
- Address: {businessAddress}

TO (client):
- Name: {clientName}
- Address: {clientAddress}

DETAILS:
- Invoice number: {invoiceNumber} (generate one like "INV-<year>-<3 digits>" if not provided)
- Services (raw notes, may include per-item prices): {service}
- Stated total: {amount}
- Payment terms: {paymentTerms}

QUALITY RULES:
- Split the services into individual line items with professional descriptions. Infer quantity (default 1) and per-item rate; item amounts must sum to the stated total. If the notes give no per-item prices, distribute the total sensibly.
- Amounts are plain numbers (no currency symbols inside numbers).
- issueDate: today's date in "MMM D, YYYY" style; dueDate derived from payment terms (default Net 30).
- taxRate 0 unless the notes mention tax; subtotal + taxAmount must equal total.
- notes: one short professional thank-you / payment instruction line.

Respond with ONLY valid JSON matching this exact schema:
{
  "invoiceNumber": string,
  "issueDate": string,
  "dueDate": string,
  "currency": string (symbol, e.g. "$"),
  "from": { "name": string, "addressLines": [string] },
  "to": { "name": string, "addressLines": [string] },
  "items": [ { "description": string, "quantity": number, "rate": number, "amount": number } ],
  "subtotal": number,
  "taxRate": number,
  "taxAmount": number,
  "total": number,
  "paymentTerms": string (optional),
  "notes": string (optional)
}
${JSON_RULES}`,
    metaTitle: 'Free AI Invoice Generator - Professional Invoices',
    metaDescription: 'Generate professional invoices instantly with AI. Perfect for freelancers and small businesses.',
  },

  // ==========================================================================
  // BIO GENERATOR
  // ==========================================================================
  {
    id: 'bio-generator',
    name: 'AI Bio Generator',
    slug: 'bio-generator',
    description: 'Create engaging bios for any platform',
    icon: '👤',
    color: 'from-indigo-500 to-violet-500',
    outputFormat: 'social',
    inputs: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Alex Rivera', required: true },
      { name: 'profession', label: 'Profession/Title', type: 'text', placeholder: 'Digital Marketing Strategist', required: true },
      { name: 'platform', label: 'Platform', type: 'select', required: true, placeholder: '', options: ['Twitter/X', 'LinkedIn', 'Instagram', 'Personal Website', 'Speaker Bio', 'Guest Post Bio', 'Clubhouse', 'TikTok'] },
      { name: 'experience', label: 'Experience & Background', type: 'textarea', placeholder: '8 years in digital marketing, helped 200+ brands grow...', required: true, maxLength: 1000 },
      { name: 'achievements', label: 'Notable Achievements', type: 'textarea', placeholder: 'Forbes 30 Under 30, Speaker at Marketing Summit...', required: false, maxLength: 1000 },
      { name: 'style', label: 'Style', type: 'select', required: true, placeholder: '', options: ['Professional', 'Creative', 'Witty', 'Inspirational', 'Minimal'] },
    ],
    sampleData: {
      name: 'Alex Rivera',
      profession: 'Digital Marketing Strategist',
      platform: 'LinkedIn',
      experience: '8 years in digital marketing, helped 200+ brands grow, specializing in organic growth and content strategy.',
      achievements: 'Forbes 30 Under 30, Speaker at Marketing Summit 2025, grew a newsletter to 80K subscribers.',
      style: 'Professional',
    },
    promptTemplate: `You are a personal branding expert who writes bios that make people memorable in seconds.

Write bios for the person below.

- Name: {name}
- Profession: {profession}
- Platform: {platform}
- Background: {experience}
- Achievements: {achievements}
- Style: {style}

QUALITY RULES:
- Create exactly 3 variants: "Short" (under 150 characters), "Medium" (150-300 characters), "Long" (300-500 characters).
- Each variant must respect {platform} conventions (e.g. first person for LinkedIn, third person for Speaker Bio, punchy fragments for Twitter/X).
- Lead with the most credibility-building fact. Specifics beat adjectives: "helped 200+ brands" beats "experienced marketer".
- Match the {style} style throughout. No hashtag spam; at most 1 emoji and only if the style/platform suits it.

Respond with ONLY valid JSON matching this exact schema:
{
  "variants": [ { "length": "Short" | "Medium" | "Long", "text": string } ]
}
${JSON_RULES}`,
    metaTitle: 'Free AI Bio Generator - Personal Bio Writer',
    metaDescription: 'Generate engaging bios for Twitter, LinkedIn, Instagram, and more. Free AI bio writer.',
  },

  // ==========================================================================
  // PRODUCT DESCRIPTION
  // ==========================================================================
  {
    id: 'product-description',
    name: 'AI Product Description Writer',
    slug: 'product-description',
    description: 'Write product descriptions that convert',
    icon: '🛍️',
    color: 'from-rose-500 to-red-500',
    outputFormat: 'social',
    inputs: [
      { name: 'productName', label: 'Product Name', type: 'text', placeholder: 'Wireless Pro Headphones', required: true },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'Consumer Electronics/Audio', required: false },
      { name: 'features', label: 'Key Features', type: 'textarea', placeholder: '- 40-hour battery life\n- Active noise cancellation\n- Premium leather cushions\n- Foldable design\n- USB-C charging', required: true, maxLength: 1500 },
      { name: 'price', label: 'Price', type: 'text', placeholder: '$299', required: false },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Remote workers, audiophiles, frequent travelers', required: false },
      { name: 'tone', label: 'Tone', type: 'select', required: true, placeholder: '', options: ['Persuasive', 'Professional', 'Luxurious', 'Playful', 'Educational'] },
    ],
    sampleData: {
      productName: 'Wireless Pro Headphones',
      category: 'Consumer Electronics/Audio',
      features: '- 40-hour battery life\n- Active noise cancellation\n- Premium leather cushions\n- Foldable design\n- USB-C fast charging',
      price: '$299',
      audience: 'Remote workers, audiophiles, frequent travelers',
      tone: 'Persuasive',
    },
    promptTemplate: `You are a senior e-commerce copywriter with 15+ years of experience writing product pages that convert.

Write conversion-focused copy for the product below.

- Product: {productName}
- Category: {category}
- Features (raw): {features}
- Price: {price}
- Target audience: {audience}
- Tone: {tone}

QUALITY RULES:
- headline: under 70 characters, benefit-led, no generic hype ("amazing", "best ever").
- description: 2-3 sentences selling the transformation, not the spec sheet. Speak to {audience}.
- bullets: convert each feature into a benefit statement ("40-hour battery" -> "Four full workdays of listening on one charge"). One line each, 5-8 bullets.
- Example of BAD copy: "High quality headphones with great features". Example of GOOD copy: "Silence the office and hear every detail of your mix — noise cancellation tuned for the 9-to-5".
- seoKeywords: 6-10 search phrases buyers would actually type.

Respond with ONLY valid JSON matching this exact schema:
{
  "headline": string,
  "description": string,
  "bullets": [string],
  "seoKeywords": [string]
}
${JSON_RULES}`,
    metaTitle: 'Free AI Product Description Writer',
    metaDescription: 'Write compelling product descriptions that convert. Free AI tool for e-commerce and marketing.',
  },

  // ==========================================================================
  // BLOG TITLE
  // ==========================================================================
  {
    id: 'blog-title',
    name: 'AI Blog Title Generator',
    slug: 'blog-title',
    description: 'Generate viral-worthy blog titles',
    icon: '📝',
    color: 'from-teal-500 to-cyan-500',
    outputFormat: 'text',
    inputs: [
      { name: 'topic', label: 'Blog Topic', type: 'text', placeholder: 'How to start a successful podcast', required: true },
      { name: 'niche', label: 'Niche/Industry', type: 'text', placeholder: 'Content creation, marketing, entrepreneurship', required: false },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Aspiring podcasters, content creators', required: false },
      { name: 'style', label: 'Title Style', type: 'select', required: true, placeholder: '', options: ['Listicle', 'How-to', 'Question', 'Ultimate Guide', 'Trends', 'Contrarian', 'Story-driven'] },
    ],
    sampleData: {
      topic: 'How to start a successful podcast',
      niche: 'Content creation',
      audience: 'Aspiring podcasters, content creators',
      style: 'Listicle',
    },
    promptTemplate: `You are a viral content strategist who has written headlines for publications with 100M+ monthly readers.

Generate 10 blog titles for the topic below.

- Topic: {topic}
- Niche: {niche}
- Audience: {audience}
- Preferred style: {style}

QUALITY RULES:
- At least 5 titles in the preferred style; the rest may explore other proven styles (label each).
- 40-65 characters each (SEO-safe). Use concrete numbers and specificity; odd numbers outperform even.
- No clickbait that the article couldn't deliver; no ALL CAPS; no more than one "?" title.
- rationale: one short sentence on why the title earns the click.

Respond with ONLY valid JSON matching this exact schema:
{
  "titles": [ { "title": string, "style": string, "rationale": string } ]
}
${JSON_RULES}`,
    metaTitle: 'Free AI Blog Title Generator',
    metaDescription: 'Generate viral blog titles instantly. Free AI tool for bloggers and content creators.',
  },

  // ==========================================================================
  // INSTAGRAM CAPTION
  // ==========================================================================
  {
    id: 'instagram-caption',
    name: 'AI Instagram Caption Writer',
    slug: 'instagram-caption',
    description: 'Create engaging Instagram captions',
    icon: '📸',
    color: 'from-pink-500 to-rose-500',
    outputFormat: 'social',
    inputs: [
      { name: 'postContent', label: 'Post Content', type: 'textarea', placeholder: 'Sharing my morning routine, coffee + productivity hacks...', required: true, maxLength: 1000 },
      { name: 'theme', label: 'Theme/Vibe', type: 'select', required: true, placeholder: '', options: ['Motivational', 'Educational', 'Behind-the-scenes', 'Lifestyle', 'Business', 'Travel', 'Food', 'Fitness', 'Fashion', 'Tech'] },
      { name: 'hashtags', label: 'Hashtag Preference', type: 'select', required: true, placeholder: '', options: ['Include 10-15 relevant hashtags', 'Include 5-8 hashtags', 'Minimal (2-3)', 'None - mention in comments'] },
      { name: 'cta', label: 'Call to Action', type: 'select', required: false, placeholder: 'None', options: ['Share your thoughts', 'Tag a friend', 'Save for later', 'Link in bio', 'Double tap if you agree', 'Follow for more'] },
    ],
    sampleData: {
      postContent: 'Sharing my morning routine: 5am wake-up, journaling, coffee, then 2 hours of deep work before checking my phone.',
      theme: 'Motivational',
      hashtags: 'Include 5-8 hashtags',
      cta: 'Save for later',
    },
    promptTemplate: `You are a social media strategist who has grown multiple Instagram accounts past 1M followers.

Write Instagram captions for the post below.

- Post content: {postContent}
- Theme/vibe: {theme}
- Hashtag preference: {hashtags}
- Call to action: {cta}

QUALITY RULES:
- hook: the first line of the caption — under 125 characters (that's all Instagram shows before "...more"). It must stop the scroll.
- Create exactly 3 caption variants with different angles (e.g. "Storytelling", "Punchy", "Question-led"). Label each. 2-3 short paragraphs each, line breaks for readability, total under 2200 characters.
- Each caption naturally works in the call to action.
- hashtags: match the requested quantity, mix reach sizes (2-3 big, rest niche), all lowercase, no "#" symbol in the JSON values.
- Authentic voice, max 3 emojis per caption. No engagement-bait spam.

Respond with ONLY valid JSON matching this exact schema:
{
  "hook": string,
  "variants": [ { "style": string, "caption": string } ],
  "hashtags": [string],
  "cta": string
}
${JSON_RULES}`,
    metaTitle: 'Free AI Instagram Caption Writer',
    metaDescription: 'Create viral Instagram captions instantly. Free AI tool for influencers and creators.',
  },

  // ==========================================================================
  // COLD EMAIL
  // ==========================================================================
  {
    id: 'cold-email',
    name: 'AI Cold Email Writer',
    slug: 'cold-email',
    description: 'Write personalized cold emails that get responses',
    icon: '📬',
    color: 'from-slate-500 to-gray-600',
    outputFormat: 'email',
    inputs: [
      { name: 'recipientName', label: 'Recipient Name', type: 'text', placeholder: 'Jane Smith', required: true },
      { name: 'recipientTitle', label: 'Recipient Title', type: 'text', placeholder: 'VP of Marketing', required: false },
      { name: 'company', label: 'Company', type: 'text', placeholder: 'Tech Innovations Inc.', required: false },
      { name: 'goal', label: 'Email Goal', type: 'select', required: true, placeholder: '', options: ['Sales outreach', 'Partnership inquiry', 'Collaboration', 'Media/PR', 'Job opportunity', 'Investment'] },
      { name: 'offer', label: "What You're Offering", type: 'textarea', placeholder: 'Our SaaS tool helps companies increase email open rates by 40%...', required: true, maxLength: 1000 },
      { name: 'value', label: 'Value Proposition', type: 'textarea', placeholder: 'Save 10+ hours/week on email management...', required: false, maxLength: 1000 },
    ],
    sampleData: {
      recipientName: 'Jane Smith',
      recipientTitle: 'VP of Marketing',
      company: 'Tech Innovations Inc.',
      goal: 'Sales outreach',
      offer: 'Our SaaS tool helps B2B companies increase email open rates by 40% using AI-driven send-time optimization.',
      value: 'Save 10+ hours/week on email management; customers see results within 2 weeks.',
    },
    promptTemplate: `You are a cold outreach expert whose emails consistently get 30%+ reply rates.

Write a cold email from the data below.

- Recipient: {recipientName}, {recipientTitle} at {company}
- Goal: {goal}
- Offer: {offer}
- Value proposition: {value}

QUALITY RULES:
- 3 subject line variants: under 45 characters, lowercase-casual or specific-curious, no clickbait, no "quick question".
- Body under 120 words: 1 personalized opener referencing their role/company, 1-2 sentences of concrete value (numbers > adjectives), 1 low-friction CTA (e.g. "worth a 15-min chat?").
- Never open with "My name is" or "I hope this finds you well".
- Write like a human: short sentences, no corporate jargon.
- followUp: a 2-sentence bump email to send after delayDays (default 3), referencing the first email lightly.

Respond with ONLY valid JSON matching this exact schema:
{
  "subjectVariants": [string],
  "greeting": string,
  "bodyParagraphs": [string],
  "cta": string,
  "signOff": string,
  "followUp": { "delayDays": number, "subject": string, "body": string }
}
${JSON_RULES}`,
    metaTitle: 'Free AI Cold Email Writer',
    metaDescription: 'Write personalized cold emails that get responses. Free AI outreach tool.',
  },

  // ==========================================================================
  // YOUTUBE SCRIPT
  // ==========================================================================
  {
    id: 'youtube-script',
    name: 'AI YouTube Script Writer',
    slug: 'youtube-script',
    description: 'Create engaging YouTube video scripts',
    icon: '🎬',
    color: 'from-red-500 to-orange-500',
    outputFormat: 'script',
    inputs: [
      { name: 'videoTitle', label: 'Video Title/Topic', type: 'text', placeholder: '10 Tips for Better Productivity', required: true },
      { name: 'videoType', label: 'Video Type', type: 'select', required: true, placeholder: '', options: ['Tutorial/How-to', 'Educational', 'Entertainment', 'Vlog', 'Product Review', 'Interview', 'Explainer', 'Reaction'] },
      { name: 'duration', label: 'Duration', type: 'select', required: true, placeholder: '', options: ['Under 5 min', '5-10 min', '10-15 min', '15-20 min', '20+ min'] },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Entrepreneurs, remote workers, students', required: false },
      { name: 'keyPoints', label: 'Key Points to Cover', type: 'textarea', placeholder: '1. Time blocking\n2. Pomodoro technique\n3. No meetings days\n4. AI tools for efficiency', required: true, maxLength: 1500 },
    ],
    sampleData: {
      videoTitle: '10 Tips for Better Productivity',
      videoType: 'Educational',
      duration: '10-15 min',
      audience: 'Entrepreneurs, remote workers, students',
      keyPoints: '1. Time blocking\n2. Pomodoro technique\n3. No-meetings days\n4. AI tools for efficiency',
    },
    promptTemplate: `You are a YouTube scriptwriter for channels with millions of subscribers, expert in retention-driven storytelling.

Write a complete video script from the data below.

- Video: {videoTitle}
- Type: {videoType}
- Target duration: {duration}
- Audience: {audience}
- Key points to cover: {keyPoints}

QUALITY RULES:
- titleOptions: 3 clickable-but-honest title variants under 60 characters.
- hook: the first 30 seconds, word-for-word. Open a curiosity gap, preview the payoff, no channel intro before the hook.
- sections: one per key point plus an intro; each with a running timestamp ("0:00", "0:45", ...) scaled to the target duration, a short heading, and the spoken script. Include [B-ROLL], [GRAPHICS], [PAUSE] cues inline where they help. Conversational, second person, short sentences.
- Add a transition sentence at the end of each section that teases the next.
- cta: a natural subscribe/comment ask tied to the content, not a generic plea.
- description: 2-3 sentence upload-ready video description with a hook first line.
- tags: 10-15 search tags, lowercase.

Respond with ONLY valid JSON matching this exact schema:
{
  "titleOptions": [string],
  "hook": string,
  "sections": [ { "timestamp": string, "heading": string, "content": string } ],
  "cta": string,
  "description": string,
  "tags": [string]
}
${JSON_RULES}`,
    metaTitle: 'Free AI YouTube Script Writer',
    metaDescription: 'Write engaging YouTube scripts in minutes. Free AI tool for YouTubers.',
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
