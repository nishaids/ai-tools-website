'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tools } from '@/lib/tools';

const typingWords = [
  'AI Resume Builder',
  'Cover Letter Writer',
  'Professional Emails',
  'Bio Generator',
  'Product Descriptions',
  'YouTube Scripts',
];

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentWord = typingWords[currentWordIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentWord.length) {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % typingWords.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex]);

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
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

            <div className="hidden md:flex items-center gap-8">
              <Link href="/#tools" className="text-gray-300 hover:text-white transition">Tools</Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition">Blog</Link>
              <Link href="/#features" className="text-gray-300 hover:text-white transition">Features</Link>
              <Link href="/#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</Link>
              <button className="btn-primary text-sm py-2 px-6">
                <span>Get Started</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
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
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link href="/#tools" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-violet-400">Tools</Link>
        <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-violet-400">Blog</Link>
        <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-violet-400">Features</Link>
        <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-semibold text-white hover:text-violet-400">How It Works</Link>
        <button className="btn-primary mt-4">
          <span>Get Started</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-transparent" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Powered by Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 animate-slide-up">
            Transform Your Career
            <br />
            <span className="gradient-text">with AI</span>
          </h1>

          <div className="h-12 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl md:text-2xl text-gray-400">
              Create <span className="text-violet-400 font-semibold">{displayedText}|</span>
            </p>
          </div>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Build professional resumes, cover letters, and career documents in seconds. 
            No signup required. 100% free forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/#tools" className="btn-primary text-lg group">
              <span className="flex items-center gap-2">
                Try Free Tools
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link href="/tools/resume-builder" className="px-8 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </Link>
          </div>

          <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No signup
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% Free
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant results
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Create professional documents in 3 simple steps
            </p>
          </div>
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Enter Your Details</h3>
                <p className="text-gray-400">Fill in the form with your information — job title, experience, skills, or content topic.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">AI Generates Instantly</h3>
                <p className="text-gray-400">Our Gemini-powered AI creates polished, professional content tailored to your needs in seconds.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Download as PDF</h3>
                <p className="text-gray-400">Copy your content or download it as a clean, professional PDF — ready to use immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              All <span className="gradient-text">Free AI Tools</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Professional-grade AI tools to accelerate your career. No signup, no limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="tool-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-violet-400 text-sm font-medium">
                    Use Tool
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="ad-placeholder h-24">
            Advertisement
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center hover:glow-primary transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Results</h3>
              <p className="text-gray-400">Generate professional documents in seconds with our AI-powered tools.</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:glow-secondary transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">ATS Optimized</h3>
              <p className="text-gray-400">All documents are optimized to pass Applicant Tracking Systems.</p>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:glow-accent transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Free</h3>
              <p className="text-gray-400">No hidden fees, no signup required. Completely free forever.</p>
            </div>
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">AI Career Tools</span>
              </Link>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/tools/resume-builder" className="hover:text-white transition">Resume Builder</Link></li>
                <li><Link href="/tools/cover-letter" className="hover:text-white transition">Cover Letter</Link></li>
                <li><Link href="/tools/email-writer" className="hover:text-white transition">Email Writer</Link></li>
                <li><Link href="/tools/cold-email" className="hover:text-white transition">Cold Email</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog" className="hover:text-white transition">Career Blog</Link></li>
                <li><a href="#" className="hover:text-white transition">Resume Tips</a></li>
                <li><a href="#" className="hover:text-white transition">Job Search Guide</a></li>
                <li><a href="#" className="hover:text-white transition">Interview Prep</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><a href="mailto:contact@aicareertools.in" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm mb-2">&copy; 2025 AI Career Tools - All rights reserved</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
              <span className="text-gray-600">|</span>
              <Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link>
              <span className="text-gray-600">|</span>
              <a href="mailto:contact@aicareertools.in" className="text-gray-400 hover:text-white transition">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
