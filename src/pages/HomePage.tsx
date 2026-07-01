import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
  ArrowRight,
  Clock,
  ChevronDown,
  TrendingUp,
  Zap,
  Newspaper,
  FileText,
  Users,
  Briefcase,
  Lock,
  CheckCircle,
  Sparkles,
  Flame,
  BookOpen,
  Award,
} from "lucide-react";

// Structured FAQ list targeting high-intent inquiries for SEO & AI Overviews
const HOMEPAGE_FAQS = [
  {
    question: "How do Bitcoin-native freelance payments work on BitLance?",
    answer: "On BitLance, work is organized into milestones. Before a freelancer begins working, the client funds a secure milestone-based Lightning escrow by creating and paying a Lightning invoice directly inside the Messages chat. When the milestone is successfully completed and verified, the client clicks 'Approve and Pay'. This automatically releases the escrowed sats directly to the freelancer's payout Lightning address, with no platform-side deductions from their earnings."
  },
  {
    question: "What are the benefits of using the Lightning Network for remote payroll?",
    answer: "The Lightning Network allows for instant, cross-border payments with near-zero transaction fees. Instead of waiting days for legacy wire transfers or paying high currency conversion fees, employers can run automated global payouts to freelancers worldwide instantly, settling in sats directly to their personal self-custodial wallets."
  },
  {
    question: "What are the platform fees and how do they work?",
    answer: "BitLance is highly developer-friendly: freelancers keep 100% of their agreed earnings—absolutely zero fees are deducted from their payouts. Instead, the client pays a flat 5% platform fee. The escrow invoice generated in the Messages chat itemizes this fee (for example, a 2,500 sat milestone is invoiced as 2,625 sats including the 125 sat fee), which stays behind on payout release."
  }
];

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-gray-950 hover:bg-gray-50/50 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-brand-500" : ""}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] border-t border-gray-50 p-6" : "max-h-0 overflow-hidden"}`}>
        <p className="text-gray-600 text-sm leading-relaxed font-medium">{answer}</p>
      </div>
    </div>
  );
}

const QUICK_FILTERS = [
  { id: "all", label: "All Posts", type: "all", slug: "", icon: Sparkles },
  { id: "trending", label: "Trending", type: "featured", slug: "trending", icon: Flame },
  { id: "tutorials", label: "Tutorials", type: "category", slug: "tutorials", icon: BookOpen },
  { id: "success-stories", label: "Success Stories", type: "category", slug: "success-stories", icon: Award },
  { id: "product", label: "Product", type: "category", slug: "product", icon: Zap }
];

export function HomePage() {
  const { categorySlug, topicSlug, featuredSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState<"categories" | "topics" | "featured" | null>(null);

  // Dynamic feed tab state ("trending" or "recommended")
  const [activeFeedTab, setActiveFeedTab] = useState<"trending" | "recommended">("trending");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(console.error);

    // Fetch topics
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data) => setTopics(data))
      .catch(console.error);

    // Fetch featured collections
    fetch("/api/featured-collections")
      .then((r) => r.json())
      .then((data) => setFeaturedCollections(data))
      .catch(console.error);

    // Fetch users
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error);

    // Fetch published articles
    fetch("/api/articles?status=published")
      .then((r) => r.json())
      .then((data) => {
        // Sort articles by date descending
        const sorted = data.sort(
          (a: any, b: any) =>
            new Date(b.published_at || b.created_at).getTime() -
            new Date(a.published_at || a.created_at).getTime(),
        );
        setArticles(sorted);
      })
      .catch(console.error);
  }, []);

  // Outside click handler for dropdowns
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const finalCategorySlug = categorySlug || searchParams.get("category");
  const finalTopicSlug = topicSlug || searchParams.get("topic");
  const finalFeaturedSlug = featuredSlug || searchParams.get("featured");

  const activeCategoryObj = categories.find((c) => c.slug === finalCategorySlug);
  const activeTopicObj = topics.find((t) => t.slug === finalTopicSlug);
  const activeFeaturedObj = featuredCollections.find((f) => f.slug === finalFeaturedSlug);

  // Filter articles based on active selections
  const filteredArticles = articles.filter((article) => {
    // 1. Filter by category
    if (activeCategoryObj && article.category_id !== activeCategoryObj.id) {
      return false;
    }
    // 2. Filter by topic
    if (activeTopicObj) {
      const topicNameLower = activeTopicObj.name.toLowerCase();
      const hasTag = article.tags?.some((t: string) => t.toLowerCase() === topicNameLower);
      const inTitle = article.title?.toLowerCase().includes(topicNameLower);
      const inSubtitle = article.subtitle?.toLowerCase().includes(topicNameLower);
      if (!hasTag && !inTitle && !inSubtitle) {
        return false;
      }
    }
    // 3. Filter by featured collection
    if (activeFeaturedObj) {
      const fSlug = activeFeaturedObj.slug;
      if (fSlug === "editors-picks") {
        return ["a_1", "a_3", "a_6"].includes(article.id);
      }
      if (fSlug === "most-popular" || fSlug === "trending") {
        return article.view_count > 2500;
      }
      if (fSlug === "latest") {
        return true; // Already sorted latest first
      }
      if (fSlug === "beginner-friendly") {
        return article.category_id === "c3" || article.category_id === "c4" || article.tags?.includes("Tutorials");
      }
      if (fSlug === "recently-updated") {
        return !!article.updated_at;
      }
    }
    return true;
  });

  // Calculate featured article (always the latest article within the filtered set, or overall)
  const featured = filteredArticles[0];
  const listArticles = filteredArticles.slice(1);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(listArticles.length / pageSize));

  // Handle page limits when selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, topicSlug, featuredSlug, searchParams]);

  const startIndex = (currentPage - 1) * pageSize;
  const displayedArticles = listArticles.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Dynamic Trending & Recommended arrays compiled directly from CMS data
  const trendingArticles = [...articles]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 3);

  const recommendedReading = [...articles]
    .filter((a) => !featured || a.id !== featured.id)
    .slice(0, 3);

  const activeGridArticles = activeFeedTab === "trending" ? trendingArticles : recommendedReading;

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Resources";
  };

  const getAuthor = (authorId: string) => {
    return users.find((u) => u.id === authorId) || {
      name: "Bitlance Team",
      avatar: "https://i.pravatar.cc/150?u=admin",
    };
  };

  const getReadingTime = (article: any) => {
    if (article.reading_time) return article.reading_time;
    const text = article.content ? article.content.replace(/<[^>]+>/g, "") : "";
    const words = text.trim().split(/\s+/).length || 1;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const activeSelectionName = activeCategoryObj?.name 
    || activeTopicObj?.name 
    || activeFeaturedObj?.name 
    || "";

  const dynamicTitle = activeSelectionName
    ? `${activeSelectionName} Guides & Insights - BitLance`
    : "BitLance Blog - Vetted Remote Bitcoin Jobs & Freelance Marketplace";

  const dynamicDescription = activeSelectionName
    ? `Explore vetted articles, tutorials, and career insights about ${activeSelectionName} in the Bitcoin economy on BitLance.`
    : "Insights, engineering updates, and thoughtful guides from the team at BitLance.";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-brand-500 selection:text-white">
      <SEO
        title={dynamicTitle}
        description={dynamicDescription}
        orgSchema={true}
        breadcrumbs={activeSelectionName ? [{ name: "Blog", item: "/" }, { name: activeSelectionName, item: `/category/${finalCategorySlug || finalTopicSlug || finalFeaturedSlug}` }] : [{ name: "Blog", item: "/" }]}
        faqs={HOMEPAGE_FAQS}
        canonicalUrl="https://blog.bitlance.work/"
      />
      <Navigation />

      {/* Dynamic, CMS-Powered Secondary Sub-navigation Bar */}
      <div className="border-b border-gray-100 bg-white text-xs sm:text-sm py-2.5 sm:py-3 sticky top-16 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 w-full">
          <div className="flex items-center gap-5 sm:gap-8 text-gray-600 font-semibold shrink-0">
            {/* Categories Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "categories" ? null : "categories")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === "categories" ? null : "categories");
                  }
                }}
                className={`flex items-center gap-1.5 hover:text-gray-950 font-bold py-2.5 cursor-pointer text-sm transition-colors ${
                  finalCategorySlug ? "text-brand-600 font-black" : "text-gray-600"
                }`}
                aria-haspopup="true"
                aria-expanded={openDropdown === "categories"}
              >
                Categories
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === "categories" ? "rotate-180 text-brand-500" : ""}`} />
              </button>
              {openDropdown === "categories" && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in max-h-80 overflow-y-auto scrollbar-thin">
                  <button
                    onClick={() => {
                      navigate("/");
                      setOpenDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 hover:text-brand-600 font-extrabold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0" /> All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigate(`/category/${c.slug}`);
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2.5 hover:bg-brand-50/50 hover:text-brand-600 text-sm font-semibold cursor-pointer transition-colors ${
                        finalCategorySlug === c.slug ? "text-brand-600 bg-brand-50/30 font-bold" : "text-gray-700"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Topics Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "topics" ? null : "topics")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === "topics" ? null : "topics");
                  }
                }}
                className={`flex items-center gap-1.5 hover:text-gray-950 font-bold py-2.5 cursor-pointer text-sm transition-colors ${
                  finalTopicSlug ? "text-brand-600 font-black" : "text-gray-600"
                }`}
                aria-haspopup="true"
                aria-expanded={openDropdown === "topics"}
              >
                Topics
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === "topics" ? "rotate-180 text-brand-500" : ""}`} />
              </button>
              {openDropdown === "topics" && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in max-h-80 overflow-y-auto scrollbar-thin">
                  {topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        navigate(`/topic/${t.slug}`);
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2.5 hover:bg-brand-50/50 hover:text-brand-600 text-sm font-semibold cursor-pointer transition-colors ${
                        finalTopicSlug === t.slug ? "text-brand-600 bg-brand-50/30 font-bold" : "text-gray-700"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setOpenDropdown(openDropdown === "featured" ? null : "featured")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenDropdown(openDropdown === "featured" ? null : "featured");
                  }
                }}
                className={`flex items-center gap-1.5 hover:text-gray-950 font-bold py-2.5 cursor-pointer text-sm transition-colors ${
                  finalFeaturedSlug ? "text-brand-600 font-black" : "text-gray-600"
                }`}
                aria-haspopup="true"
                aria-expanded={openDropdown === "featured"}
              >
                Featured
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === "featured" ? "rotate-180 text-brand-500" : ""}`} />
              </button>
              {openDropdown === "featured" && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in max-h-80 overflow-y-auto scrollbar-thin">
                  {featuredCollections.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        navigate(`/featured/${f.slug}`);
                        setOpenDropdown(null);
                      }}
                      className={`block w-full text-left px-4 py-2.5 hover:bg-brand-50/50 hover:text-brand-600 text-sm font-semibold cursor-pointer transition-colors ${
                        finalFeaturedSlug === f.slug ? "text-brand-600 bg-brand-50/30 font-bold" : "text-gray-700"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block text-xs text-gray-500 font-medium text-right shrink-0">
            New to Bitcoin work?{" "}
            <a
              href="https://www.bitlance.work/findwork"
              className="text-brand-600 hover:text-brand-700 hover:underline font-bold"
            >
              Learn how to start freelancing
            </a>{" "}
            or{" "}
            <a
              href="https://www.bitlance.work/find-freelancers"
              className="text-brand-600 hover:text-brand-700 hover:underline font-bold"
            >
              hire freelancers
            </a>
            .
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

        {/* Main Title Banner matching Upwork Header Style */}
        <div className="max-w-3xl mb-8 sm:mb-12 text-left">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight mb-3 sm:mb-4 animate-fade-in">
            Bitlance Blog
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-500 leading-relaxed font-light">
            Read updates on Bitlance's products, borderless work initiatives,
            and Bitcoin partnerships to get insight into the world's
            decentralized work marketplace.
          </p>
        </div>

        {/* Dynamic Category Horizontal Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto gap-4 sm:gap-6 mb-12 pb-px scrollbar-none">
          {QUICK_FILTERS.map((filter) => {
            let isActive = false;
            if (filter.type === "all") {
              isActive = !finalCategorySlug && !finalTopicSlug && !finalFeaturedSlug;
            } else if (filter.type === "category") {
              isActive = finalCategorySlug === filter.slug;
            } else if (filter.type === "topic") {
              isActive = finalTopicSlug === filter.slug;
            } else if (filter.type === "featured") {
              isActive = finalFeaturedSlug === filter.slug;
            }

            const Icon = filter.icon;

            return (
              <button
                key={filter.id}
                onClick={() => {
                  if (filter.type === "all") {
                    navigate("/");
                  } else if (filter.type === "category") {
                    navigate(`/category/${filter.slug}`);
                  } else if (filter.type === "topic") {
                    navigate(`/topic/${filter.slug}`);
                  } else if (filter.type === "featured") {
                    navigate(`/featured/${filter.slug}`);
                  }
                }}
                className={`pb-4 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "border-brand-500 text-gray-950 font-black scale-102"
                    : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-brand-500" : "text-gray-400"}`} />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hero / Featured Article Layout */}
        {featured && (
          <div className="mb-20 lg:mb-28 group">
            <Link
              to={`/article/${featured.slug || featured.id}`}
              className="block"
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-in">
                  <div className="text-brand-600 text-xs font-bold uppercase tracking-wider mb-3">
                    {getCategoryName(featured.category_id)}
                  </div>
                  <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold text-gray-950 leading-tight mb-3 sm:mb-5 group-hover:text-brand-500 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-3 font-medium">
                    {featured.subtitle ||
                      featured.content
                        ?.replace(/<[^>]+>/g, "")
                        .substring(0, 180)}
                    ...
                  </p>
                  
                  {/* Premium Author / Reading Time Row */}
                  <div className="flex items-center gap-3">
                    <img
                      src={getAuthor(featured.author_id).avatar}
                      alt={getAuthor(featured.author_id).name}
                      className="w-10 h-10 rounded-full border border-gray-100 shadow-sm object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-950">
                        {getAuthor(featured.author_id).name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mt-0.5">
                        <span>
                          {new Date(
                            featured.published_at || featured.created_at,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{getReadingTime(featured)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 order-1 lg:order-2">
                  <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                    <img
                      src={
                        featured.featured_image ||
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
                      }
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Main 3-Column Articles Grid */}
        {displayedArticles.length > 0 && (
          <div className="mb-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {displayedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.slug || article.id}`}
                  className="group flex flex-col h-full bg-white border border-gray-100 rounded-[2rem] p-5 hover:shadow-lg hover:border-gray-200/60 hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  <div className="aspect-[16/10.5] rounded-[1.5rem] overflow-hidden bg-gray-50 mb-5 border border-gray-100 shadow-sm shrink-0">
                    <img
                      src={
                        article.featured_image ||
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
                      }
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="text-brand-600 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {getCategoryName(article.category_id)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 mb-2.5 leading-snug group-hover:text-brand-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2 flex-grow font-medium">
                    {article.subtitle ||
                      article.content
                        ?.replace(/<[^>]+>/g, "")
                        .substring(0, 120)}
                    ...
                  </p>
                  
                  {/* Card Author & Time Metadata */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
                    <img
                      src={getAuthor(article.author_id).avatar}
                      alt={getAuthor(article.author_id).name}
                      className="w-8 h-8 rounded-full border border-gray-100 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-950 truncate">
                        {getAuthor(article.author_id).name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 mt-0.5">
                        <span>
                          {new Date(
                            article.published_at || article.created_at,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{getReadingTime(article)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination block - matching Upwork layout directly */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-5 py-2 text-sm font-semibold rounded-full border border-gray-200 transition-colors ${
                    currentPage === 1
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100"
                      : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                >
                  Back
                </button>
                <div className="text-sm font-bold text-gray-700">
                  {currentPage} <span className="text-gray-300 mx-1">/</span>{" "}
                  {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors text-white ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-brand-500 hover:bg-brand-600 shadow-sm"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section Heading: Trending & Recommended Reading */}
        <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 mb-20 lg:mb-28">
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
              Trending & Recommended Reading
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Explore our most popular guides, community success stories, and deep tutorials from the CMS library.
            </p>
          </div>

          {/* Mini tabs inside section */}
          <div className="flex border-b border-gray-200/60 overflow-x-auto gap-8 mb-8 scrollbar-none">
            {[
              { id: "trending", label: "Trending Articles" },
              { id: "recommended", label: "Recommended Reading" }
            ].map((newsTab) => (
              <button
                key={newsTab.id}
                onClick={() => setActiveFeedTab(newsTab.id as "trending" | "recommended")}
                className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeFeedTab === newsTab.id
                    ? "border-brand-500 text-gray-950"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {newsTab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Article Card deck */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGridArticles.map((art) => (
              <Link
                key={art.id}
                to={`/article/${art.slug || art.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col h-full shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className="text-brand-600 text-[10px] font-black uppercase tracking-wider mb-2">
                  {getCategoryName(art.category_id)}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-3 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                  {art.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-6 font-medium">
                  {art.subtitle || art.content?.replace(/<[^>]+>/g, "").substring(0, 110) + "..."}
                </p>
                <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-gray-50">
                  <img
                    src={getAuthor(art.author_id).avatar}
                    alt={getAuthor(art.author_id).name}
                    className="w-7 h-7 rounded-full object-cover border border-gray-100"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-900 truncate">
                      {getAuthor(art.author_id).name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] font-semibold text-gray-400 mt-0.5">
                      <span>
                        {new Date(art.published_at || art.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span>•</span>
                      <span>{getReadingTime(art)}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all ml-auto shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>



        {/* High-Impact Value Proposition Section */}
        <section className="bg-gradient-to-br from-[#FFFBF7] to-white rounded-[2rem] border border-brand-100 p-6 sm:p-10 mb-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-100/25 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 tracking-wider uppercase mb-4 shadow-xs">
                <Zap className="w-3 h-3 text-brand-500 fill-brand-100 stroke-[2.5] animate-pulse" /> Vetted Remote Bitcoin Marketplace
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-gray-950 tracking-tight leading-[1.15] mb-3">
                Hire Vetted Talent or Find <br className="hidden sm:inline" />
                <span className="text-brand-600">Remote Bitcoin Jobs</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 max-w-lg">
                BitLance is the premier global platform matching top remote engineers, designers, and specialists with innovative employers. Projects are organized into milestone-based Lightning escrows—ensuring payment security for both sides with instant, direct payouts upon client approval.
              </p>
              
              {/* Dual Calls-To-Action (CTAs) */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://www.bitlance.work/find-freelancers" 
                  className="inline-flex items-center justify-center bg-gray-900 text-white font-bold px-6 py-3.5 sm:py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm text-sm group text-center cursor-pointer min-h-[44px]"
                >
                  Hire Bitcoin Talent
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="https://www.bitlance.work/findwork" 
                  className="inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3.5 sm:py-2.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-xs text-sm text-center cursor-pointer min-h-[44px]"
                >
                  Find Remote Work
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              {/* Trust badges and visually engaging panel */}
              <div className="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 border border-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 mb-0.5">Verified Proof-of-Work Vetting</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Every developer, designer, and writer undergoes strict skill and communication assessment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-50 border border-brand-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 mb-0.5">Direct Payouts via Lightning</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">No withdraw steps or delays. When the client approves the completed milestone, sats flow instantly to your preferred Lightning address.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-950 mb-0.5">Milestone Lightning Escrows</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">Secured per milestone. Freelancers keep 100% of their earnings with zero deductions while clients pay a flat 5% platform fee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section with Structured Schema Data */}
        <section className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 mb-20">
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Find answers to the most common questions about hiring vetted talent and freelancing on BitLance.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {HOMEPAGE_FAQS.map((faq, idx) => (
              <FaqAccordionItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
