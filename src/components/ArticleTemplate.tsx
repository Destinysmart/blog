import { ArrowLeft, ArrowRight, Clock, Share2, Facebook, Twitter, Linkedin, Bookmark } from "lucide-react";

export function ArticleTemplate() {
  return (
    <article className="bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Schema Integration */}
        <nav className="mb-8 text-sm font-medium text-gray-500 flex items-center gap-2">
           <a href="/blog" className="hover:text-brand-600 flex items-center gap-1 transition-colors"><ArrowLeft className="h-4 w-4" /> Back to Blog</a>
           <span>/</span>
           <a href="#" className="hover:text-brand-600 transition-colors">Bitcoin Careers</a>
        </nav>

        {/* H1 & Meta Header */}
        <header className="mb-12">
          <h1 className="heading-display text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to secure a High-Paying Remote Tech Job in Bitcoin
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
               <img src="https://i.pravatar.cc/150?u=1" alt="Author" className="h-10 w-10 rounded-full" />
               <span className="font-medium text-gray-900">David L.</span>
            </div>
            <span>•</span>
            <time>October 28, 2026</time>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 8 min read</span>
            
            {/* Sticky Share (Mobile static, Desktop could be sticky aside) */}
            <div className="ml-auto flex items-center gap-2">
               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Twitter className="h-4 w-4" /></button>
               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Linkedin className="h-4 w-4" /></button>
               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Bookmark className="h-4 w-4" /></button>
            </div>
          </div>
        </header>

        {/* AEO: Quick Answer Box */}
        <div className="mb-10 rounded-2xl bg-brand-50 border border-brand-100 p-6 shadow-sm">
          <h3 className="font-bold text-brand-900 mb-2 flex items-center gap-2">
            <span className="bg-brand-500 text-white rounded-md px-2 py-0.5 text-xs">AEO Quick Answer</span>
          </h3>
          <p className="text-brand-800 font-medium">
            To secure a high-paying remote Bitcoin job, focus on building verifiable proof-of-work specific to the Bitcoin ecosystem (e.g., contributing to open-source Lightning projects like LDK or Core Lightning). Network directly with founders on Nostr or Twitter, and use specialized marketplaces like Bitlance rather than generic freelancer sites.
          </p>
        </div>

        {/* AEO: Key Takeaways */}
        <div className="mb-10 rounded-2xl bg-gray-50 border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Key Takeaways</h3>
          <ul className="space-y-2 text-gray-700 list-disc list-inside marker:text-brand-500">
            <li>Open-source contributions often outweigh traditional resumes.</li>
            <li>Rust, C++, and Go are the most in-demand languages.</li>
            <li>Compensation is typically negotiated in USD equivalents but paid in BTC.</li>
            <li>Networking on Nostr gives you a significant advantage.</li>
          </ul>
        </div>
        
        {/* Table of Contents */}
        <div className="mb-10">
          <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
          <ul className="space-y-2 text-brand-600 font-medium">
            <li><a href="#intro" className="hover:underline">1. Introduction</a></li>
            <li><a href="#skills" className="hover:underline">2. The Most Valued Skills Right Now</a></li>
            <li><a href="#portfolio" className="hover:underline">3. Building a Proof-of-Work Portfolio</a></li>
            <li><a href="#faq" className="hover:underline">4. Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Article Body Content */}
        <div className="prose prose-lg prose-brand max-w-none text-gray-600">
          <h2 id="intro" className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Introduction</h2>
          <p className="mb-6">
            The transition to a Bitcoin-native career is one of the most asymmetric professional moves you can make this decade. Unlike the saturated Web2 markets...
          </p>
          
          <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Frequently Asked Questions</h2>
          <div className="space-y-4">
             <div>
                <strong className="text-gray-900 block mb-2">Q: How do benefits work for remote positions?</strong>
                <p>A: Many Bitcoin companies offer a stipend model, sending an extra $500-$1000/mo equivalent for you to source your own local health insurance and office setup.</p>
             </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-16 bg-[#FFFBF7] rounded-3xl p-8 sm:p-10 border border-brand-100 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start group transition-all hover:shadow-md">
          <img src="https://i.pravatar.cc/150?u=1" alt="David L." className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white shadow-sm shrink-0 object-cover" />
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="heading-display text-2xl font-bold text-gray-900 mb-2">David L.</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              David is a Senior Lightning Engineer and prominent open-source contributor. He has helped over a dozen Bitcoin startups architect their initial payment layers and regularly writes about the intersection of remote work and the Lightning Network.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.bitlance.work/profile/david-l" className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-sm">
                View Bitlance Profile <ArrowRight className="h-4 w-4 ml-1.5" />
              </a>
              <div className="flex items-center gap-2 ml-2">
                <a href="#" className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-full border border-gray-200 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-full border border-gray-200 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Reading */}
        <div className="mt-20 pt-16 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Suggested Reading</h3>
            <div className="flex gap-2">
               <a href="#" className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors border border-gray-200">#RemoteWork</a>
               <a href="#" className="inline-flex items-center rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-100 transition-colors border border-brand-100">#BitcoinCareers</a>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <a href="#" className="group flex flex-col">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                 <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop" alt="Article cover" className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Bitcoin Careers</span>
              </div>
              <h4 className="heading-display text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                10 Best Niches for Bitcoin Freelancers in 2026
              </h4>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-auto">
                <span className="text-gray-900">David L.</span>
                <span>•</span>
                <span>Oct 18</span>
              </div>
            </a>

            <a href="#" className="group flex flex-col">
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                 <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop" alt="Article cover" className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Client Acquisition</span>
              </div>
              <h4 className="heading-display text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                Building a Portfolio That Bitcoin Companies Love
              </h4>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-auto">
                <span className="text-gray-900">Sarah J.</span>
                <span>•</span>
                <span>Oct 10</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
