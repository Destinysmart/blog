import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  articleBody?: string;
  
  // Advanced SEO & Robots controls
  robotsMeta?: string;
  canonicalUrl?: string;
  
  // Customized Social Metadata
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  
  // Structured Schema data
  schemaData?: string; // Custom user-defined JSON-LD Schema
  faqs?: { question: string; answer: string }[]; // FAQ list to generate FAQPage Schema
  
  // New schemas for search & AI discovery
  breadcrumbs?: { name: string; item: string }[];
  orgSchema?: boolean;
  personSchema?: {
    name: string;
    description: string;
    jobTitle?: string;
    image?: string;
    sameAs?: string[];
    skills?: string[];
  };
  jobPostings?: {
    title: string;
    description: string;
    datePosted: string;
    validThrough: string;
    employmentType: string;
    hiringOrganizationName: string;
    jobLocationCity: string;
    baseSalary?: number;
  }[];
}

export function SEO({
  title = "BitLance Blog - Bitcoin Freelancing Blog",
  description = "Guides, tutorials, industry insights, freelancing tips, and Bitcoin career resources.",
  image = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
  url = "https://blog.bitlance.work",
  type = "website",
  publishedTime,
  modifiedTime,
  authorName = "BitLance Team",
  articleBody,
  
  robotsMeta = "index, follow",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = "summary_large_image",
  schemaData,
  faqs,
  
  breadcrumbs,
  orgSchema,
  personSchema,
  jobPostings
}: SEOProps) {
  
  const finalUrl = canonicalUrl || url;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalOgImage = ogImage || image;

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://blog.bitlance.work",
    "name": "BitLance",
    "description": "Guides, tutorials, industry insights, freelancing tips, and Bitcoin career resources.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://blog.bitlance.work/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchemaObj = orgSchema ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BitLance",
    "alternateName": "BitLance Remote Work",
    "url": "https://blog.bitlance.work",
    "logo": "https://blog.bitlance.work/logo.png",
    "description": "Vetted remote Bitcoin job marketplace and global micro-payroll platform. Secure freelancing via Lightning smart escrow.",
    "sameAs": [
      "https://x.com/bitlancework",
      "https://github.com/bitlance1",
      "https://t.me/+ITw8yz1xJIhjNWE0"
    ]
  } : null;

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": b.name,
      "item": b.item.startsWith("http") ? b.item : `https://blog.bitlance.work${b.item}`
    }))
  } : null;

  const personSchemaObj = personSchema ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personSchema.name,
    "description": personSchema.description,
    "jobTitle": personSchema.jobTitle || "Bitcoin Freelancer",
    "image": personSchema.image || "https://i.pravatar.cc/150?u=user_1",
    "sameAs": personSchema.sameAs || [],
    "knowsAbout": personSchema.skills || ["Bitcoin", "Lightning Network", "Remote Work", "Software Engineering"]
  } : null;

  const jobPostingSchemas = jobPostings && jobPostings.length > 0 ? jobPostings.map(jp => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": jp.title,
    "description": jp.description,
    "datePosted": jp.datePosted,
    "validThrough": jp.validThrough,
    "employmentType": jp.employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": jp.hiringOrganizationName,
      "sameAs": "https://bitlance.work"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": jp.jobLocationCity,
        "addressCountry": "Remote"
      }
    },
    ...(jp.baseSalary ? {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "value": jp.baseSalary,
          "unitText": "YEAR"
        }
      }
    } : {})
  })) : null;

  const articleSchema = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": finalUrl
    },
    "headline": title,
    "description": description,
    "image": [finalOgImage],
    "datePublished": publishedTime || new Date().toISOString(),
    "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": authorName,
      "url": `https://blog.bitlance.work/author/${authorName.replace(/\s+/g, '-').toLowerCase()}`
    }],
    "publisher": {
      "@type": "Organization",
      "name": "BitLance",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bitlance.work/logo.png"
      }
    },
    ...(articleBody ? { "articleBody": articleBody } : {})
  } : null;

  // Generate FAQ Schema if FAQs exist
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Safe parsing of custom Schema
  let customParsedSchema = null;
  if (schemaData) {
    try {
      customParsedSchema = JSON.parse(schemaData);
    } catch (e) {
      console.error("Failed to parse custom JSON-LD schema", e);
    }
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="icon" type="image/jpeg" href="/logo.png" />
      <link rel="shortcut icon" type="image/jpeg" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
      
      {/* Robots Indexing Controls */}
      <meta name="robots" content={robotsMeta} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={finalOgImage} />
      
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && authorName && (
        <meta property="article:author" content={authorName} />
      )}

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalOgTitle} />
      <meta property="twitter:description" content={finalOgDescription} />
      <meta property="twitter:image" content={finalOgImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>

      {organizationSchemaObj && (
        <script type="application/ld+json">
          {JSON.stringify(organizationSchemaObj)}
        </script>
      )}

      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {personSchemaObj && (
        <script type="application/ld+json">
          {JSON.stringify(personSchemaObj)}
        </script>
      )}

      {jobPostingSchemas && jobPostingSchemas.map((jps, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(jps)}
        </script>
      ))}
      
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}

      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {customParsedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(customParsedSchema)}
        </script>
      )}
    </Helmet>
  );
}
