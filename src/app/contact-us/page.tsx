export default function ContactPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] justify-center items-start pt-24 pb-12 px-4">
      <div className="container max-w-4xl">
        <div className="bg-neutral-900 rounded-xl p-8 border border-neutral-800">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-neutral-400 mb-6">
                Send us a message about bugs, violations, or suggestions for
                improvement.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <h3 className="text-lg font-medium mb-2">
                    Technical Support
                  </h3>
                  <p className="text-neutral-400 mb-4">
                    For technical issues, bug reports, or platform problems.
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    support@example.com
                  </a>
                </div>

                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <h3 className="text-lg font-medium mb-2">
                    Business Inquiries
                  </h3>
                  <p className="text-neutral-400 mb-4">
                    For partnership proposals, advertising, and business
                    opportunities.
                  </p>
                  <a
                    href="mailto:partnerships@example.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    partnerships@example.com
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <h3 className="text-lg font-medium mb-2">
                    Content & Feedback
                  </h3>
                  <p className="text-neutral-400 mb-4">
                    For content suggestions, feedback, or feature requests.
                  </p>
                  <a
                    href="mailto:feedback@example.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    feedback@example.com
                  </a>
                </div>

                <div className="bg-neutral-950 p-6 rounded-lg border border-neutral-800">
                  <h3 className="text-lg font-medium mb-2">
                    General Information
                  </h3>
                  <p className="text-neutral-400 mb-4">
                    For general questions about the platform.
                  </p>
                  <a
                    href="mailto:info@example.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    info@example.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-800">
              <h3 className="text-lg font-medium mb-4">Response Time</h3>
              <p className="text-neutral-400">
                We strive to respond to all inquiries within 24-48 hours during
                business days. For urgent technical issues, please include
                &quot;URGENT&quot; in your subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
