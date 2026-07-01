import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function Latest() {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/articles?status=published").then(r => r.json()),
      fetch("/api/categories").then(r => r.json())
    ])
    .then(([arts, cats]) => {
      setArticles(arts);
      setCategories(cats);
    })
    .catch(console.error);
  }, []);

  if (articles.length === 0) return null;

  const groupedArticles = categories.map(cat => ({
    section: cat.name,
    articles: articles.filter(a => a.category_id === cat.id)
  })).filter(g => g.articles.length > 0);

  const uncategorized = articles.filter(a => !a.category_id);
  if (uncategorized.length > 0) {
    groupedArticles.push({
      section: "Latest Articles",
      articles: uncategorized
    });
  }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {groupedArticles.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-20 last:mb-0">
            <div className="border-b-[3px] border-gray-900 mb-8 flex">
              <span className="bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest py-2 px-4 shadow-sm">
                {group.section}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {group.articles.map((article: any, i: number) => (
                <motion.div 
                  key={article.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/article/${article.slug || article.id}`} className="group flex flex-col hover:opacity-90 transition-opacity">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-4 border border-gray-200">
                      <img 
                        src={article.featured_image || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"} 
                        alt={article.title} 
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    
                    <h3 className="heading-display text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-auto">
                      <span className="text-gray-900">Bitlance Team</span>
                      <span className="mx-1.5 text-gray-300">•</span>
                      <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
