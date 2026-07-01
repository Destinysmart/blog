import { Coins, Zap, Globe, Target, Briefcase } from "lucide-react";
import { motion } from "motion/react";

const paths = [
  {
    title: "Bitcoin Freelancing",
    description: "Start your journey. Learn to quote in sats, hold your own keys, and bypass fiat rails.",
    icon: Coins,
    articlesCount: 15,
  },
  {
    title: "Lightning Network",
    description: "Accept instant, borderless, low-fee payments over the Lightning Network.",
    icon: Zap,
    articlesCount: 8,
  },
  {
    title: "Remote Work",
    description: "Optimize your async setup and thrive as a global talent independent of geography.",
    icon: Globe,
    articlesCount: 12,
  },
  {
    title: "Client Acquisition",
    description: "Find Bitcoin-native companies, craft winning proposals, and build your reputation.",
    icon: Target,
    articlesCount: 22,
  },
  {
    title: "Bitcoin Careers",
    description: "Transition from freelancing to full-time roles at top-tier Bitcoin infrastructure firms.",
    icon: Briefcase,
    articlesCount: 10,
  },
];

export function LearningPaths() {
  return (
    <section className="py-20 bg-gray-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="heading-display text-2xl font-bold text-gray-900 tracking-tight">Learning Paths</h2>
          <p className="text-gray-500 mt-2 max-w-2xl">Structured content hubs to help you master specific skills in the Bitcoin economy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col rounded-2xl bg-white p-6 border border-gray-200 hover:border-brand-500/50 hover:shadow-sm transition-all"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 border border-gray-100 text-gray-900 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:border-brand-200 transition-colors">
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                  {path.description}
                </p>
                <div className="flex items-center text-xs font-semibold text-gray-400 group-hover:text-brand-600 transition-colors">
                  <span>{path.articlesCount} Articles</span>
                  <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    &rarr;
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
