export interface Tool {
  id: string;
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
}

export const tools: Tool[] = [
  {
    id: 'resume-builder',
    name: 'AI Resume Builder',
    slug: 'resume-builder',
    description: 'Create a professional, ATS-optimized resume that stands out',
    icon: '📄',
    color: 'from-blue-500 to-cyan-500',
    outputFormat: 'resume',
    inputs: [
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true, tooltip: 'Your full legal name as you want it on your resume' },
      { name: 'email', label: 'Email Address', type: 'text', placeholder: 'john.doe@email.com', required: true, tooltip: 'Professional email address' },
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 123-4567', required: true, tooltip: 'Best number for recruiters to reach you' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA', required: false, tooltip: 'City and state/country' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'linkedin.com/in/johndoe', required: false },
      { name: 'jobTitle', label: 'Target Job Title', type: 'text', placeholder: 'Senior Software Engineer', required: true, tooltip: 'The position you are applying for' },
      { name: 'experience', label: 'Work Experience', type: 'textarea', placeholder: 'Job Title | Company | Dates\n- Led development of... (used Agile, mentored 5 junior devs)\n- Increased system efficiency by 40%\n\nJob Title | Company | Dates\n- Built REST APIs handling 1M+ requests/day', required: true, maxLength: 2000 },
      { name: 'education', label: 'Education', type: 'textarea', placeholder: 'Degree, University, Graduation Year\nGPA: 3.8/4.0 (optional)', required: true },
      { name: 'skills', label: 'Key Skills', type: 'textarea', placeholder: 'Technical: JavaScript, Python, React, Node.js\nTools: Git, Docker, AWS\nSoft: Leadership, Communication', required: true },
    ],
    promptTemplate: `Create a professional, ATS-optimized resume for {name}.

CONTACT INFO:
- Name: {name}
- Email: {email}
- Phone: {phone}
- Location: {location}
- LinkedIn: {linkedin}

TARGET POSITION: {jobTitle}

WORK EXPERIENCE:
{experience}

EDUCATION:
{education}

SKILLS:
{skills}

Create a modern, clean resume with:
1. Strong professional summary highlighting key achievements
2. Quantified achievements where possible (%, $, numbers)
3. ATS-friendly formatting with relevant keywords
4. Clean section hierarchy: Summary, Experience, Education, Skills
5. Action verbs at start of each bullet point
6. Remove any filler words - keep it concise`,
    metaTitle: 'Free AI Resume Builder - Create ATS-Optimized Resumes',
    metaDescription: 'Create a professional, ATS-optimized resume in seconds. Free AI resume builder with modern templates. No signup required.',
  },
  {
    id: 'cover-letter',
    name: 'AI Cover Letter Writer',
    slug: 'cover-letter',
    description: 'Generate compelling cover letters that get interviews',
    icon: '✉️',
    color: 'from-purple-500 to-pink-500',
    outputFormat: 'email',
    inputs: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Sarah Mitchell', required: true },
      { name: 'email', label: 'Your Email', type: 'text', placeholder: 'sarah.m@email.com', required: true },
      { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 987-6543', required: true },
      { name: 'jobTitle', label: 'Job Position', type: 'text', placeholder: 'Marketing Manager', required: true },
      { name: 'company', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { name: 'companyDesc', label: 'What You Know About The Company', type: 'textarea', placeholder: 'TechCorp is a leader in AI solutions, recently raised Series B funding...', required: false, tooltip: 'Shows you researched the company' },
      { name: 'experience', label: 'Your Relevant Experience', type: 'textarea', placeholder: '5 years in digital marketing, led campaigns increasing ROI by 150%...', required: true },
      { name: 'achievements', label: 'Key Achievements', type: 'textarea', placeholder: '- Increased social engagement by 300%\n- Managed $500K marketing budget\n- Built team of 10 marketers', required: true },
    ],
    promptTemplate: `Write a compelling cover letter in professional business letter format.

CANDIDATE:
- Name: {name}
- Email: {email}
- Phone: {phone}

POSITION:
- Job Title: {jobTitle}
- Company: {company}
- Company Research: {companyDesc}

CANDIDATE BACKGROUND:
- Experience: {experience}
- Key Achievements: {achievements}

Write a 3-4 paragraph cover letter that:
1. Opens with a hook about why this role excites you
2. Highlights specific achievements that match the role requirements
3. Shows knowledge of the company and its mission
4. Ends with a strong call to action

Use professional tone, specific examples, and quantifiable results.`,
    metaTitle: 'Free AI Cover Letter Writer - Professional Cover Letters',
    metaDescription: 'Generate professional cover letters that get interviews. Free AI cover letter generator with custom templates.',
  },
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
      { name: 'keyPoints', label: 'Key Points to Include', type: 'textarea', placeholder: 'I want to schedule a meeting to discuss the Q4 marketing strategy...', required: true },
      { name: 'cta', label: 'Desired Action', type: 'text', placeholder: 'Please confirm your availability for Thursday', required: false },
    ],
    promptTemplate: `Write a professional email in email client preview format.

TO: {recipient} {recipientTitle}
PURPOSE: {purpose}
TONE: {tone}
KEY POINTS: {keyPoints}
CALL TO ACTION: {cta}

Create an email with:
- Clear, concise subject line
- Professional greeting
- 2-3 short paragraphs max
- Clear call to action
- Professional sign-off`,
    metaTitle: 'Free AI Email Writer - Professional Email Generator',
    metaDescription: 'Write professional emails instantly with AI. Choose your tone and purpose. Free email writer for business.',
  },
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
      { name: 'businessAddress', label: 'Your Business Address', type: 'textarea', placeholder: '123 Creative Lane\nSan Francisco, CA 94102\nhello@acmedesign.com', required: false },
      { name: 'clientName', label: 'Client Name', type: 'text', placeholder: 'TechCorp Industries', required: true },
      { name: 'clientAddress', label: 'Client Address', type: 'textarea', placeholder: '456 Business Ave\nNew York, NY 10001', required: false },
      { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-2024-001', required: false },
      { name: 'service', label: 'Service/Product Details', type: 'textarea', placeholder: 'Website Design - Homepage + 5 pages\nSocial Media Graphics Package\nBrand Identity Package', required: true },
      { name: 'amount', label: 'Total Amount ($)', type: 'text', placeholder: '2500', required: true },
      { name: 'paymentTerms', label: 'Payment Terms', type: 'text', placeholder: 'Net 30 days', required: false },
    ],
    promptTemplate: `Create a professional invoice in HTML/invoice format.

FROM (YOUR BUSINESS):
- Business: {businessName}
- Address: {businessAddress}

TO (CLIENT):
- Name: {clientName}
- Address: {clientAddress}

INVOICE DETAILS:
- Invoice #: {invoiceNumber}
- Service: {service}
- Total: {amount}
- Payment Terms: {paymentTerms}

Create a clean, professional invoice with:
- Business header with logo placeholder
- Invoice number and dates
- Itemized table with descriptions and amounts
- Subtotal, tax (if applicable), total
- Payment instructions
- Professional footer`,
    metaTitle: 'Free AI Invoice Generator - Professional Invoices',
    metaDescription: 'Generate professional invoices instantly with AI. Perfect for freelancers and small businesses.',
  },
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
      { name: 'experience', label: 'Experience & Background', type: 'textarea', placeholder: '8 years in digital marketing, helped 200+ brands grow...', required: true },
      { name: 'achievements', label: 'Notable Achievements', type: 'textarea', placeholder: 'Forbes 30 Under 30, Speaker at Marketing Summit...', required: false },
      { name: 'style', label: 'Style', type: 'select', required: true, placeholder: '', options: ['Professional', 'Creative', 'Witty', 'Inspirational', 'Minimal'] },
    ],
    promptTemplate: `Create a {style} bio for {name}, a {profession}, for {platform}.

BACKGROUND: {experience}
ACHIEVEMENTS: {achievements}

Create 3 different bio versions optimized for {platform}:
1. Short version (under 150 characters)
2. Medium version (150-300 characters)
3. Long version (300-500 characters)

Show each as it would appear in a social media profile card.`,
    metaTitle: 'Free AI Bio Generator - Personal Bio Writer',
    metaDescription: 'Generate engaging bios for Twitter, LinkedIn, Instagram, and more. Free AI bio writer.',
  },
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
      { name: 'features', label: 'Key Features', type: 'textarea', placeholder: '- 40-hour battery life\n- Active noise cancellation\n- Premium leather cushions\n- Foldable design\n- USB-C charging', required: true },
      { name: 'price', label: 'Price', type: 'text', placeholder: '$299', required: false },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Remote workers, audiophiles, frequent travelers', required: false },
      { name: 'tone', label: 'Tone', type: 'select', required: true, placeholder: '', options: ['Persuasive', 'Professional', 'Luxurious', 'Playful', 'Educational'] },
    ],
    promptTemplate: `Write compelling product descriptions for "{productName}".

CATEGORY: {category}
FEATURES: {features}
PRICE: {price}
TARGET AUDIENCE: {audience}
TONE: {tone}

Create:
1. A hero product description (2-3 sentences) with emotional hooks
2. Feature highlights with benefits (not just specs)
3. An ecommerce-style card preview showing the product

Make it conversion-focused with strong benefit statements.`,
    metaTitle: 'Free AI Product Description Writer',
    metaDescription: 'Write compelling product descriptions that convert. Free AI tool for e-commerce and marketing.',
  },
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
    promptTemplate: `Generate 10 viral-worthy blog titles for: "{topic}"

NICHE: {niche}
TARGET AUDIENCE: {audience}
STYLE: {style}

For each title provide:
1. The title itself
2. Estimated engagement score (1-10)
3. Why it would perform well

Format as a clean list with engagement indicators.`,
    metaTitle: 'Free AI Blog Title Generator',
    metaDescription: 'Generate viral blog titles instantly. Free AI tool for bloggers and content creators.',
  },
  {
    id: 'instagram-caption',
    name: 'AI Instagram Caption Writer',
    slug: 'instagram-caption',
    description: 'Create engaging Instagram captions',
    icon: '📸',
    color: 'from-pink-500 to-rose-500',
    outputFormat: 'social',
    inputs: [
      { name: 'postContent', label: 'Post Content', type: 'textarea', placeholder: 'Sharing my morning routine, coffee + productivity hacks...', required: true },
      { name: 'theme', label: 'Theme/Vibe', type: 'select', required: true, placeholder: '', options: ['Motivational', 'Educational', 'Behind-the-scenes', 'Lifestyle', 'Business', 'Travel', 'Food', 'Fitness', 'Fashion', 'Tech'] },
      { name: 'hashtags', label: 'Hashtag Preference', type: 'select', required: true, placeholder: '', options: ['Include 10-15 relevant hashtags', 'Include 5-8 hashtags', 'Minimal (2-3)', 'None - mention in comments'] },
      { name: 'cta', label: 'Call to Action', type: 'select', required: false, placeholder: 'None', options: ['Share your thoughts', 'Tag a friend', 'Save for later', 'Link in bio', 'Double tap if you agree', 'Follow for more'] },
    ],
    promptTemplate: `Create an engaging Instagram caption for a {theme} post.

POST CONTENT: {postContent}
HASHTAG PREFERENCE: {hashtags}
CALL TO ACTION: {cta}

Create:
1. A captivating caption (2-3 paragraphs)
2. A set of 10-15 relevant hashtags
3. Show the preview as it would appear in an Instagram post mockup

Make it engaging, authentic, and platform-optimized.`,
    metaTitle: 'Free AI Instagram Caption Writer',
    metaDescription: 'Create viral Instagram captions instantly. Free AI tool for influencers and creators.',
  },
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
      { name: 'offer', label: 'What You\'re Offering', type: 'textarea', placeholder: 'Our SaaS tool helps companies increase email open rates by 40%...', required: true },
      { name: 'value', label: 'Value Proposition', type: 'textarea', placeholder: 'Save 10+ hours/week on email management...', required: false },
    ],
    promptTemplate: `Write a personalized cold email to {recipientName}, {recipientTitle} at {company}.

GOAL: {goal}
OFFER: {offer}
VALUE: {value}

Create:
1. A compelling subject line
2. A concise, personalized email (under 150 words)
3. Open rate prediction
4. Clear call to action

Make it personalized, value-driven, and easy to respond to.`,
    metaTitle: 'Free AI Cold Email Writer',
    metaDescription: 'Write personalized cold emails that get responses. Free AI outreach tool.',
  },
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
      { name: 'keyPoints', label: 'Key Points to Cover', type: 'textarea', placeholder: '1. Time blocking\n2. Pomodoro technique\n3. No meetings days\n4. AI tools for efficiency', required: true },
    ],
    promptTemplate: `Create a complete YouTube video script for: "{videoTitle}"

TYPE: {videoType}
DURATION: {duration}
TARGET AUDIENCE: {audience}
KEY POINTS: {keyPoints}

Create a full script with:
1. Hook (first 30 seconds to grab attention)
2. Introduction/Setup
3. Main content with timestamps for each section
4. Transitions between sections
5. Call to action (subscribe, like, comment)
6. End screen suggestions

Include [PAUSE], [B-ROLL], [GRAPHICS] cues where appropriate.`,
    metaTitle: 'Free AI YouTube Script Writer',
    metaDescription: 'Write engaging YouTube scripts in minutes. Free AI tool for YouTubers.',
  },
];
