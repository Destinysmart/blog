import { Link } from "react-router-dom";
import { Github, Send, Globe, Heart } from "lucide-react";
import logoUrl from "../assets/images/bitlance_logo_1782869809232.jpg";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dedicated Newsletter Section/Card inside the footer container but at the top */}
        <div className="mb-16 animate-fade-in">
          <div className="border border-gray-100 bg-[#FAF9F6]/60 rounded-[2rem] sm:rounded-[2.5rem] px-5 py-8 sm:p-10 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 shadow-sm">
            <div className="max-w-xl text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">
                Get the latest updates and Bitcoin job opportunities.
              </p>
            </div>
            
            <div className="w-full lg:w-auto shrink-0 flex justify-center items-center py-2">
              <iframe
                src="https://bitlance.substack.com/embed"
                width="480"
                height="320"
                className="w-full max-w-full md:max-w-[90%] lg:max-w-[480px] rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm bg-white h-[380px] sm:h-[320px] transition-all duration-300 hover:shadow-md"
                style={{ border: "1px solid #EEE", background: "white" }}
                frameBorder="0"
                scrolling="no"
                title="Substack Newsletter"
              />
            </div>
          </div>
        </div>

        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 py-12 border-t border-gray-100/60">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <a href="/" className="flex items-center gap-2.5 group">
              <img 
                src={logoUrl} 
                alt="Bitlance Logo" 
                className="h-8 w-8 rounded-lg object-cover shadow-sm transition-transform duration-200 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-gray-950 text-xl tracking-tight transition-colors group-hover:text-brand-600">Bitlance</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-medium">
              The simplest freelance platform for the Bitcoin economy.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 text-gray-400">
              <a href="https://x.com/bitlancework" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors" title="X (Twitter)">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com/bitlance1" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors" title="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://t.me/+ITw8yz1xJIhjNWE0" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors" title="Telegram">
                <Send className="h-5 w-5" />
              </a>
              <a href="https://www.bitlance.work" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors" title="Website">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* PLATFORM Column */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">PLATFORM</h4>
            <ul className="flex flex-col gap-2 sm:gap-3 text-sm font-medium text-gray-500">
              <li>
                <a href="https://www.bitlance.work/findwork" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Find Work</a>
              </li>
              <li>
                <a href="https://www.bitlance.work/find-freelancers" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Find Freelancers</a>
              </li>
              <li>
                <a href="https://www.bitlance.work/find-freelancers" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Post a Job</a>
              </li>
            </ul>
          </div>

          {/* RESOURCES Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">RESOURCES</h4>
            <ul className="flex flex-col gap-2 sm:gap-3 text-sm font-medium text-gray-500">
              <li>
                <a href="https://www.bitlance.work/help" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Help Center</a>
              </li>
              <li>
                <Link to="/" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">COMPANY</h4>
            <ul className="flex flex-col gap-2 sm:gap-3 text-sm font-medium text-gray-500">
              <li>
                <a href="https://www.bitlance.work/about" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">About Us</a>
              </li>
              <li>
                <a href="https://www.bitlance.work/privacy" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="https://www.bitlance.work/terms" className="block py-1.5 sm:py-0 hover:text-gray-950 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
          <div>
            © 2026 Bitlance. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for the Bitcoin community.
          </div>
        </div>
      </div>
    </footer>
  );
}
