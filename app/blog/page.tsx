import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Career Tips & AI Insights | AI Career Tools',
  description: 'Expert career advice, resume tips, cover letter guidance, and insights on how AI is transforming the job search process. Stay ahead with our comprehensive blog.',
  keywords: 'career blog, job search tips, resume advice, cover letter tips, AI career tools, job application tips',
};

const articles = [
  {
    slug: 'how-to-write-a-perfect-resume-in-2025',
    title: 'How to Write a Perfect Resume in 2025',
    excerpt: 'Discover the essential strategies and formatting tips for creating a resume that stands out in 2025. Learn what recruiters are looking for and how to optimize your resume for ATS systems.',
    date: 'March 15, 2025',
    readTime: '8 min read',
    category: 'Resume Tips',
  },
  {
    slug: '10-tips-for-a-great-cover-letter',
    title: '10 Tips for a Great Cover Letter',
    excerpt: 'Master the art of writing compelling cover letters that capture attention and land interviews. These proven strategies will help you stand out from other applicants.',
    date: 'March 10, 2025',
    readTime: '6 min read',
    category: 'Cover Letters',
  },
  {
    slug: 'how-ai-is-changing-job-applications',
    title: 'How AI is Changing Job Applications',
    excerpt: 'Explore how artificial intelligence is revolutionizing the hiring process, from resume screening to interview preparation. Learn how to leverage AI tools to boost your chances.',
    date: 'March 5, 2025',
    readTime: '7 min read',
    category: 'AI & Technology',
  },
  {
    slug: 'best-free-tools-for-job-seekers',
    title: 'Best Free Tools for Job Seekers in 2025',
    excerpt: 'Save money while advancing your career with these top free tools for resume building, job searching, interview prep, and professional development.',
    date: 'February 28, 2025',
    readTime: '5 min read',
    category: 'Resources',
  },
  {
    slug: 'how-to-write-a-professional-email',
    title: 'How to Write a Professional Email: Complete Guide',
    excerpt: 'Learn the essential rules and best practices for writing professional emails that get responses. From subject lines to signatures, master every aspect of business communication.',
    date: 'February 20, 2025',
    readTime: '6 min read',
    category: 'Communication',
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">AI Career Tools</span>
            </Link>
            <Link href="/" className="btn-primary text-sm py-2 px-6">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Career Blog</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Expert advice, proven strategies, and insights to supercharge your job search and advance your career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="glass rounded-2xl p-6 hover:glow-primary transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">{article.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-violet-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">{article.date}</span>
                  <span className="text-violet-400 text-sm font-medium flex items-center gap-1">
                    Read Article
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 glass rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Create Your Perfect Resume Today</h3>
            <p className="text-gray-400 mb-6">
              Put these tips into action with our free AI-powered resume builder. Create a professional resume in seconds.
            </p>
            <Link href="/tools/resume-builder" className="btn-primary inline-flex items-center gap-2">
              Try Free Resume Builder
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">&copy; 2025 AI Career Tools - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
