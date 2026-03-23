import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Write a Professional Email: Complete Guide | AI Career Tools',
  description: 'Master the art of professional email writing with our comprehensive guide. Learn essential rules, best practices, and proven strategies to write emails that get results.',
  keywords: 'how to write a professional email, professional email format, business email writing, email etiquette, business communication, professional email examples',
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
                Communication
              </span>
              <span className="text-gray-500">February 20, 2025</span>
              <span className="text-gray-500">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">How to Write a Professional Email</span>
            </h1>
          </div>

          <div className="glass rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              In the modern workplace, email remains the backbone of professional communication. Despite the rise of instant messaging and video calls, knowing how to write a professional email is a critical skill that impacts your career advancement, client relationships, and professional reputation. This comprehensive guide covers everything you need to know about crafting effective business emails.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Why Professional Email Writing Matters</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Professional emails represent you when you're not in the room. They're permanent records that can be forwarded, printed, and referenced long after they're sent. A poorly written email can damage relationships, create misunderstandings, and harm your professional reputation. Conversely, well-crafted emails build credibility, facilitate clear communication, and strengthen professional bonds.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Studies show that the average professional receives over 120 emails per day. Standing out in this crowded inbox requires emails that are clear, concise, and compelling. Your ability to communicate effectively through email directly affects your productivity, career success, and how others perceive your competence.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">The Anatomy of a Professional Email</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Every professional email consists of several key components. Understanding each element and perfecting them is essential for effective business communication.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Subject Line</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your subject line is your first impression. It determines whether the recipient opens your email, ignores it, or marks it as spam. A good subject line is specific, concise, and gives the recipient a clear idea of what the email contains.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Weak: "Question"<br />
              Better: "Quick question about the Q3 marketing report"<br />
              Best: "Action needed: Q3 report review by Friday 5pm"
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Include action items or deadlines when relevant. If the email is time-sensitive, indicate that in the subject. Avoid all caps, excessive punctuation, and vague phrases that don't provide value.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Greeting</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The greeting sets the tone for your email. Choose appropriately based on your relationship with the recipient and the context of your message:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong className="text-white">Formal:</strong> "Dear Mr. Smith," or "Dear Dr. Johnson,"</li>
              <li><strong className="text-white">Professional:</strong> "Hello Sarah," or "Hi Michael,"</li>
              <li><strong className="text-white">Group:</strong> "Hello everyone," or "Dear Team,"</li>
              <li><strong className="text-white">When unsure:</strong> "Hello," or "Good morning,"</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed">
              When you don't know the recipient's name, avoid "To Whom It May Concern" if possible. Instead, try to find out the name through research, LinkedIn, or calling the company directly. If you truly cannot identify the recipient, "Dear Hiring Manager," or "Dear [Company Name] Team," are acceptable alternatives.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Opening</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your opening should immediately establish the purpose of your email. Don't bury the lead—get to the point quickly. If you're responding to a previous email, briefly reference it. If you're initiating contact, state your purpose in the first sentence.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Weak opening: "I hope this email finds you well. I wanted to reach out to you about something that I think might be relevant to you."
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Strong opening: "Following up on our call yesterday, I'm sending over the proposal we discussed for your review."
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Body</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The body of your email should be scannable and easy to digest. Use short paragraphs, bullet points for lists, and bold text for emphasis. Structure your content logically, starting with the most important information.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Keep your emails focused on one primary topic or request. If you have multiple topics to discuss, consider whether they warrant separate emails. This makes it easier for recipients to respond to each item and keeps your communication organized.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Call to Action</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Every business email should have a clear next step. What do you want the recipient to do after reading your email? Schedule a meeting? Review a document? Provide feedback? Make this explicit.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Instead of: "Let me know if you have any questions."
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Try: "Please review the attached proposal and let me know your thoughts by Thursday. I'm available Friday afternoon if you'd like to discuss via video call."
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Closing</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              End with a professional closing that matches your greeting's formality. Common professional closings include:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong className="text-white">Formal:</strong> "Sincerely," "Respectfully," "Best regards,"</li>
              <li><strong className="text-white">Professional:</strong> "Thank you," "Thanks," "Best,"</li>
              <li><strong className="text-white">Warm:</strong> "Warm regards," "Kind regards,"</li>
            </ul>
            <p className="text-gray-300 mb-6 leading-relaxed">
              After your closing, include your signature with your full name, title, company, and contact information. This makes it easy for recipients to reach you and provides context about who you are.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Essential Email Writing Principles</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">Clarity Above All</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The primary purpose of any business email is to communicate information. Clarity should be your north star. Before sending, ask yourself: Can the recipient understand my main point within 10 seconds? Can they act on this email without needing clarification?
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Use plain language, avoid jargon unless your audience expects it, and define acronyms on first use. If your email requires more than three readings to understand, revise it.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Conciseness Counts</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Respect your recipient's time. Get to the point quickly without unnecessary preamble. A good rule of thumb: if your email runs longer than 200 words, consider whether it could be a document attachment or a meeting instead.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Use active voice ("I will send the report" not "The report will be sent by me") to keep sentences direct and engaging. Active voice is typically shorter and clearer.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Professional Tone</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Even when communicating with colleagues you know well, maintain professionalism in written communication. Email can be forwarded, quoted, or printed. What's acceptable between friends might not be appropriate if it reaches a wider audience.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Avoid sarcasm, which can be easily misinterpreted. Steer clear of humor that might not land correctly in text form. When in doubt, err on the side of formality.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Common Professional Email Scenarios</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">Cold Outreach</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              When reaching out to someone you don't know, be direct about why you're contacting them and what you're asking for. Personalize your message—research the person and reference something specific. Keep it brief and make it easy for them to respond or decline.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Following Up</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Following up requires finesse. Wait an appropriate amount of time before following up (generally 3-5 business days for responses, longer for ongoing projects). Reference your original email briefly, restate your request, and explain why you're following up again.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Delivering Bad News</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Difficult news deserves careful handling. Be direct but kind. Avoid burying the negative information. Offer solutions or next steps when possible. Pick up the phone for truly sensitive conversations—email lacks the nuance for complex emotional situations.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3">Requesting Something</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Make it easy to say yes. Be specific about what you're asking for, why you're asking, and when you need it. Provide all necessary context and any relevant documents. Express gratitude in advance—this increases the likelihood of a positive response.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Email Etiquette Do's and Don'ts</h2>

            <h3 className="text-xl font-bold mt-6 mb-3">Do:</h3>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Proofread before sending—check for typos and grammatical errors</li>
              <li>Use the CC and BCC fields appropriately</li>
              <li>Respond to emails within 24-48 hours, even if just to acknowledge receipt</li>
              <li>Use a professional email address for business communication</li>
              <li>Consider your recipient's timezone when timing emails</li>
              <li>Reply to all when appropriate, but be careful about group replies</li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3">Don't:</h3>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Use ALL CAPS—it reads like shouting</li>
              <li>Send emails when emotional—write, save as draft, and review later</li>
              <li>Use email for urgent matters that warrant a phone call</li>
              <li>Reply all unless everyone genuinely needs the information</li>
              <li>Include confidential information in emails that might be forwarded</li>
              <li>Send unnecessary attachments—always check before hitting send</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Using AI to Improve Your Emails</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              AI-powered email writing tools can help you craft clearer, more professional messages. Our free AI email writer analyzes your input and generates polished, professional emails for various scenarios—from initial job applications to follow-up messages to client communications.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              These tools can suggest improvements, help you find the right tone, and ensure your emails are clear and compelling. While AI can assist, always review and personalize the output—your authentic voice should always come through.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Professional email writing is a skill that improves with practice and attention. Remember the key principles: be clear, concise, and courteous. Structure your emails for scannability, make your ask explicit, and always proofread before sending. Your professional reputation is built one email at a time—make each one count.
            </p>

            <div className="border-t border-white/10 pt-8">
              <Link href="/tools/email-writer" className="btn-primary inline-flex items-center gap-2">
                Write Professional Emails with AI
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
