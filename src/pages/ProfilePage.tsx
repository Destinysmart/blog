import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { Bookmark, Clock, Trash2, Users, FileText, ArrowRight, Sparkles } from "lucide-react";
import { Breadcrumbs } from "../components/Breadcrumbs";

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'following'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
    details?: any;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("registeredUser");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchData = () => {
    setLoading(true);
    
    const fetchBookmarks = fetch("/api/bookmarks", { headers: { "x-user-id": "user_1" } }).then(r => r.json());
    const fetchFeed = fetch("/api/follows/feed", { headers: { "x-user-id": "user_1" } }).then(r => r.json());

    Promise.all([fetchBookmarks, fetchFeed])
      .then(([bookmarksData, feedData]) => {
        setBookmarks(bookmarksData);
        setFeed(feedData);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeBookmark = (articleId: string) => {
    fetch(`/api/bookmarks/${articleId}`, { 
      method: "DELETE",
      headers: { "x-user-id": "user_1" }
    }).then(() => {
      setBookmarks(bookmarks.filter(b => b.id !== articleId));
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO 
        title="My Reader Profile & Reading List - BitLance" 
        description="Access your saved Bitcoin guides, freelance tutorials, remote work articles, and followed author feeds on your customized BitLance profile page." 
        canonicalUrl="https://bitlance.work/profile"
        personSchema={{
          name: "Bitlance Reader",
          description: "Active reader and contributor on BitLance, exploring remote work, decentralized micro-payroll, and Bitcoin developments.",
          jobTitle: "Bitcoin Economy Contributor",
          skills: ["Bitcoin", "Lightning Network", "Remote Work", "Digital Payments"]
        }}
        breadcrumbs={[
          { name: "Blog", item: "/" },
          { name: "Profile", item: "/profile" }
        ]}
      />
      <Navigation />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-6">
          <Breadcrumbs items={[{ name: "Profile", path: "/profile" }]} />
        </div>
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img src={user?.avatar || "https://i.pravatar.cc/150?u=user_1"} alt="Profile avatar" className="w-20 h-20 rounded-full border border-gray-200 object-cover shadow-sm" loading="lazy" referrerPolicy="no-referrer" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.name || "My Profile"}</h1>
              <p className="text-gray-500 font-medium">Logged in as {user?.role || "Reader"}</p>
              {user?.email && <p className="text-xs text-gray-400 mt-1 font-mono font-semibold">{user.email}</p>}
            </div>
          </div>
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("registeredUser");
                setUser(null);
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-all self-start md:self-auto cursor-pointer"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Customized Dashboard Widgets */}
        {user && (
          <div className="bg-gradient-to-br from-brand-50/40 to-white rounded-3xl p-6 border border-brand-100 shadow-xs mb-8">
            <h2 className="text-sm font-extrabold text-gray-950 mb-4 flex items-center gap-2 tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
              {user.role} Dashboard Details
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {user.role === "Client" ? (
                <>
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Company Profile</span>
                    <span className="font-bold text-gray-900 text-sm">{user.details?.companyName || "Personal/Independent"}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Job Project</span>
                    <span className="font-bold text-gray-900 text-sm line-clamp-1">{user.details?.projectBrief || "None started"}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Milestone Budget</span>
                    <span className="font-bold text-brand-600 text-sm">{user.details?.budgetSats ? `${Number(user.details.budgetSats).toLocaleString()} sats` : "Not specified"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Professional Specialty</span>
                    <span className="font-bold text-gray-900 text-sm line-clamp-1">{user.details?.specialty || "General Contractor"}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Lightning Address (Payouts)</span>
                    <span className="font-bold text-brand-600 text-sm font-mono truncate block" title={user.details?.lightningAddress}>{user.details?.lightningAddress}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Portfolio & Proof of Work</span>
                    <span className="font-bold text-gray-900 text-sm truncate block">
                      {user.details?.portfolioUrl ? (
                        <a href={user.details.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-600 font-semibold">{user.details.portfolioUrl}</a>
                      ) : (
                        "Not provided"
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'bookmarks' 
                ? 'border-brand-500 text-brand-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeTab === 'bookmarks' ? 'fill-current' : ''}`} /> My Reading List
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'following' 
                ? 'border-brand-500 text-brand-600' 
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" /> Following Feed
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading your profile...</div>
        ) : (
          <>
            {/* Reading List Tab */}
            {activeTab === 'bookmarks' && (
              <>
                {bookmarks.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Bookmark className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No saved articles</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                      Articles you bookmark will appear here so you can read them later.
                    </p>
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                      Explore Articles
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {bookmarks.map(article => (
                      <div key={article.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start group hover:shadow-md transition-shadow">
                        {article.featured_image && (
                          <Link to={`/article/${article.slug || article.id}`} className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 block">
                            <img 
                              src={article.featured_image} 
                              alt={article.title || "Bookmarked article"} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </Link>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                              <Link to={`/article/${article.slug || article.id}`}>
                                <h3 className="text-xl font-bold text-gray-900 hover:text-brand-600 transition-colors mb-2 line-clamp-2">
                                  {article.title}
                                </h3>
                              </Link>
                              <p className="text-gray-500 line-clamp-2 text-sm mb-4">
                                {article.subtitle || article.content?.replace(/<[^>]+>/g, '').substring(0, 150)}
                              </p>
                              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                                <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                                {article.reading_time && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{article.reading_time}</span>
                                  </div>
                                )}
                                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                                  Saved {new Date(article.bookmarked_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <button 
                              onClick={() => removeBookmark(article.id)}
                              className="p-2 sm:p-3 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors shrink-0 self-start sm:self-auto flex items-center justify-center border border-red-100"
                              title="Remove bookmark"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Following Feed Tab */}
            {activeTab === 'following' && (
              <>
                {feed.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No updates yet</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                      Follow authors to see their latest articles appear here in your feed.
                    </p>
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
                      Find Authors
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {feed.map(article => (
                      <Link key={article.id} to={`/article/${article.slug || article.id}`} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                        {article.featured_image && (
                          <div className="aspect-[16/9] mb-6 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                            <img 
                              src={article.featured_image} 
                              alt={article.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs font-semibold text-brand-600 mb-3 tracking-wider uppercase">
                          <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-6 flex-1 text-sm">
                          {article.subtitle || article.content?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                        </p>
                        <div className="flex items-center font-semibold text-sm text-brand-600 group-hover:gap-2 gap-1.5 transition-all mt-auto">
                          Read article <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
