import { useState, useEffect } from "react";
import { Folder, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function Categories() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="heading-display text-2xl font-bold text-gray-900">Browse by Category</h2>
          <a href="#" className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            View all categories &rarr;
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            return (
              <motion.div
                key={category.id || index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to="#" 
                  className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 hover:border-brand-400 hover:shadow-sm transition-all text-center h-full"
                >
                  <div className="mb-3 text-gray-400 group-hover:text-brand-500 transition-colors">
                    <Folder className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
