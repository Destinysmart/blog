import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "How do I get paid as a freelancer on BitLance?",
    answer: "When the client clicks Approve and Pay on your milestone, the escrow releases automatically and your agreed amount is paid directly to the Lightning address set in your Settings. There is no manual withdraw step or delay, just keep your Lightning address correct."
  },
  {
    question: "What are the platform fees?",
    answer: "The client pays a flat 5% platform fee. Freelancers receive 100% of the agreed amount, with absolutely zero deductions from their earnings."
  },
  {
    question: "Where do I see my escrow balance?",
    answer: "Clients can monitor all active escrows on their Payments page. Freelancers can view their secured funds locked in escrow on their Earnings page."
  },
  {
    question: "How does a client fund a contract?",
    answer: "Clients can fund a contract either fully upfront or milestone-by-milestone. This is done by generating a Lightning escrow invoice directly inside the Messages section. Once the invoice is paid, the contract status automatically transitions to 'work in progress' so the freelancer can safely begin working."
  },
  {
    question: "What if there is a dispute or we cannot agree on the work?",
    answer: "If any disagreement arises, either party can select 'Raise Dispute' from the three-dot menu in their chat under Messages. A BitLance admin will review the contract, contact both parties directly to gather facts, and resolve the escrow. Refunds and releases are never executed unilaterally without full admin verification."
  },
  {
    question: "Can I work or execute payments outside of the BitLance platform?",
    answer: "We strongly discourage off-platform deals. Taking communication or payment off-platform completely removes your escrow protection, leaving both parties with no recourse if a dispute arises or work is not delivered."
  }
];

export function FAQnNewsletter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h2 className="heading-display text-3xl font-bold text-gray-900 mb-4">FAQ</h2>
              <p className="text-gray-500 text-sm">Answers to common questions about earning Bitcoin independently.</p>
            </div>
            
            <div className="md:col-span-3 space-y-4">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="border-b border-gray-200 last:border-0"
                >
                  <button
                    className="w-full py-5 flex items-center justify-between text-left group"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-gray-500 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-bold text-brand-700 uppercase mb-4 tracking-wider">
            Planned &amp; In Progress
          </div>
          <h2 className="heading-display text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Stay Ahead of the Bitcoin Economy
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
            Our official newsletter is currently in development. Subscribe today to join our waitlist and be the first to receive premium remote Bitcoin freelancing insights, remote work tips, and product updates when we go live.
          </p>

          <form className="mx-auto max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-grow rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-sm"
            />
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-400">Join 15,000+ professionals. No spam, unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
