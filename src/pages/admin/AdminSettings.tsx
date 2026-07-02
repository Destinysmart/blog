import { useEffect, useState } from "react";
import { Trash2, FolderPlus, AlertTriangle, X, User, Image, Check, Save } from "lucide-react";
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
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-500 text-white p-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm text-xs cursor-pointer"
                    >
                      <Image className="w-4 h-4" />
                      {adminAvatar ? "Choose Avatar" : "Select Profile Picture"}
                    </button>
                    {adminAvatar && (
                      <button
                        type="button"
                        onClick={() => setAdminAvatar("")}
                        className="p-2.5 border border-red-100 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                        title="Remove Picture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <div>
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
                  className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm text-sm cursor-pointer disabled:opacity-50"
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
              className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors self-start sm:self-auto shadow-sm"
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
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                type="button" 
                onClick={() => setIsAddingCategory(false)} 
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-brand-500 text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-brand-600 transition-colors shadow-sm"
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
