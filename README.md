# AI Career Tools - Premium AI-Powered Career Tools

A modern, production-ready AI tools website built with Next.js 14, Tailwind CSS, and Gemini API.

![AI Career Tools](https://via.placeholder.com/1200x630/0f0f23/8b5cf6?text=AI+Career+Tools)

## Features

### 10 Free AI Tools
- **AI Resume Builder** - Create ATS-optimized professional resumes
- **AI Cover Letter Writer** - Generate compelling cover letters
- **AI Email Writer** - Craft professional emails for any situation
- **AI Invoice Generator** - Create professional invoices
- **AI Bio Generator** - Generate engaging bios for any platform
- **AI Product Description Writer** - Write converting product descriptions
- **AI Blog Title Generator** - Create viral-worthy blog titles
- **AI Instagram Caption Writer** - Generate engaging captions
- **AI Cold Email Writer** - Write personalized cold emails
- **AI YouTube Script Writer** - Create engaging video scripts

### Premium Design
- Dark gradient theme with animated particles
- Glassmorphism UI effects
- Smooth animations and transitions
- Fully responsive design
- Mobile hamburger menu

### Monetization Features
- Free tier: 3 uses per tool per day
- Pro upgrade modal with feature list
- Usage tracking with progress indicator
- Affiliate banner (Gemini AI)
- Sticky promotional bar

### Output Formats
- **Resume**: Professional HTML resume with ATS score
- **Email**: Email client preview style
- **Invoice**: Professional invoice layout
- **Social**: Platform-specific previews (Instagram mockup)
- **Script**: YouTube script with timestamps

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-tools-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
4. Deploy!

## Project Structure

```
ai-tools-website/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # AI generation API
│   ├── globals.css           # Global styles + animations
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Homepage
│   └── tools/
│       └── [slug]/
│           ├── page.tsx      # Tool page
│           ├── OutputRenderer.tsx
│           └── ProModal.tsx
├── lib/
│   ├── gemini.ts             # Gemini API client
│   └── tools.ts              # Tool configurations
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **TypeScript**: For type safety
- **Fonts**: Inter (Google Fonts)

## Customization

### Adding New Tools
Add new tools to `lib/tools.ts` following the existing pattern:

```typescript
{
  id: 'new-tool',
  name: 'New Tool Name',
  slug: 'new-tool',
  description: 'Description',
  icon: '🔧',
  color: 'from-blue-500 to-cyan-500',
  outputFormat: 'text', // text | resume | email | invoice | social | script
  inputs: [...],
  promptTemplate: '...',
  metaTitle: '...',
  metaDescription: '...'
}
```

### AdSense Integration
Replace AdSense placeholders with your ad units:

```tsx
<ins className="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto">
</ins>
```

### Changing Usage Limits
Modify `FREE_LIMIT` in `app/tools/[slug]/page.tsx`:
```typescript
const FREE_LIMIT = 3; // Change to desired limit
```

## License

MIT License
