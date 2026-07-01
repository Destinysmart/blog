import { useEffect, useState } from "react";
import { Trash2, UserPlus, AlertTriangle, X, Shield, Plus } from "lucide-react";

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("publisher");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = () => {
    fetch("/api/users")
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = () => {
    if (!deleteId) return;
    setIsDeleting(true);
    fetch(`/api/users/${deleteId}`, { method: "DELETE" })
      .then(() => {
        fetchUsers();
        setDeleteId(null);
        setIsDeleting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsDeleting(false);
      });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    setIsSaving(true);

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newUserName, role: newUserRole })
    })
      .then(() => {
        setNewUserName("");
        setIsAddingUser(false);
        setIsSaving(false);
        fetchUsers();
      })
      .catch((err) => {
        console.error(err);
        setIsSaving(false);
      });
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight heading-display">Users</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage team members, roles, and platform publishers.</p>
        </div>
        {!isAddingUser && (
          <button 
            onClick={() => setIsAddingUser(true)}
            className="flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-full font-bold hover:bg-brand-600 transition-colors shadow-sm self-start sm:self-auto text-sm"
          >
            <UserPlus className="h-4.5 w-4.5" />
            Add User
          </button>
        )}
      </div>

      {isAddingUser && (
        <form onSubmit={handleAddUser} className="mb-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-500" /> Add Team Member
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAddingUser(false)} 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all" 
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                placeholder="Alice Satoshi"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Role</label>
              <select 
                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 bg-white font-medium text-sm transition-all"
                value={newUserRole}
                onChange={e => setNewUserRole(e.target.value)}
              >
                <option value="publisher">Publisher (Can write & edit articles)</option>
                <option value="admin">Administrator (Full control)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
            <button 
              type="button" 
              onClick={() => setIsAddingUser(false)} 
              disabled={isSaving}
              className="px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSaving ? "Saving..." : "Save Member"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-gray-50 border-b border-gray-150">
              <tr>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full bg-gray-100 border border-gray-150 shrink-0 object-cover" 
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-gray-950">{user.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      user.role === 'admin' 
                        ? 'bg-brand-50 text-brand-700 border-brand-100' 
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button 
                        onClick={() => setDeleteId(user.id)} 
                        className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Delete user"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-gray-400 font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
                <h3 className="text-lg font-bold text-gray-950 mb-1">Delete Team Member</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Are you sure you want to remove this team member? This will deactivate their publishing access.
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
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 border border-transparent rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
