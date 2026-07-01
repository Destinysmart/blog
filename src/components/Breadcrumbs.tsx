import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  items: { name: string; path: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="flex items-center gap-2 text-xs font-semibold text-gray-500 py-3 px-1 overflow-x-auto scrollbar-none"
    >
      <Link 
        to="/" 
        className="flex items-center gap-1.5 hover:text-brand-600 transition-colors shrink-0"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Bitlance</span>
      </Link>
      
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex items-center gap-2 shrink-0">
            <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" aria-hidden="true" />
            {isLast ? (
              <span className="text-gray-900 truncate max-w-[200px] sm:max-w-[300px]" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="hover:text-brand-600 transition-colors truncate max-w-[150px]"
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
