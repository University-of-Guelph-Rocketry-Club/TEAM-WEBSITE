const Privacy = () => {
  return (
    <div className="page-transition">
      {/* Header */}
      <section className="pt-24 pb-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            Last updated: January 24, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-slate max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                The University of Guelph Rocketry Club ("we," "our," or "us") respects your privacy. 
                This Privacy Policy explains how we collect, use, and protect information when you use 
                our AI chatbot assistant on our website.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you interact with our AI chatbot assistant, we collect:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Chat messages:</strong> The questions and messages you send to the chatbot</li>
                <li><strong>Conversation data:</strong> AI responses and conversation history during your session</li>
                <li><strong>Timestamps:</strong> Date and time of your interactions</li>
                <li><strong>Technical data:</strong> Browser type, device information, and IP address (standard web logs)</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                <strong>We do NOT collect:</strong> Personal identification information, names, email addresses, 
                or any data that directly identifies you unless you voluntarily provide it in your messages.
              </p>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Provide accurate responses to your questions about our club</li>
                <li>Improve the chatbot's performance and accuracy</li>
                <li>Understand common questions and improve our website content</li>
                <li>Maintain conversation history during your session for context</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </div>

            {/* Data Storage and Security */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Storage and Security</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Your chat conversations are stored securely in our database. We implement appropriate 
                technical and organizational measures to protect your data against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Data Retention:</strong> Chat logs are retained for operational purposes and may 
                be used to improve our services. Conversations may be reviewed by club administrators for 
                quality assurance and improvement purposes.
              </p>
            </div>

            {/* AI Processing */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Processing</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our chatbot uses OpenAI's GPT technology to process and respond to your messages. When you 
                interact with the chatbot:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Your messages are sent to OpenAI's servers for processing</li>
                <li>OpenAI processes the data according to their own privacy policy and terms</li>
                <li>We do not have control over OpenAI's data processing practices</li>
                <li>Messages are processed to generate contextually relevant responses</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights and Choices</h2>
              <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li>Choose not to use the chatbot assistant</li>
                <li>Request information about data we've collected from your interactions</li>
                <li>Request deletion of your conversation data</li>
                <li>Contact us with any privacy concerns or questions</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                <strong>Usage Limits:</strong> To ensure fair access and prevent abuse, we limit chatbot 
                usage to 12 messages per user every 12 hours.
              </p>
            </div>

            {/* Third-Party Services */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Our website uses:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>OpenAI:</strong> For AI chatbot responses - <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Privacy Policy</a></li>
                <li><strong>Vercel:</strong> For website hosting - <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel Privacy Policy</a></li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                Our services are intended for use by students and individuals interested in aerospace 
                engineering. We do not knowingly collect information from children under 13. If you are 
                under 13, please do not use the chatbot without parental supervision.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page 
                with an updated "Last updated" date. Continued use of the chatbot after changes constitutes 
                acceptance of the updated policy.
              </p>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <p className="text-slate-700"><strong>University of Guelph Rocketry Club</strong></p>
                <p className="text-slate-700">Email: <a href="mailto:rocketry@uoguelph.ca" className="text-blue-600 hover:underline">rocketry@uoguelph.ca</a></p>
                <p className="text-slate-700">Location: University of Guelph, Ontario, Canada</p>
              </div>
            </div>

            {/* Student Organization Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <p className="text-slate-700 text-sm">
                <strong>Note:</strong> The University of Guelph Rocketry Club is a student-run organization. 
                This privacy policy applies specifically to our chatbot assistant and website. For questions 
                about University of Guelph's general privacy practices, please visit the university's official 
                privacy policy.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Privacy
