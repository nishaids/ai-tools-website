'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
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
            <span className="gradient-text">Privacy Policy</span>
          </h1>
          
          <div className="glass rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed">
                We collect no personal data from users. When you use our AI-powered tools, your inputs are processed 
                solely for the purpose of generating the requested content and are not stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">AI Processing</h2>
              <p className="text-gray-300 leading-relaxed">
                Your inputs are processed by Google&apos;s Gemini AI to generate the content you request. 
                We do not have access to, store, or retain any of the information you submit through our tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies to enhance your browsing experience and display advertisements through Google AdSense. 
                These cookies help us understand your preferences and deliver relevant advertisements. You can manage 
                your cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Google AdSense</h2>
              <p className="text-gray-300 leading-relaxed">
                We display advertisements through Google AdSense. Google may use cookies to personalize ads based 
                on your browsing history and preferences. For more information about how Google uses your data, 
                please visit <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Google&apos;s Privacy Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
                <li>Google Gemini AI - for content generation</li>
                <li>Google AdSense - for advertisements</li>
                <li>Google Fonts - for typography</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                While we do not collect personal data, we implement reasonable security measures to protect 
                our website and ensure a safe browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Children&apos;s Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our website is not intended for children under 13 years of age. We do not knowingly 
                collect information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. Any changes will be posted on this page 
                with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this privacy policy, please contact us at{' '}
                <a href="mailto:contact@aicareertools.in" className="text-violet-400 hover:underline">
                  contact@aicareertools.in
                </a>.
              </p>
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
