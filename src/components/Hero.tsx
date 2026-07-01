import { Search, Zap, CheckCircle, Bookmark } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative bg-[#FFFBF7] pt-20 pb-20 lg:pt-28 lg:pb-32 overflow-hidden border-b border-gray-100">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* LEFT COLUMN: Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 mb-8 shadow-sm tracking-wide uppercase">
              <Zap className="h-3.5 w-3.5 text-brand-500 stroke-[2.5]" />
              <span>The Bitlance Publication</span>
            </div>

            <h1 className="heading-display text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.05]">
              Bitcoin <br className="hidden lg:block"/> Freelancing Blog
            </h1>

            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg">
              Guides, tutorials, and insights on Bitcoin freelancing, remote work, Lightning payments, and building a borderless career.
            </p>

            <div className="w-full relative group mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-500 transition-colors stroke-[2]" />
              </div>
              <input
                type="text"
                placeholder="Search tutorials, insights, or topics..."
                className="block w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-32 text-gray-900 shadow-sm transition outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-400"
              />
              <div className="absolute inset-y-2 right-2 flex items-center">
                <button className="rounded-xl bg-gray-900 px-6 py-2 h-full text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-1">Trending:</span>
              {["Lightning Setup", "Cold Emailing", "Proposals"].map((topic, i) => (
                <a key={i} href="#" className="rounded-md bg-white border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm">
                  {topic}
                </a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Custom UI Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block w-full h-[550px] ml-6 perspective-1000"
          >
            {/* Decorative Blob */}
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-brand-200/40 rounded-full blur-3xl opacity-60 pointer-events-none" />

            {/* Background Article Card */}
            <div className="absolute top-[5%] right-[5%] w-[440px] bg-white rounded-3xl shadow-xl border border-gray-100 p-6 z-10 transform translate-x-4 -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="w-full h-[200px] rounded-2xl mb-6 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop" alt="Workspace" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-1 rounded-md">Remote Work</span>
              </div>
              <h3 className="heading-display text-2xl font-bold text-gray-900 mb-3 leading-snug pr-4">
                How to Set Up a Lightning Node for Freelance Payments
              </h3>
              <p className="text-sm text-gray-500 mb-8 line-clamp-2 leading-relaxed">
                Stop relying on third parties. Here is the definitive guide to running your own infrastructure and keeping 100% of your earnings borderless.
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                  <img src="https://i.pravatar.cc/150?u=12" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">David L.</p>
                  <p className="text-xs text-gray-500 font-medium">Oct 28, 2026</p>
                </div>
              </div>
            </div>

            {/* Foreground Notification / Payment Card */}
            <div className="absolute bottom-[10%] left-[-5%] w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-200 p-5 z-20 transform translate-y-4 rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 ease-out">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-10 w-10 bg-[#FFF5F0] border border-brand-100 rounded-full flex items-center justify-center shadow-sm mt-0.5">
                  <Zap className="h-5 w-5 text-brand-500 stroke-[2] fill-brand-50" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900 tracking-tight">Payment Received</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xl font-black text-gray-900 tracking-tight">+0.15820 BTC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold">21 minutes ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Meta Badge */}
            <div className="absolute top-[35%] left-[-10%] bg-white px-4 py-3 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-200 z-20 flex items-center gap-3 transform -translate-x-4 hover:translate-x-0 transition-transform duration-500 cursor-default">
              <div className="h-7 w-7 rounded-full bg-brand-50 flex items-center justify-center">
                <Bookmark className="h-4 w-4 text-brand-500 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-gray-800 tracking-wide">1.2k Saves</span>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
