import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10 Tips for a Great Cover Letter | AI Career Tools',
  description: 'Master the art of cover letter writing with these 10 proven tips. Learn how to capture attention, showcase your value, and land more interviews with a compelling cover letter.',
  keywords: 'cover letter tips, how to write a cover letter, cover letter examples, job application letter, professional cover letter',
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
                Cover Letters
              </span>
              <span className="text-gray-500">March 10, 2025</span>
              <span className="text-gray-500">6 min read</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">10 Tips for a Great Cover Letter</span>
            </h1>
          </div>

          <div className="glass rounded-2xl p-8 md:p-12 prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              While your resume lists your qualifications, your cover letter tells your story. It's your opportunity to connect the dots between your experience and the employer's needs, to show personality, and to convince hiring managers that you're more than just a list of skills. Here's how to write a cover letter that gets results.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Research the Company Before You Write</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Never start writing without understanding who you're writing to. Research the company's mission, values, recent news, and culture. Visit their website, check their social media, and read employee reviews on platforms like Glassdoor. This research helps you speak their language and address their specific pain points, making your cover letter feel personalized rather than generic.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              When you reference something specific about the company—like a recent product launch or community initiative—it shows genuine interest and attention to detail. Recruiters can immediately tell when someone has done their homework versus firing off mass applications.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Address the Hiring Manager by Name</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              "Dear Sir or Madam" is a red flag that screams template. Take the time to find the hiring manager's name through LinkedIn, the company website, or even a phone call to the receptionist. Addressing someone directly—"Dear Sarah Chen"—creates an immediate personal connection and shows initiative.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              If you genuinely cannot find a name, "Dear Hiring Manager" or "Dear [Company Name] Team" are acceptable alternatives. Avoid outdated salutations like "To Whom It May Concern."
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Hook Them in the First Paragraph</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Recruiters spend an average of 7 seconds scanning a cover letter initially. Your opening paragraph must grab attention immediately. Start with a compelling achievement, an intriguing question, or a bold statement that connects directly to the role.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Instead of: "I am writing to apply for the Marketing Manager position at your company."
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Try: "When I increased lead generation by 127% at my current company using nothing but creative thinking and data analysis, I realized I was just getting started. I'm excited to bring that same approach to the Marketing Manager role at [Company]."
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Show, Don't Tell—With Specific Examples</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Generic statements like "I'm a hard worker" or "I'm great at communication" fall flat. Every claim needs evidence. For each skill or quality you mention, include a concrete example that demonstrates it in action.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Use the STAR method (Situation, Task, Action, Result) to structure your examples. Describe the context, what needed to be done, what action you took, and the measurable outcome. This turns abstract claims into compelling evidence.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Connect Your Experience to Their Needs</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your cover letter isn't about you—it's about solving their problem. Every paragraph should answer the unspoken question: "Why should we hire you?" Study the job description carefully and address the key requirements. Show how your specific experience prepares you to tackle their challenges.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              If the job mentions "managing cross-functional teams," don't just mention your management experience. Explain how you've successfully led diverse teams and the results you achieved. Make the connection explicit and obvious.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Demonstrate Cultural Fit</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Skills can be taught, but cultural fit is harder to develop. Use your cover letter to show that your values align with the company culture. If they're innovation-focused, share an example of when you pioneered something new. If they emphasize collaboration, describe how you've built bridges across departments.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              This doesn't mean fabricating personality traits. Rather, identify the genuine aspects of your character and work style that do align with the company, and highlight those strategically.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Keep It Concise—One Page Maximum</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Recruiters are busy. A three-page cover letter signals that you don't respect their time. Three to four well-crafted paragraphs are sufficient. Be ruthless about cutting unnecessary words—every sentence should earn its place by adding value.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Aim for 250-400 words. If you're struggling to stay within this range, identify which points are truly essential and which can be implied rather than explained in detail.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Match the Company's Tone</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              A cover letter for a creative agency should feel different from one for a financial institution. Pay attention to the language and tone in the job description and company communications. Mirror their style—formal or conversational, technical or accessible.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              This doesn't mean being fake. It means adapting your natural communication style to match the professional context. A tech startup might appreciate some personality and humor, while a law firm expects professionalism and precision.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. End with a Clear Call to Action</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Don't let your cover letter fizzle out with a generic "Thank you for your consideration." End with enthusiasm, confidence, and a clear next step. Express your excitement about the opportunity, reiterate your key qualifications, and indicate your eagerness to discuss further.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Example: "I'm excited about the possibility of bringing my proven track record of driving revenue growth to [Company]. I welcome the opportunity to discuss how my skills align with your goals. Thank you for your time—I look forward to hearing from you."
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Proofread—Then Proofread Again</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Nothing destroys a great cover letter faster than typos and grammatical errors. These mistakes suggest carelessness and can immediately disqualify you. Read your cover letter aloud to catch awkward phrasing. Use spell-check, but don't rely on it entirely.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Have someone else review it—a friend, family member, or mentor. A fresh set of eyes can catch mistakes you've overlooked and provide valuable feedback on clarity and impact.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Bonus: Common Cover Letter Mistakes to Avoid</h2>
            <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
              <li>Repeating your resume word-for-word</li>
              <li>Using the same cover letter for every application</li>
              <li>Focusing on what you want instead of what you can offer</li>
              <li>Including irrelevant personal information</li>
              <li>Being negative about past employers or situations</li>
              <li>Forgetting to attach the document or including the wrong company name</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              A great cover letter transforms you from "another applicant" into "someone I need to meet." It showcases your personality, demonstrates your research and preparation, and provides evidence of your claims. By following these ten tips, you'll create cover letters that capture attention, build connections, and move you closer to the interview.
            </p>

            <div className="border-t border-white/10 pt-8">
              <Link href="/tools/cover-letter" className="btn-primary inline-flex items-center gap-2">
                Create Your Cover Letter
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
