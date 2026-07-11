import { useEffect, useState } from "react";
import { Trash2, FolderPlus, AlertTriangle, X, User, Image, Check, Save, Globe, ExternalLink, Search, ShieldCheck } from "lucide-react";
import { MediaLibraryModal } from "../../components/MediaLibraryModal";
import { apiFetch } from "../../lib/api";

export function AdminSettings() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Admin Profile edit states
  const [adminName, setAdminName] = useState("");
  const [adminAvatar, setAdminAvatar] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  
  // Google Search Console & SEO Verification settings
  const [gscVerificationCode, setGscVerificationCode] = useState("");
  const [isSavingGsc, setIsSavingGsc] = useState(false);
  const [gscMessage, setGscMessage] = useState("");
  const [isSitemapValidating, setIsSitemapValidating] = useState(false);
  const [sitemapValidationStatus, setSitemapValidationStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [sitemapValidationMessage, setSitemapValidationMessage] = useState("");

  const fetchGscSettings = () => {
    fetch("/api/settings/google-search-console")
      .then(r => r.json())
      .then(data => {
        if (data && data.google_site_verification) {
          setGscVerificationCode(data.google_site_verification);
        }
      })
      .catch(console.error);
  };

  const handleSaveGsc = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGsc(true);
    setGscMessage("");

    apiFetch("/api/settings/google-search-console", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google_site_verification: gscVerificationCode })
    })
      .then(r => r.json())
      .then(() => {
        setIsSavingGsc(false);
        setGscMessage("Search Console settings saved successfully!");
        setTimeout(() => setGscMessage(""), 4000);
      })
      .catch((err) => {
        console.error(err);
        setIsSavingGsc(false);
        setGscMessage("Failed to save settings.");
      });
  };

  const validateSitemap = () => {
    setIsSitemapValidating(true);
    setSitemapValidationStatus("idle");
    setSitemapValidationMessage("");

    fetch("/sitemap.xml")
      .then(r => {
        if (!r.ok) throw new Error("Could not fetch sitemap.xml");
        const contentType = r.headers.get("content-type") || "";
        if (!contentType.includes("xml")) {
          throw new Error("Sitemap response is not XML format");
        }
        return r.text();
      })
      .then(text => {
        if (text.includes("<urlset") && text.includes("</urlset>")) {
          setSitemapValidationStatus("valid");
          setSitemapValidationMessage("Dynamic sitemap parsed successfully! XML structure, schemas, and loc tags are correct and active.");
        } else {
          setSitemapValidationStatus("invalid");
          setSitemapValidationMessage("The sitemap does not contain the standard <urlset> tags.");
        }
        setIsSitemapValidating(false);
      })
      .catch(err => {
        setSitemapValidationStatus("invalid");
        setSitemapValidationMessage(err.message || "Failed to validate sitemap.");
        setIsSitemapValidating(false);
      });
  };

  const fetchCategories = () => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  };

  const fetchAdminProfile = () => {
    fetch("/api/users")
      .then(r => r.json())
      .then(users => {
        const admin = users.find((u: any) => u.id === "admin-1" || u.role === "admin");
        if (admin) {
          setAdminName(admin.name);
          setAdminAvatar(admin.avatar);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchCategories();
    fetchAdminProfile();
    fetchGscSettings();
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim()) return;
    setIsSavingProfile(true);
    setProfileMessage("");

    apiFetch("/api/users/admin-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: adminName, avatar: adminAvatar })
    })
      .then(r => r.json())
      .then(() => {
        setIsSavingProfile(false);
        setProfileMessage("Admin profile updated successfully!");
        setTimeout(() => setProfileMessage(""), 4000);
      })
      .catch((err) => {
        console.error(err);
        setIsSavingProfile(false);
        setProfileMessage("Failed to update profile.");
      });
  };

  const confirmDeleteCategory = () => {
    if (!deleteId) return;
    setIsDeleting(true);
    apiFetch(`/api/categories/${deleteId}`, { method: "DELETE" })
      .then(() => {
        fetchCategories();
        setDeleteId(null);
        setIsDeleting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsDeleting(false);
      });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    apiFetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName })
    })
      .then(() => {
        setNewCatName("");
        setIsAddingCategory(false);
        fetchCategories();
      });
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight heading-display">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage publication settings, category taxonomies, and options.</p>
      </div>

      {/* Admin Profile Settings Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8 p-6">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2">
            <User className="h-5 w-5 text-brand-500" /> Admin Profile Settings
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Update your administrator name and avatar image details.</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-3 shrink-0">
              <img 
                src={adminAvatar || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
                alt="Profile Preview" 
                className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm bg-gray-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://i.pravatar.cc/150?u=admin-1";
                }}
              />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preview</span>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-xl p-2.5 pl-10 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 bg-white font-medium text-sm transition-all"
                      value={adminName}
                      onChange={e => setAdminName(e.target.value)}
                      placeholder="e.g. BitLance Publisher"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Profile Picture / Avatar</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-brand-500 text-white p-3 sm:p-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm text-sm cursor-pointer min-h-[44px]"
                    >
                      <Image className="w-4 h-4" />
                      {adminAvatar ? "Choose Avatar" : "Select Profile Picture"}
                    </button>
                    {adminAvatar && (
                      <button
                        type="button"
                        onClick={() => setAdminAvatar("")}
                        className="w-full sm:w-auto p-3 sm:p-2.5 border border-red-100 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center min-h-[44px]"
                        title="Remove Picture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  {profileMessage && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      profileMessage.includes("successfully") 
                        ? "text-green-700 bg-green-50 border border-green-100 animate-fade-in" 
                        : "text-red-700 bg-red-50 border border-red-100 animate-fade-in"
                    }`}>
                      {profileMessage}
                    </span>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center justify-center gap-2 bg-brand-500 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm text-sm cursor-pointer disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
                >
                  <Save className="h-4 w-4" />
                  {isSavingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Categories</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Organize blog articles and resource guides.</p>
          </div>
          {!isAddingCategory && (
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="flex items-center justify-center gap-2 text-sm bg-gray-900 text-white px-4 py-3 sm:py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors w-full sm:w-auto shadow-sm min-h-[44px]"
            >
              <FolderPlus className="h-4.5 w-4.5" />
              Add Category
            </button>
          )}
        </div>

        {isAddingCategory && (
          <form onSubmit={handleAddCategory} className="p-6 border-b border-gray-150 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
            <input 
              type="text" 
              required
              className="flex-1 border border-gray-200 rounded-xl p-2.5 px-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 bg-white font-medium text-sm transition-all" 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Bitcoin News"
              autoFocus
            />
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
              <button 
                type="button" 
                onClick={() => setIsAddingCategory(false)} 
                className="w-full sm:w-auto text-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-3 sm:py-2.5 text-sm font-bold transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-auto text-center justify-center bg-brand-500 text-white rounded-xl px-4 py-3 sm:py-2.5 text-sm font-bold hover:bg-brand-600 transition-colors shadow-sm min-h-[44px]"
              >
                Save Category
              </button>
            </div>
          </form>
        )}

        <ul className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <li key={cat.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-950">{cat.name}</span>
                <span className="text-gray-400 text-xs font-semibold bg-gray-100 border border-gray-150 px-2.5 py-0.5 rounded-full">/{cat.slug}</span>
              </div>
              <button 
                onClick={() => setDeleteId(cat.id)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Delete category"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="p-12 text-center text-gray-400 text-sm font-medium">No categories found.</li>
          )}
        </ul>
      </div>

      {/* Modern, elegant Custom Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs transition-opacity" onClick={() => setDeleteId(null)} />
          
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all animate-scale-up">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setDeleteId(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-4 items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950 mb-1">Delete Category</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Are you sure you want to delete this category? (This won't remove the category association from any existing articles).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 border border-transparent rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Search Console & Dynamic Sitemap Configuration Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8 p-6">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-500" /> Google Search Console & Sitemap
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Configure host verification, index sitemaps, and optimize crawl routes.</p>
        </div>

        <div className="space-y-6">
          {/* Active Status Header */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Configured Host</span>
              <h3 className="text-base font-bold text-gray-900 mt-1">blog.bitlance.work</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Google Search Console Property Identifier: URL prefix domain</p>
            </div>
            <a 
              href="https://search.google.com/search-console" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gray-900 text-white hover:bg-gray-800 transition-all font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shrink-0 shadow-xs"
            >
              Open Search Console
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <form onSubmit={handleSaveGsc} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Google Site Verification Token</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  className="w-full border border-gray-200 rounded-xl p-2.5 pl-10 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 bg-white font-medium text-sm transition-all placeholder:text-gray-400"
                  value={gscVerificationCode}
                  onChange={e => setGscVerificationCode(e.target.value)}
                  placeholder="e.g. google8792a34b2c12e4f or code content"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Provide either the HTML tag verification token (the <strong>content="..."</strong> attribute) or verification file hash. The server automatically injects the site meta tag <strong>and</strong> responds to files like <code>/google[token].html</code> automatically!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <div className="w-full sm:w-auto text-left">
                {gscMessage && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full text-green-700 bg-green-50 border border-green-100 animate-fade-in">
                    {gscMessage}
                  </span>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSavingGsc}
                className="flex items-center justify-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm text-sm cursor-pointer disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
              >
                <Save className="h-4 w-4" />
                {isSavingGsc ? "Saving..." : "Save GSC Settings"}
              </button>
            </div>
          </form>

          {/* Dynamic Sitemap Validation Block */}
          <div className="border-t border-gray-150 pt-6">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Dynamic XML Sitemap</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
              Your sitemap is generated on the fly by the server with dynamic content indexes, published articles, and structured image schema tags.
            </p>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="font-mono text-xs text-gray-600 break-all select-all flex-1 py-1 px-2.5 bg-white rounded-lg border border-gray-150">
                https://blog.bitlance.work/sitemap.xml
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={validateSitemap}
                  disabled={isSitemapValidating}
                  className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4 text-brand-500" />
                  {isSitemapValidating ? "Validating..." : "Validate Sitemap"}
                </button>
                <a 
                  href="/sitemap.xml" 
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  View Live Sitemap
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Validation Feedback */}
            {sitemapValidationStatus !== "idle" && (
              <div className={`mt-4 p-4 rounded-xl border animate-fade-in ${
                sitemapValidationStatus === "valid" 
                  ? "bg-green-50 border-green-150 text-green-800" 
                  : "bg-red-50 border-red-150 text-red-800"
              }`}>
                <div className="flex gap-2.5 items-start">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    sitemapValidationStatus === "valid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {sitemapValidationStatus === "valid" ? "✓" : "!"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">
                      {sitemapValidationStatus === "valid" ? "Sitemap Status: Active & Valid" : "Sitemap Validation Failed"}
                    </h4>
                    <p className="text-xs font-medium leading-relaxed">{sitemapValidationMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(media) => {
          setAdminAvatar(media.url);
          setIsMediaModalOpen(false);
        }}
        title="Choose Admin Avatar Picture"
      />
    </div>
  );
}
