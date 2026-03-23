'use client';

import Link from 'next/link';

export default function About() {
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="gradient-text">About Us</span>
          </h1>
          
          <div className="glass rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">What We Do</h2>
              <p className="text-gray-300 leading-relaxed">
                AI Career Tools is a free online platform that leverages the power of artificial intelligence 
                to help job seekers and professionals create polished, professional career documents. Our AI-powered 
                tools can generate resumes, cover letters, professional emails, and more - all in seconds.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Built with Google&apos;s Gemini AI, our platform provides high-quality, ATS-optimized content 
                that helps users stand out in competitive job markets. Whether you&apos;re crafting your first 
                resume or need a compelling cover letter, our tools are here to help.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                We believe everyone deserves access to professional career tools, regardless of their background 
                or budget. That&apos;s why all our AI tools are completely free to use - no signup required, 
                no hidden fees, no limits. We&apos;re committed to democratizing career resources and helping 
                people achieve their professional goals.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Who Built This</h2>
              <p className="text-gray-300 leading-relaxed">
                AI Career Tools was created by a solo developer passionate about helping job seekers land their 
                dream jobs. The project started with a simple idea: make professional career documents accessible 
                to everyone through the power of AI.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Built with Next.js and powered by Google&apos;s Gemini AI, the website is designed to be fast, 
                reliable, and easy to use across all devices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>100% Free - No signup, no fees, no limits</li>
                <li>AI-Powered - Advanced AI generates professional content instantly</li>
                <li>ATS-Optimized - All documents are designed to pass applicant tracking systems</li>
                <li>Multiple Tools - Resume builder, cover letter generator, email writer, and more</li>
                <li>Privacy-First - We don&apos;t store your data or personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
              <p className="text-gray-300 leading-relaxed">
                This website is built with modern web technologies:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Next.js - React framework for fast, server-side rendered pages</li>
                <li>TypeScript - Type-safe JavaScript for better code quality</li>
                <li>Tailwind CSS - Utility-first CSS for beautiful, responsive design</li>
                <li>Google Gemini AI - Advanced AI model powering all content generation</li>
                <li>Google AdSense - Supporting the free service through advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                We&apos;d love to hear from you! Whether you have questions, feedback, or suggestions for new features, 
                feel free to reach out:
              </p>
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <p className="text-gray-300">
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:contact@aicareertools.in" className="text-violet-400 hover:underline">
                    contact@aicareertools.in
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Get Started</h2>
              <p className="text-gray-300 leading-relaxed">
                Ready to take your career to the next level? Try our AI tools today and see the difference 
                professional, AI-generated content can make in your job search.
              </p>
              <Link href="/" className="btn-primary inline-block mt-4">
                Explore AI Tools
              </Link>
            </section>
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
