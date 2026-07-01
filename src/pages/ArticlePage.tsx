import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  UserPlus,
  UserCheck,
  FileText,
  Users,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";

export function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [authorStats, setAuthorStats] = useState({
    totalArticles: 0,
    followerCount: 0,
  });
  const [readingProgress, setReadingProgress] = useState(0);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>(
    [],
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(console.error);

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!article) return;
    fetch("/api/articles?status=published")
      .then((r) => r.json())
      .then((data) => {
        const others = data.filter((a: any) => a.id !== article.id);
        const sorted = others.sort((a: any, b: any) => {
          if (a.category_id === article.category_id && b.category_id !== article.category_id) return -1;
          if (a.category_id !== article.category_id && b.category_id === article.category_id) return 1;
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
        });
        setRelatedArticles(sorted.slice(0, 3));
      })
      .catch(console.error);
  }, [article]);

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

  const getReadingTimeForArticle = (art: any) => {
    if (art.reading_time) return art.reading_time;
    const text = art.content ? art.content.replace(/<[^>]+>/g, "") : "";
    const words = text.trim().split(/\s+/).length || 1;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  useEffect(() => {
    fetch(`/api/articles/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        // Parse HTML to extract headers and add IDs
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, "text/html");
        const headers = doc.querySelectorAll("h2, h3");
        const extractedToc: { id: string; text: string; level: number }[] = [];

        headers.forEach((header, index) => {
          const id =
            header.id ||
            `heading-${index}-${(header.textContent || "").replace(/[^\w]+/g, "-").toLowerCase()}`;
          header.id = id;
          extractedToc.push({
            id,
            text: header.textContent || "",
            level: parseInt(header.tagName.substring(1), 10),
          });
        });

        setToc(extractedToc);
        setArticle({ ...data, content: doc.body.innerHTML });

        // Check if bookmarked
        fetch(`/api/bookmarks/check/${data.id}`, {
          headers: { "x-user-id": "user_1" },
        })
          .then((r) => r.json())
          .then((bRes) => setIsBookmarked(bRes.isBookmarked))
          .catch(console.error);

        // Fetch author
        if (data.author_id) {
          fetch(`/api/users`)
            .then((r) => r.json())
            .then((users) => {
              const foundUser = users.find((u: any) => u.id === data.author_id);
              setAuthor(foundUser);

              // Check follow status
              if (foundUser) {
                fetch(`/api/follows/check/${foundUser.id}`, {
                  headers: { "x-user-id": "user_1" },
                })
                  .then((r) => r.json())
                  .then((fRes) => setIsFollowing(fRes.isFollowed))
                  .catch(console.error);

                fetch(`/api/users/${foundUser.id}/stats`)
                  .then((r) => r.json())
                  .then((stats) => setAuthorStats(stats))
                  .catch(console.error);
              }
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [slug]);

  const toggleBookmark = async () => {
    if (!article) return;
    try {
      if (isBookmarked) {
        await fetch(`/api/bookmarks/${article.id}`, {
          method: "DELETE",
          headers: { "x-user-id": "user_1" },
        });
        setIsBookmarked(false);
      } else {
        await fetch(`/api/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user_1",
          },
          body: JSON.stringify({ article_id: article.id }),
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error("Failed to toggle bookmark", e);
    }
  };

  const toggleFollow = async () => {
    if (!author) return;
    try {
      if (isFollowing) {
        await fetch(`/api/follows/${author.id}`, {
          method: "DELETE",
          headers: { "x-user-id": "user_1" },
        });
        setIsFollowing(false);
        setAuthorStats((prev) => ({
          ...prev,
          followerCount: Math.max(0, prev.followerCount - 1),
        }));
      } else {
        await fetch(`/api/follows`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user_1",
          },
          body: JSON.stringify({ author_id: author.id }),
        });
        setIsFollowing(true);
        setAuthorStats((prev) => ({
          ...prev,
          followerCount: prev.followerCount + 1,
        }));
      }
    } catch (e) {
      console.error("Failed to toggle follow", e);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!article)
    return (
      <div className="min-h-screen pt-32 text-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <SEO
        type="article"
        title={article.seo_title || article.title || "BitLance Article"}
        description={article.meta_description || article.subtitle || article.content?.replace(/<[^>]+>/g, "").substring(0, 155) || "Read this article on BitLance."}
        image={article.og_image || article.featured_image}
        url={article.canonical_url || `https://blog.bitlance.work/article/${article.slug || article.id}`}
        publishedTime={article.published_at || article.created_at}
        modifiedTime={
          article.updated_at || article.published_at || article.created_at
        }
        authorName={author?.name || "Bitlance Team"}
        articleBody={article.content?.replace(/<[^>]+>/g, "")}
        robotsMeta={article.robots_meta || "index, follow"}
        canonicalUrl={article.canonical_url || `https://blog.bitlance.work/article/${article.slug || article.id}`}
        ogTitle={article.og_title}
        ogDescription={article.og_description}
        ogImage={article.og_image}
        twitterCard={article.twitter_card || "summary_large_image"}
        schemaData={article.schema_data}
        faqs={article.faqs}
        breadcrumbs={[
          { name: "Blog", item: "/" },
          { name: getCategoryName(article.category_id), item: `/?category=${article.category_id}` },
          { name: article.title, item: `/article/${article.slug || article.id}` }
        ]}
      />
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-brand-500 z-[60] transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />
      <Navigation />

      <article className="pt-8 pb-32 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { name: "Blog", path: "/" },
              { name: getCategoryName(article.category_id), path: `/?category=${article.category_id}` },
              { name: article.title, path: `/article/${article.slug || article.id}` }
            ]}
          />
        </div>

        {/* Header */}
        <header className="mb-12 max-w-3xl mx-auto text-center">
          <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-4">
            <img
              src={author?.avatar || "https://i.pravatar.cc/150?u=admin"}
              alt={author?.name || "Author"}
              className="w-12 h-12 rounded-full border border-gray-200"
            />
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">
                {author?.name || "Bitlance Team"}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
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
                <span>{article.reading_time || "5 min read"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden bg-gray-100 mb-16 shadow-sm border border-gray-100">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
          {/* Left Sidebar (Desktop) - TOC & Socials */}
          <div className="hidden lg:flex flex-col gap-12 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pb-8 shrink-0 w-64 pr-4">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-gray-900 tracking-widest uppercase mb-4">
                  Table of Contents
                </h3>
                <nav className="flex flex-col gap-3">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(item.id)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`text-sm text-gray-500 hover:text-brand-600 transition-colors line-clamp-2 ${item.level === 3 ? "ml-4" : "font-medium"}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Social Sharing */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 tracking-widest uppercase mb-4">
                Share
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const url = `https://bitlance.com/article/${article.slug || article.id}`;
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`,
                      "_blank",
                    );
                  }}
                  title="Share on X (Twitter)"
                  className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const url = `https://bitlance.com/article/${article.slug || article.id}`;
                    const text = encodeURIComponent(article.title + " " + url);
                    // attempt to use nostr intent or open a web client, snort is popular
                    window.open(
                      `https://snort.social/share?text=${text}`,
                      "_blank",
                    );
                  }}
                  title="Share on Nostr"
                  className="p-2.5 text-gray-400 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-full transition-colors border border-transparent hover:border-[#9146FF]/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M16.5 2h-9A4.5 4.5 0 003 6.5v11A4.5 4.5 0 007.5 22h9a4.5 4.5 0 004.5-4.5v-11A4.5 4.5 0 0016.5 2zm2.5 15.5a2.5 2.5 0 01-2.5 2.5h-9a2.5 2.5 0 01-2.5-2.5v-11A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v11zM11.5 6a1 1 0 00-1 1v10a1 1 0 002 0V7a1 1 0 00-1-1zm3-1a1 1 0 100 2 1 1 0 000-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const url = `https://bitlance.com/article/${article.slug || article.id}`;
                    navigator.clipboard.writeText(url);
                    triggerToast("Link copied to clipboard!");
                  }}
                  title="Copy Link"
                  className="p-2.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-full transition-colors border border-transparent hover:border-brand-100"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button
                  onClick={toggleBookmark}
                  title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                  className={`p-2.5 rounded-full transition-colors border border-transparent 
                    ${isBookmarked ? "text-brand-600 bg-brand-50 border-brand-100 hover:bg-brand-100" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-200"}`}
                >
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl mx-auto w-full">
            <div
              className="prose prose-lg prose-brand max-w-none text-gray-700 leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* FAQ Accordion Section */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-16 border-t border-gray-100 pt-12 animate-fade-in">
                <h3 className="heading-display text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-brand-500 font-extrabold font-mono text-xl">?</span> Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {article.faqs.map((faq: any, idx: number) => (
                    <div key={idx} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80 hover:border-brand-100 hover:bg-white transition-all duration-200 shadow-sm">
                      <h4 className="text-base font-bold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action Card */}
            <div className="mt-16 border border-brand-100 bg-brand-50/40 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-fade-in">
              <div className="max-w-md text-left">
                <h4 className="text-xl font-extrabold text-gray-950 tracking-tight mb-2">
                  Ready to build in the Bitcoin economy?
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  Connect with vetted freelancers or find top-tier, borderless Bitcoin-native jobs on Bitlance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <a
                  href="https://www.bitlance.work/find-freelancers"
                  className="flex-1 text-center bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-6 py-3.5 sm:py-3 rounded-2xl transition-colors shadow-sm whitespace-nowrap cursor-pointer min-h-[44px]"
                >
                  Find Talent
                </a>
                <a
                  href="https://www.bitlance.work/findwork"
                  className="flex-1 text-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm px-6 py-3.5 sm:py-3 rounded-2xl transition-colors shadow-sm whitespace-nowrap cursor-pointer min-h-[44px]"
                >
                  Find Work
                </a>
              </div>
            </div>

            {/* Author Bio Footer */}
            <div className="mt-16 bg-[#FFFBF7] rounded-3xl p-8 sm:p-10 border border-brand-100 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start group transition-all hover:shadow-md">
              <img
                src={author?.avatar || "https://i.pravatar.cc/150?u=admin"}
                alt={author?.name || "Author"}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-white shadow-sm shrink-0 object-cover"
              />
              <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h3 className="heading-display text-2xl font-bold text-gray-900 mb-2">
                  {author?.name || "Bitlance Team"}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-sm font-semibold text-gray-500 mb-3 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm inline-flex">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-500" />{" "}
                    {authorStats.totalArticles} Articles
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-500" />{" "}
                    {authorStats.followerCount} Followers
                  </span>
                </div>
                <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                  The Bitlance editorial team. We publish guides, industry
                  insights, and remote work strategies to help freelancers build
                  successful borderless careers.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-brand-600 bg-brand-50 border border-brand-100 transition-colors shadow-sm hover:bg-brand-100"
                  >
                    View Profile
                  </a>
                  <button
                    onClick={toggleFollow}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold border transition-colors shadow-sm
                    ${
                      isFollowing
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-brand-500 border-transparent text-white hover:bg-brand-600"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Follow
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-100">
            <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight mb-8">
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/article/${rel.slug || rel.id}`}
                  className="group flex flex-col h-full bg-white border border-gray-100 rounded-[2rem] p-5 hover:shadow-lg hover:border-gray-200/60 hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  <div className="aspect-[16/10.5] rounded-[1.5rem] overflow-hidden bg-gray-50 mb-4 border border-gray-100 shadow-sm shrink-0">
                    <img
                      src={
                        rel.featured_image ||
                        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
                      }
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-brand-600 text-[11px] font-bold uppercase tracking-wider mb-2">
                    {getCategoryName(rel.category_id)}
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-gray-950 mb-2 leading-snug group-hover:text-brand-500 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow font-medium">
                    {rel.subtitle || rel.content?.replace(/<[^>]+>/g, "").substring(0, 100)}...
                  </p>
                  
                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50 mt-auto">
                    <img
                      src={getAuthor(rel.author_id).avatar}
                      alt={getAuthor(rel.author_id).name}
                      className="w-7 h-7 rounded-full border border-gray-100 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-950 truncate">
                        {getAuthor(rel.author_id).name}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-gray-400 mt-0.5">
                        <span>
                          {new Date(
                            rel.published_at || rel.created_at,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{getReadingTimeForArticle(rel)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Social Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex items-center justify-around z-50">
          <button
            onClick={() => {
              const url = `https://bitlance.com/article/${article.slug || article.id}`;
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`,
                "_blank",
              );
            }}
            title="Share on X (Twitter)"
            className="p-2 text-gray-400 hover:text-gray-900"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
          <button
            onClick={() => {
              const url = `https://bitlance.com/article/${article.slug || article.id}`;
              const text = encodeURIComponent(article.title + " " + url);
              window.open(`https://snort.social/share?text=${text}`, "_blank");
            }}
            title="Share on Nostr"
            className="p-2 text-gray-400 hover:text-[#9146FF]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
              aria-hidden="true"
            >
              <path d="M16.5 2h-9A4.5 4.5 0 003 6.5v11A4.5 4.5 0 007.5 22h9a4.5 4.5 0 004.5-4.5v-11A4.5 4.5 0 0016.5 2zm2.5 15.5a2.5 2.5 0 01-2.5 2.5h-9a2.5 2.5 0 01-2.5-2.5v-11A2.5 2.5 0 017.5 4h9A2.5 2.5 0 0119 6.5v11zM11.5 6a1 1 0 00-1 1v10a1 1 0 002 0V7a1 1 0 00-1-1zm3-1a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
          </button>
          <button
            onClick={() => {
              const url = `https://bitlance.com/article/${article.slug || article.id}`;
              navigator.clipboard.writeText(url);
              triggerToast("Link copied to clipboard!");
            }}
            title="Copy Link"
            className="p-2 text-gray-400 hover:text-brand-500"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={toggleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            className={`p-2 ${isBookmarked ? "text-brand-600" : "text-gray-400 hover:text-gray-900"}`}
          >
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </article>

      <Footer />

      {/* Modern float Toast */}
      {showToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-gray-950 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-2.5 animate-scale-up select-none">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
