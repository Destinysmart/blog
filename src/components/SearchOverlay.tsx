import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Newspaper, TrendingUp, Zap, Clock, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Robust, safe text highlighting component to highlight search matches
function HighlightText({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-brand-100 text-brand-900 font-bold px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cache of recent search terms in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem("bitlance_recent_searches");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Track and save recent search terms
  const addToRecentSearches = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned || cleaned.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== cleaned.toLowerCase());
      const next = [cleaned, ...filtered].slice(0, 5); // limit to 5
      try {
        localStorage.setItem("bitlance_recent_searches", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to persist search terms", e);
      }
      return next;
    });
  };

  // Debounce logic: update debouncedQuery 200ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Fetch published articles, categories, and authors on mount / open
  useEffect(() => {
    if (!isOpen) return;

    fetch("/api/articles?status=published")
      .then((r) => r.json())
      .then((data) => setArticles(data))
      .catch(console.error);

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(console.error);

    fetch("/api/topics")
      .then((r) => r.json())
      .then((data) => setTopics(data))
      .catch(console.error);

    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error);

    // Focus input field on open
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  }, [isOpen]);

  // Clean raw HTML to plain text and extract relevant match snippet
  const getContentSnippet = (content: string, q: string) => {
    const plainText = (content || "").replace(/<[^>]+>/g, " ");
    const idx = plainText.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) {
      return plainText.substring(0, 110) + "...";
    }
    const start = Math.max(0, idx - 40);
    const end = Math.min(plainText.length, idx + q.length + 70);
    let snippet = plainText.substring(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < plainText.length) snippet = snippet + "...";
    return snippet;
  };

  // Dynamic ranking & search engine matching published content
  const q = debouncedQuery.toLowerCase().trim();
  const filteredResults = q.length === 0 ? [] : articles.map((article) => {
    const title = (article.title || "").toLowerCase();
    const subtitle = (article.subtitle || "").toLowerCase();
    const contentRaw = (article.content || "").replace(/<[^>]+>/g, " ").toLowerCase();
    
    // Check categories
    const category = categories.find(c => c.id === article.category_id);
    const catName = category ? category.name.toLowerCase() : "";
    
    // Check tags
    const tags = Array.isArray(article.tags) ? article.tags.map(t => String(t).toLowerCase()) : [];
    
    // Check author
    const author = users.find(u => u.id === article.author_id);
    const authorName = author ? author.name.toLowerCase() : "";

    // Check reading time
    const readingTime = getReadingTime(article).toLowerCase();

    let score = 0;

    // Prioritize exact/prefix matches in title
    if (title.includes(q)) {
      if (title === q) score += 100;
      else if (title.startsWith(q)) score += 50;
      else score += 30;
    }
    
    // Match categories (Category search)
    if (catName.includes(q)) score += 40;
    
    // Match topics (Topic search)
    const matchedTopic = topics.find(t => t.name.toLowerCase().includes(q) || q.includes(t.name.toLowerCase()));
    if (matchedTopic) {
      const topicNameLower = matchedTopic.name.toLowerCase();
      if (tags.some(tag => tag.includes(topicNameLower))) score += 35;
      else if (title.includes(topicNameLower)) score += 20;
    }
    
    // Match tags
    if (tags.some(tag => tag.includes(q))) score += 30;
    
    // Match author (Author search)
    if (authorName.includes(q)) score += 25;
    
    // Match reading time (e.g., "5 min read", "5 min")
    if (readingTime.includes(q) || q.includes(readingTime.replace(" read", ""))) score += 20;
    
    if (subtitle.includes(q)) score += 10;
    if (contentRaw.includes(q)) score += 5;

    return { article, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.article);

  // Dynamic Popular Searches automatically compiled from views and published dates in the CMS
  const popularSearchTerms = [...articles]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0) || new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
    .slice(0, 4)
    .map(art => art.title);

  // Dynamic Suggested Topics generated directly from the CMS categories
  const suggestedTopics = categories.map(cat => {
    let iconName = "FileText";
    let iconBg = "bg-blue-50 text-blue-600 group-hover:bg-blue-100";
    
    const nameLower = cat.name.toLowerCase();
    if (nameLower.includes("lightning")) {
      iconName = "Zap";
      iconBg = "bg-amber-50 text-amber-600 group-hover:bg-amber-100";
    } else if (nameLower.includes("bitcoin")) {
      iconName = "TrendingUp";
      iconBg = "bg-brand-50 text-brand-600 group-hover:bg-brand-100";
    } else if (nameLower.includes("freelanc") || nameLower.includes("work") || nameLower.includes("job")) {
      iconName = "Newspaper";
      iconBg = "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100";
    }
    
    return {
      id: cat.id,
      name: cat.name,
      icon: iconName,
      bg: iconBg,
      description: `Guides, updates, and templates for ${cat.name}`
    };
  });

  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Zap": return <Zap className="h-5 w-5 stroke-[2]" />;
      case "TrendingUp": return <TrendingUp className="h-5 w-5 stroke-[2]" />;
      case "Newspaper": return <Newspaper className="h-5 w-5 stroke-[2]" />;
      default: return <FileText className="h-5 w-5 stroke-[2]" />;
    }
  };

  const getAuthorName = (authorId: string) => {
    const user = users.find((u) => u.id === authorId);
    return user ? user.name : "Bitlance Team";
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Bitlance";
  };

  const getReadingTime = (art: any) => {
    if (art.reading_time) return art.reading_time;
    const words = (art.content || "").replace(/<[^>]+>/g, "").split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Reset indices on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [inputValue]);

  // Keyboard navigation & global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        if (filteredResults.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filteredResults.length);
        }
      } else if (e.key === "ArrowUp") {
        if (filteredResults.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
        }
      } else if (e.key === "Enter") {
        if (filteredResults.length > 0 && activeIndex >= 0 && activeIndex < filteredResults.length) {
          e.preventDefault();
          const target = filteredResults[activeIndex];
          addToRecentSearches(inputValue);
          navigate(`/article/${target.slug || target.id}`);
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, filteredResults, activeIndex, navigate, inputValue]);

  const handleSelectSuggestion = (term: string) => {
    setInputValue(term);
    setDebouncedQuery(term);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleArticleClick = (art: any) => {
    addToRecentSearches(inputValue || art.title);
    navigate(`/article/${art.slug || art.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col pt-0 sm:pt-24 px-0 sm:px-6">
          {/* Blur Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Search container */}
          <motion.div 
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-2xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[85vh] border border-gray-100"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center border-b border-gray-150 px-4 min-h-[64px] sm:min-h-[70px]">
              <Search className="h-5 w-5 text-gray-400 stroke-[2] shrink-0" />
              <input
                ref={inputRef}
                autoFocus
                type="text"
                className="w-full bg-transparent px-3 py-5 text-base sm:text-lg text-gray-950 placeholder:text-gray-400 outline-none font-medium"
                placeholder="Search articles, guides, and tutorials..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="flex items-center gap-2">
                {inputValue && (
                  <button
                    onClick={() => setInputValue("")}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4 stroke-[2.5]" />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950 transition-colors font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Content Results & Suggestions */}
            <div className="overflow-y-auto px-4 sm:px-6 py-6 bg-gray-50/45 flex-1 max-h-[calc(100vh-130px)] sm:max-h-[55vh]">
              {inputValue.trim().length === 0 ? (
                <div className="space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Recent Searches
                        </h3>
                        <button 
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("bitlance_recent_searches");
                          }}
                          className="text-[10px] text-gray-400 hover:text-gray-600 font-bold tracking-tight hover:underline cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 px-1">
                        {recentSearches.map((term) => (
                          <button 
                            key={term} 
                            onClick={() => handleSelectSuggestion(term)} 
                            className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/20 transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Popular Searches (from published content in CMS) */}
                  {popularSearchTerms.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-1 flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2 px-1">
                        {popularSearchTerms.map((term) => (
                          <button 
                            key={term} 
                            onClick={() => handleSelectSuggestion(term)} 
                            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/20 transition-all shadow-xs active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            {term.length > 40 ? term.substring(0, 40) + "..." : term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Suggested Topics (from CMS categories) */}
                  {suggestedTopics.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-1">
                        Suggested Topics
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {suggestedTopics.map((topic) => (
                          <button 
                            key={topic.id} 
                            onClick={() => handleSelectSuggestion(topic.name)} 
                            className="flex items-center gap-3.5 w-full p-3 rounded-xl hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-gray-250/20 transition-all group text-left cursor-pointer border border-transparent hover:border-gray-200"
                          >
                             <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${topic.bg}`}>
                               {renderCategoryIcon(topic.icon)}
                             </div>
                             <div className="min-w-0 flex-1">
                               <h4 className="text-sm font-bold text-gray-950 group-hover:text-brand-600 transition-colors">
                                 {topic.name}
                               </h4>
                               <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                                 {topic.description}
                               </p>
                             </div>
                             <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3 px-1">
                      Search Results ({filteredResults.length})
                    </h3>
                    
                    <div className="space-y-2">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((art, idx) => {
                          const isSelected = idx === activeIndex;
                          const excerpt = getContentSnippet(art.content || "", inputValue);
                          const categoryName = getCategoryName(art.category_id);
                          
                          return (
                            <div
                              key={art.id}
                              onClick={() => handleArticleClick(art)}
                              className={`flex flex-col sm:flex-row items-start gap-3.5 w-full p-3.5 rounded-xl transition-all duration-150 group animate-fade-in cursor-pointer border ${
                                isSelected
                                  ? "bg-white border-brand-200 ring-2 ring-brand-500/10 shadow-sm sm:translate-x-1"
                                  : "bg-white/50 hover:bg-white border-gray-100 hover:border-gray-200 hover:shadow-xs"
                              }`}
                            >
                              {/* Thumbnail */}
                              {art.featured_image ? (
                                <img 
                                  src={art.featured_image} 
                                  alt="" 
                                  className="h-20 w-full sm:h-14 sm:w-20 object-cover rounded-lg shrink-0 bg-gray-50 border border-gray-100"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="h-20 w-full sm:h-14 sm:w-20 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 shrink-0">
                                  <FileText className="h-5 w-5" />
                                </div>
                              )}
                              
                              {/* Metadata and content info */}
                              <div className="text-left flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 bg-brand-50/50 px-2 py-0.5 rounded-md">
                                    {categoryName}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-semibold">•</span>
                                  <span className="text-[10px] text-gray-400 font-semibold">
                                    {formatDate(art.published_at || art.created_at)}
                                  </span>
                                </div>
                                
                                <h4 className={`text-sm sm:text-base font-bold text-gray-950 transition-colors ${
                                  isSelected ? "text-brand-600" : "group-hover:text-brand-600"
                                }`}>
                                  <HighlightText text={art.title} search={inputValue} />
                                </h4>
                                
                                <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed line-clamp-2">
                                  <HighlightText text={excerpt} search={inputValue} />
                                </p>
                                
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2 font-bold">
                                  <span className="text-gray-600">
                                    By {getAuthorName(art.author_id)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {getReadingTime(art)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-12 px-4 text-center">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
                            <Search className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-950 mb-1">
                            No articles found
                          </h4>
                          <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto mb-4 leading-relaxed">
                            Try searching for a different keyword or browse our latest Bitcoin freelancing guides.
                          </p>
                          <button
                            onClick={() => {
                              setInputValue("");
                              setDebouncedQuery("");
                            }}
                            className="inline-flex items-center justify-center bg-gray-950 hover:bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Browse All Articles
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Guidance Footer (Hidden on Mobile) */}
            <div className="hidden sm:flex bg-white px-6 py-3 border-t border-gray-150 items-center justify-between text-[11px] text-gray-400 font-bold select-none shrink-0">
               <div className="flex items-center gap-4">
                 <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-gray-500">↑↓</kbd> to navigate</span>
                 <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-gray-500">enter</kbd> to open</span>
               </div>
               <span className="flex items-center gap-1"><kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-gray-500">esc</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
