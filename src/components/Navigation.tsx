import { useState, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";
import logoUrl from "../assets/images/bitlance_logo_1782869809232.jpg";

export function Navigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global cmd+k shortcut handling and custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    const handleCustomSearchOpen = () => {
      setIsSearchOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-global-search", handleCustomSearchOpen);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-global-search", handleCustomSearchOpen);
    };
  }, []);

  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <img 
              src={logoUrl} 
              alt="Bitlance Logo" 
              className="h-8 w-8 rounded-lg object-cover shadow-xs transition-transform duration-200 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="heading-display text-xl font-extrabold tracking-tight text-gray-950 transition-colors group-hover:text-brand-600">Bitlance</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Search trigger button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search articles"
            className="flex items-center justify-center md:justify-start gap-2 h-10 w-10 md:w-auto rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100/80 px-0 md:px-4 py-2 text-sm text-gray-500 transition-all duration-200 shadow-xs hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:scale-95 cursor-pointer"
          >
            <Search className="h-4 w-4 stroke-[2] md:stroke-[1.5] text-gray-400" />
            <span className="font-semibold text-gray-600 hidden md:inline">Search articles...</span>
            <kbd className="hidden lg:inline-flex ml-2 items-center rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Hamburger Menu Toggle Button (Mobile) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 active:scale-95 cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 stroke-[2] text-gray-950" />
            ) : (
              <Menu className="h-5 w-5 stroke-[2] text-gray-950" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-150 bg-white shadow-lg animate-slide-down">
          <div className="px-4 py-5 space-y-4">
            <div className="text-center py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              No extra sections to display. Use search to discover articles.
            </div>
          </div>
        </div>
      )}
    </nav>
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
