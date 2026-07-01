import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function Featured() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/articles?status=published").then(r => r.json()),
      fetch("/api/categories").then(r => r.json())
    ])
    .then(([arts, cats]) => {
      // Sort to get newest first (already sort of latest by ID but let's assume they are ordered)
      const sorted = arts.sort((a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      setArticles(sorted.slice(0, 4));
      setCategories(cats);
    })
    .catch(console.error);
  }, []);

  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1);

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Latest";
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px]">
        {/* Magazine-style Mosaic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-white">
          
          {/* Main Huge Article (Left) */}
          {mainArticle && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group relative lg:col-span-8 aspect-[4/3] lg:aspect-[16/10] overflow-hidden block"
            >
              <Link to={`/article/${mainArticle.slug || mainArticle.id}`} className="absolute inset-0 z-10" />
              <img 
                src={mainArticle.featured_image || "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop"} 
                alt={mainArticle.title} 
                className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 lg:p-12">
                <span className="inline-block bg-brand-500 text-white text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 mb-4 shadow-sm relative z-20">
                  {getCategoryName(mainArticle.category_id)}
                </span>
                <h2 className="heading-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4 group-hover:text-brand-300 transition-colors max-w-3xl relative z-20 pointer-events-none">
                  {mainArticle.title}
                </h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 relative z-20 pointer-events-none">
                  <span className="text-white">Bitlance Team</span>
                  <span>-</span>
                  <span>{new Date(mainArticle.published_at || mainArticle.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stacked Side Articles (Right) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
            {sideArticles.map((article, index) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className={`group relative aspect-[16/10] md:aspect-auto sm:col-span-1 border border-gray-100 lg:col-span-1 overflow-hidden block h-full min-h-[240px] ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <Link to={`/article/${article.slug || article.id}`} className="absolute inset-0 z-10" />
                <img 
                  src={article.featured_image || "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2574&auto=format&fit=crop"} 
                  alt={article.title} 
                  className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <span className="inline-block bg-brand-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mb-3 relative z-20">
                    {getCategoryName(article.category_id)}
                  </span>
                  <h3 className="heading-display text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-brand-300 transition-colors relative z-20 pointer-events-none">
                    {article.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
