import React, { useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, Users, LogOut, Menu, X, Image as ImageIcon } from "lucide-react";
import { MediaLibraryModal } from "../../components/MediaLibraryModal";

export function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 min-h-[44px] rounded-xl font-semibold text-sm transition-all duration-200 ${
      isActive
        ? "bg-brand-50 text-brand-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row overflow-hidden">
      {/* Mobile Header Bar */}
      <header className="flex md:hidden items-center justify-between px-4 h-16 bg-white border-b border-gray-200 z-50 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-extrabold shadow-sm">B</div>
          <span className="font-extrabold text-gray-900 tracking-tight text-lg">Bitlance CMS</span>
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          aria-label="Toggle admin navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-lg z-40 animate-fade-in flex flex-col p-4 gap-2">
          <NavLink to="/admin" end onClick={() => setIsMobileMenuOpen(false)} className={navClass}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/articles" onClick={() => setIsMobileMenuOpen(false)} className={navClass}>
            <FileText className="h-5 w-5" />
            Articles
          </NavLink>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsMediaLibraryOpen(true);
            }}
            className="flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 min-h-[44px] rounded-xl font-semibold text-sm transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer w-full text-left"
          >
            <ImageIcon className="h-5 w-5" />
            Media Library
          </button>
          <NavLink to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={navClass}>
            <Users className="h-5 w-5" />
            Users
          </NavLink>
          <NavLink to="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className={navClass}>
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button onClick={() => { localStorage.removeItem("mock_admin"); window.location.href = "/"; }} className="w-full flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 min-h-[44px] text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors rounded-xl hover:bg-gray-50">
              <LogOut className="h-5 w-5" />
              Exit to Site
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-extrabold shadow-sm">B</div>
          <span className="font-extrabold text-gray-900 tracking-tight text-lg">Bitlance CMS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={navClass}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/articles" className={navClass}>
            <FileText className="h-5 w-5" />
            Articles
          </NavLink>
          <button
            onClick={() => setIsMediaLibraryOpen(true)}
            className="flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 min-h-[44px] rounded-xl font-semibold text-sm transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer w-full text-left"
          >
            <ImageIcon className="h-5 w-5" />
            Media Library
          </button>
          <NavLink to="/admin/users" className={navClass}>
            <Users className="h-5 w-5" />
            Users
          </NavLink>
          <NavLink to="/admin/settings" className={navClass}>
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
           <button onClick={() => { localStorage.removeItem("mock_admin"); window.location.href = "/"; }} className="w-full flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-2.5 min-h-[44px] text-gray-500 hover:text-gray-950 font-semibold text-sm transition-colors hover:bg-gray-50 rounded-xl">
             <LogOut className="h-5 w-5" />
             Exit to Site
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full min-w-0">
        <Outlet />
      </main>

      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={() => setIsMediaLibraryOpen(false)}
        title="Centralized Media Library Manager"
      />
    </div>
  );
}
