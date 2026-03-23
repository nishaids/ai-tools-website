import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Write a Perfect Resume in 2025 | AI Career Tools',
  description: 'Learn how to create a perfect resume in 2025 with our comprehensive guide. Discover ATS-friendly formatting, powerful action verbs, and proven strategies to land your dream job.',
  keywords: 'how to write a resume, perfect resume 2025, resume tips, ATS resume, professional resume, resume format, job application',
};

export default function Article() {
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
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-gray-300 hover:text-white transition text-sm">
                Blog
              </Link>
              <Link href="/" className="btn-primary text-sm py-2 px-4">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-violet-500/20 text-violet-400 text-sm font-medium rounded-full">
                Resume Tips
              </span>
              <span className="text-gray-500">March 15, 2025</span>
              <span className="text-gray-500">8 min read</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">How to Write a Perfect Resume in 2025</span>
            </h1>
          </div>

          <div className="glass rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              The job market in 2025 is more competitive than ever. With thousands of applicants vying for the same positions, your resume isn't just a document—it's your first impression, your elevator pitch, and your ticket to the interview room. Here's everything you need to know about crafting a resume that gets noticed.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Understanding the Modern Resume Landscape</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              In 2025, the resume screening process has evolved dramatically. Most large companies use Applicant Tracking Systems (ATS) that scan resumes before a human ever sees them. These systems filter candidates based on keywords, formatting, and specific criteria set by the hiring manager. Understanding how ATS works is crucial to getting your resume past the initial screening and into human hands.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Statistics show that 75% of resumes are rejected by ATS before reaching a recruiter. This means your resume must be optimized for both machines and humans. The good news? With the right approach, you can create a resume that excels at both.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Essential Resume Sections in 2025</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Every effective resume needs these core sections, arranged strategically to highlight your qualifications:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong className="text-white">Contact Information:</strong> Name, phone, email, LinkedIn URL, and city/state (no full address needed in 2025)</li>
              <li><strong className="text-white">Professional Summary:</strong> A 2-3 sentence snapshot of your value proposition</li>
              <li><strong className="text-white">Work Experience:</strong> Reverse chronological, focusing on achievements over duties</li>
              <li><strong className="text-white">Skills:</strong> Technical and functional skills relevant to the position</li>
              <li><strong className="text-white">Education:</strong> Degrees, certifications, and relevant coursework</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Power of Quantifiable Achievements</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Recruiters and hiring managers don't want to see what you were responsible for—they want to see what you accomplished. Numbers grab attention and provide context that generic descriptions cannot. Instead of saying "Managed a team," say "Led a cross-functional team of 12 members, delivering a 35% increase in project efficiency."
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Think about the metrics that matter in your field: revenue generated, costs saved, time reduced, customer satisfaction scores, percentage improvements, and project scales. These concrete numbers transform vague statements into compelling evidence of your capabilities.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Formatting That Passes ATS Scans</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your resume's format can make or break your chances. ATS systems struggle with complex layouts, tables, graphics, headers, footers, and unusual fonts. Here's what works:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Use standard section headings (Experience, Skills, Education)</li>
              <li>Save as .docx or .pdf (check the job posting for preferences)</li>
              <li>Use a clean, sans-serif font like Arial, Calibri, or Garamond</li>
              <li>Maintain consistent formatting throughout</li>
              <li>Avoid columns, text boxes, and images</li>
              <li>Keep it to 1-2 pages maximum</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Keywords: The Currency of ATS</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Keywords are the words and phrases that ATS systems look for to match your resume to the job description. Study the job posting carefully and identify the key skills, qualifications, and terminology used. Naturally incorporate these throughout your resume, especially in your summary, skills section, and work experience descriptions.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              However, avoid keyword stuffing—forcing keywords unnaturally into your content. Quality matters more than quantity. A resume stuffed with keywords without coherent context will raise red flags when a human reviews it.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Tailoring Your Resume for Each Application</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              One-size-fits-all resumes don't work in 2025. Each position deserves a tailored version that highlights the most relevant aspects of your experience. Analyze the job description, identify the top 5-7 requirements, and ensure your resume addresses each one directly.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              This doesn't mean rewriting your entire resume for every application. Instead, strategically reorder bullet points, adjust your summary, and emphasize different achievements based on what's most relevant to each specific role.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Professional Summary: Your Hook</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your professional summary is the first thing recruiters read, and you have approximately 6 seconds to make an impression. This 2-3 sentence section should communicate your professional identity, key strengths, and what you bring to the table.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Strong summary example: "Results-driven software engineer with 7 years of experience building scalable web applications. Reduced system latency by 40% at TechCorp and led a team that shipped 3 major product releases. Passionate about clean code and user-centric design."
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Common Mistakes to Avoid</h2>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Using an unprofessional email address (save professional@example.com)</li>
              <li>Including irrelevant work experience from decades ago</li>
              <li>Listing " Responsibilities include..." instead of accomplishments</li>
              <li>Typos and grammatical errors (always proofread multiple times)</li>
              <li>Using passive language instead of action verbs</li>
              <li>Leaving employment gaps unexplained</li>
              <li>Including a photo (unless specifically required)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Final Checklist Before Submitting</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Before sending your resume, run through this checklist:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
              <li>Proofread for spelling and grammar errors</li>
              <li>Ensure consistent formatting throughout</li>
              <li>Verify all contact information is current</li>
              <li>Confirm the file name is professional (FirstName_LastName_Resume.pdf)</li>
              <li>Test that links work (LinkedIn, portfolio, etc.)</li>
              <li>Get a second opinion from a trusted friend or mentor</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Writing a perfect resume in 2025 requires understanding both technology (ATS systems) and human psychology (what recruiters want to see). Focus on clarity, quantification, and relevance. Your resume should tell a compelling story of your professional journey while being easily scannable by both machines and humans.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Remember, your resume is a living document. Update it regularly, tailor it for each application, and never stop refining your approach. With these strategies, you'll be well-equipped to create a resume that stands out in the competitive 2025 job market.
            </p>

            <div className="border-t border-white/10 pt-8 mt-8">
              <Link href="/tools/resume-builder" className="btn-primary inline-flex items-center gap-2">
                Create Your Resume Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">&copy; 2025 AI Career Tools - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
