import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Ensure db.json exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      articles: [],
      media: [],
      categories: [
        { id: "c1", name: "Bitcoin", slug: "bitcoin" },
        { id: "c2", name: "Lightning Network", slug: "lightning-network" },
        { id: "c3", name: "Freelancing", slug: "freelancing" },
      ],
      tags: [],
      users: [
        {
          id: "admin-1",
          role: "admin",
          name: "Admin",
          avatar: "https://i.pravatar.cc/150?u=admin",
        },
        {
          id: "pub-1",
          role: "publisher",
          name: "Publisher",
          avatar: "https://i.pravatar.cc/150?u=pub",
        },
      ],
    }),
  );
}

function getDb() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  const parsed = JSON.parse(data);
  if (!parsed.media) {
    parsed.media = [];
  }
  return parsed;
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn("Failed to write to db.json (expected on read-only serverless environments like Vercel):", err);
  }
}

// Seed articles if empty
const dbData = getDb();
if (dbData.articles.length === 0) {
  dbData.articles = [
    {
      id: "a_1",
      slug: "10-best-niches-for-bitcoin-freelancers-in-2026",
      title: "10 Best Niches for Bitcoin Freelancers in 2026",
      featured_image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c3",
      status: "published",
      content:
        "<p>The global demand for specialized talent in the Bitcoin economy is at an all-time high. Unlike general freelancing platforms, BitLance focuses exclusively on Bitcoin-native roles. By working here, freelancers receive their full agreed-upon contract amount directly into their private wallets, with no platform-side earnings deductions, because clients pay the flat 5% platform fee.</p><h2>1. Lightning Network Integration (LND, CLN, LDK)</h2><p>Companies are looking for developers who can integrate Layer-2 solutions into their existing checkouts. Expertise in LND, Core Lightning (CLN), and LDK is highly prized.</p><h2>2. Non-Custodial Wallet Design</h2><p>Creating intuitive, secure UI/UX for self-custodial Bitcoin applications requires specific design skills. Seamlessly guiding users through seed phrase backups and channel management is a critical niche.</p><h2>3. Nostr and Fedimint App Development</h2><p>With decentralized social protocols like Nostr and community mints like Fedimint growing rapidly, engineers who understand decentralized relays and chaumian e-cash are in huge demand.</p><h2>4. Cryptographic Smart Escrow Integration</h2><p>Securing contracts with smart escrow systems is a core requirement of modern peer-to-peer commerce. BitLance uses these principles natively to lock funds securely before milestones begin.</p><h2>5. Technical Content & Educational Writing</h2><p>Explaining complex technical protocols clearly is a premium skill. Companies need writers to draft documentation, tutorials, and support guides that build trust and drive user adoption.</p><p>Getting started on BitLance is simple: no invasive KYC forms are required—only your name and email address are needed to build a profile and start bidding on jobs today.</p>",
      published_at: new Date(Date.now() - 100000000).toISOString(),
      updated_at: new Date(Date.now() - 100000000).toISOString(),
    },
    {
      id: "a_2",
      slug: "how-to-calculate-your-hourly-rate-in-sats",
      title: "How to Calculate Your Hourly Rate in Sats",
      featured_image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2672&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c3",
      status: "published",
      content:
        "<p>Pricing your services in Satoshis (sats), the smallest unit of Bitcoin, is highly rewarding but requires a solid strategic approach. Denominating contract rates in sats ensures that you receive borderless, hard currency directly on-chain or over the Lightning Network.</p><h2>1. Establishing Your Base Rate</h2><p>Begin by defining your target hourly rate in fiat, then convert that into sats using dynamic conversion tools. It is recommended to include a tiny volatility buffer when pitching on longer contracts.</p><h2>2. Milestone-Based Escrows Protect Your Rate</h2><p>On BitLance, clients fund contracts per milestone using Lightning invoices in their Messages section. This locks the negotiated budget in escrow before you write a single line of code, protecting your time from payment defaults.</p><h2>3. Direct Lightning Payouts</h2><p>The moment a client clicks 'Approve and Pay' on your milestone, the escrow is automatically released. The sats flow directly to the Lightning payout address configured in your Settings—bypassing any intermediate holding accounts or withdraw fees.</p>",
      published_at: new Date(Date.now() - 150000000).toISOString(),
      updated_at: new Date(Date.now() - 150000000).toISOString(),
    },
    {
      id: "a_3",
      slug: "understanding-lightning-invoices-vs-on-chain-transactions",
      title: "Understanding Lightning Invoices vs On-chain Transactions",
      featured_image:
        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2669&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c2",
      status: "published",
      content:
        "<p>Understanding the difference between Bitcoin's base layer and Layer-2 Lightning Network is crucial for modern remote workers. BitLance leverages the Lightning Network for all platform transactions to enable micro-payroll and friction-free payouts.</p><h2>1. Base Layer On-Chain Transactions</h2><p>On-chain transactions are written permanently to the Bitcoin blockchain. They are ideal for storing large sums of wealth but are accompanied by longer block verification times and higher miner fees.</p><h2>2. Lightning Network (Layer-2) Invoices</h2><p>The Lightning Network operates as a second layer, allowing users to send near-instant transactions with fees of just a few sats. It is perfect for micro-payroll. On BitLance, when a client accepts a proposal, they fund the contract's escrow by generating and paying a Lightning invoice right inside the chat.</p><h2>3. Direct Non-Custodial Release</h2><p>When the client is satisfied with the work, clicking 'Approve and Pay' triggers an automated protocol release. The sats land directly in your preferred self-custodial Lightning address, ensuring you maintain 100% control of your hard-earned funds.</p>",
      published_at: new Date(Date.now() - 200000000).toISOString(),
      updated_at: new Date(Date.now() - 200000000).toISOString(),
    },
    {
      id: "a_4",
      slug: "building-a-portfolio-that-bitcoin-companies-love",
      title: "Building a Portfolio That Bitcoin Companies Love",
      featured_image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c3",
      status: "published",
      content:
        "<p>In a borderless digital world, traditional resumes and certificates are rapidly losing relevance. What Bitcoin-native companies care about is 'Proof of Work'—a verifiable track record of completed projects and real technical contributions.</p><h2>1. Demonstrate Real Contributions</h2><p>Contribute to open-source protocols like LND, Core Lightning, or Nostr clients. Documenting your contributions shows companies that you understand decentralized technologies and can work with self-directed focus.</p><h2>2. Leverage BitLance's Reputation Engine</h2><p>BitLance features a dual-review system. After completing each contract, both the freelancer and the client review each other. Build your ranking by delivering high-quality work, securing high ratings, and expanding your professional profile.</p><h2>3. Deliver Milestones Progressively</h2><p>When working on BitLance, structure your contracts with clear, logical milestones. Under the Contracts page, submit completed milestones with clear explanations, code repositories, or design Figma links. Transparent communication leads to positive feedback and repeated client business.</p>",
      published_at: new Date(Date.now() - 250000000).toISOString(),
      updated_at: new Date(Date.now() - 250000000).toISOString(),
    },
    {
      id: "a_5",
      slug: "tax-compliance-and-best-practices-for-bitcoin-freelancers",
      title: "Tax Compliance and Best Practices for Bitcoin Freelancers",
      featured_image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c1",
      status: "published",
      content:
        "<p>Earning in Bitcoin is liberating, but staying compliant with local tax regulations is vital for long-term professional success. Keeping thorough records of your borderless income ensures peace of mind as a digital nomad.</p><h2>1. Document Your Earnings Chronologically</h2><p>You must record the fair market value in your local currency at the precise time of receipt. BitLance simplifies this: the Earnings page provides a complete history of total payouts, funds in escrow, and transaction ledgers to easily export your data.</p><h2>2. Set Aside Funds for Local Taxes</h2><p>Since BitLance operates on a flat client-pays-the-fee model (clients pay 5% and freelancers keep 100% of their earnings), you do not need to worry about hidden deductions. However, you should proactively set aside a portion of your incoming sats in a separate cold storage setup dedicated to tax obligations.</p><h2>3. Understand Self-Custodial Responsibility</h2><p>Remember, BitLance is KYC-free during early onboarding and completely non-custodial—your payouts go straight to your destination Lightning address immediately. This means managing your personal tax logs and backup seed phrases is entirely your own responsibility.</p>",
      published_at: new Date(Date.now() - 300000000).toISOString(),
      updated_at: new Date(Date.now() - 300000000).toISOString(),
    },
    {
      id: "a_6",
      slug: "cold-email-templates-for-bitcoin-clients",
      title: "Cold Email Templates for Bitcoin Clients",
      featured_image:
        "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=2574&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c3",
      status: "published",
      content:
        "<p>Pitching startup founders in the Bitcoin ecosystem requires brevity, clarity, and demonstrating direct value. Traditional generic pitches fail because they sound like AI-generated templates. Below is a professional template designed to get replies.</p><h2>1. Focus on Direct Problem-Solving</h2><p>Founders are incredibly busy. Keep your cold emails under three concise paragraphs and focus on a specific problem you can solve—such as adding Lightning support or improving wallet UI performance.</p><h2>2. Propose BitLance for Escrow Safety</h2><p>When pitching clients off-platform, offer to finalize the contract via BitLance. Explain to the client that BitLance keeps their transaction safe with secure escrow holding. Mention that BitLance charging a flat 5% platform fee to employers, while keeping freelancer payout 100% fee-free, is a win-win for both sides.</p><h2>3. No-KYC Onboarding Makes It Instant</h2><p>Reassure the client that setting up an account is frictionless. They can sign up instantly with just a name and email, post their budget in sats, fund the escrow via a Lightning invoice, and get the project moving in minutes.</p>",
      published_at: new Date(Date.now() - 350000000).toISOString(),
      updated_at: new Date(Date.now() - 350000000).toISOString(),
    },
    {
      id: "a_7",
      slug: "self-custody-basics-for-digital-nomads-and-freelancers",
      title: "Self-Custody Basics for Digital Nomads and Freelancers",
      featured_image:
        "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c1",
      status: "published",
      content:
        "<p>As a global freelancer earning Bitcoin, taking full ownership of your money is the ultimate goal. True financial freedom is achieved only by practicing secure, self-custodial principles.</p><h2>1. Choose a Reputable Non-Custodial Wallet</h2><p>Avoid leaving significant balances on custodial systems or centralized exchanges. Select reputable non-custodial Lightning and on-chain wallets (like Phoenix, Muun, or Coldcard) that give you exclusive control over your private keys.</p><h2>2. Keep Your Private Keys Offline</h2><p>Never share your seed phrase, private keys, or wallet password with anyone. BitLance will never ask for them under any circumstance. Your public Lightning address is safe to provide in Settings for receiving payouts, but your keys must remain offline.</p><h2>3. BitLance's Non-Custodial Payout Promise</h2><p>BitLance is committed to decentralized commerce. We do not hold your funds on the platform. The moment a client approves a milestone, the sats release from escrow and are paid directly to your Settings-defined Lightning address, eliminating any withdraw requests.</p>",
      published_at: new Date(Date.now() - 400000000).toISOString(),
      updated_at: new Date(Date.now() - 400000000).toISOString(),
    },
    {
      id: "a_8",
      slug: "how-bitlance-natively-secures-freelancing-with-lightning-escrows",
      title: "How BitLance Natively Secures Freelancing with Lightning Escrows",
      featured_image:
        "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c2",
      status: "published",
      content:
        "<p>Trust is the most challenging element of remote freelancing. Freelancers fear delivering work and getting ghosted; clients fear paying upfront and receiving sub-par results. BitLance solves this elegantly with its built-in Lightning Escrow system.</p><h2>1. Milestone-Based Funding</h2><p>Before work begins, the client generates a Lightning escrow invoice inside the Messages chat. They pay the invoice, locking the funds in escrow. This tells the freelancer that the budget is secure, and they can confidently begin development.</p><h2>2. Instant Automatic Payout on Approval</h2><p>Once milestones are verified, the client clicks 'Approve and Pay'. This triggers an automatic payout from the escrow directly to the freelancer's wallet. There is no waiting time, no manual withdraw buttons, and no platform-side earnings deductions for the freelancer.</p><h2>3. Neutral Admin Dispute Mediation</h2><p>In rare cases where an agreement cannot be reached, either party can click 'Raise Dispute' from the chat's three-dot menu. A neutral BitLance administrator will contact both the client and the freelancer, examine the submitted deliverables, and execute a fair resolution.</p>",
      published_at: new Date(Date.now() - 450000000).toISOString(),
      updated_at: new Date(Date.now() - 450000000).toISOString(),
    },
  ];
  saveDb(dbData);
}

// Ensure all articles have a slug, and sanitize existing ones
let dbMigrated = false;
dbData.articles.forEach((art: any) => {
  if (!art.slug) {
    art.slug = art.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    dbMigrated = true;
  }
});
if (dbMigrated) {
  saveDb(dbData);
}

const app = express();

// Increase payload limit for base64 image uploads in tiptap
app.use(express.json({ limit: "50mb" }));

  // XML Sitemap Integration supporting both main and blog domains
  app.get("/sitemap.xml", (req, res) => {
    const host = (req.headers.host || "").toLowerCase();
    const siteQuery = req.query.site as string;
    
    // Determine whether this request is for the blog or the main website
    const isBlog = host.includes("blog.") || siteQuery === "blog";
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    if (isBlog) {
      const db = getDb();
      const publishedArticles = (db.articles || []).filter((a: any) => a.status === "published");
      
      // Blog Base
      xml += `  <url>\n`;
      xml += `    <loc>https://blog.bitlance.work/</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;
      xml += `  </url>\n`;
      
      // Blog Articles
      publishedArticles.forEach((art: any) => {
        const slug = art.slug || art.id;
        const lastMod = art.updated_at || art.published_at || new Date().toISOString();
        xml += `  <url>\n`;
        xml += `    <loc>https://blog.bitlance.work/article/${slug}</loc>\n`;
        xml += `    <lastmod>${lastMod.substring(0, 10)}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      });
    } else {
      // Main Website pages
      const mainPages = [
        { path: "", changefreq: "daily", priority: "1.0" },
        { path: "find-work", changefreq: "daily", priority: "0.9" },
        { path: "find-freelancers", changefreq: "daily", priority: "0.9" },
        { path: "post-a-job", changefreq: "weekly", priority: "0.9" },
        { path: "signup", changefreq: "weekly", priority: "0.8" },
        { path: "signup?type=hire", changefreq: "weekly", priority: "0.8" },
        { path: "signup?type=work", changefreq: "weekly", priority: "0.8" }
      ];
      
      mainPages.forEach((page) => {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.bitlance.work/${page.path}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      });
    }
    
    xml += `</urlset>`;
    
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // Robots.txt Route
  app.get("/robots.txt", (req, res) => {
    const host = (req.headers.host || "").toLowerCase();
    const siteQuery = req.query.site as string;
    const isBlog = host.includes("blog.") || siteQuery === "blog";
    
    let robotsText = "User-agent: *\n";
    robotsText += "Allow: /\n";
    if (isBlog) {
      robotsText += "Sitemap: https://blog.bitlance.work/sitemap.xml\n";
    } else {
      robotsText += "Sitemap: https://www.bitlance.work/sitemap.xml\n";
    }
    res.header("Content-Type", "text/plain");
    res.send(robotsText);
  });

  // Helper to sanitize slug
  function sanitizeSlug(title: string, customSlug?: string): string {
    const base = (customSlug || title || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    return base || "untitled";
  }
  
  // Helper to prevent duplicate slugs
  function uniqueSlug(db: any, baseSlug: string, excludeId?: string): string {
    let slug = baseSlug;
    let counter = 1;
    while (
      db.articles.some(
        (a: any) => a.slug === slug && a.id !== excludeId
      )
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  // API Routes

  // 1. Articles
  app.get("/api/articles", (req, res) => {
    const db = getDb();
    let articles = db.articles;
    // Filtering (Admin sees all, readers see published)
    if (req.query.status) {
      articles = articles.filter((a: any) => a.status === req.query.status);
    }
    res.json(articles);
  });

  app.get("/api/articles/:slug", (req, res) => {
    const db = getDb();
    const article = db.articles.find(
      (a: any) => a.slug === req.params.slug || a.id === req.params.slug,
    );
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  });

  app.post("/api/articles", (req, res) => {
    const db = getDb();
    const baseSlug = sanitizeSlug(req.body.title, req.body.slug);
    const slug = uniqueSlug(db, baseSlug);
    const article = {
      ...req.body,
      slug,
      id: "a_" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
    };
    db.articles.push(article);
    saveDb(db);
    res.json(article);
  });

  app.put("/api/articles/:id", (req, res) => {
    const db = getDb();
    let articleIndex = db.articles.findIndex(
      (a: any) => a.id === req.params.id,
    );
    if (articleIndex === -1)
      return res.status(404).json({ error: "Not found" });

    const baseSlug = sanitizeSlug(req.body.title, req.body.slug);
    const slug = uniqueSlug(db, baseSlug, req.params.id);

    db.articles[articleIndex] = {
      ...db.articles[articleIndex],
      ...req.body,
      slug,
      updated_at: new Date().toISOString(),
    };
    saveDb(db);
    res.json(db.articles[articleIndex]);
  });

  app.delete("/api/articles/:id", (req, res) => {
    const db = getDb();
    db.articles = db.articles.filter((a: any) => a.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 2. Categories
  app.get("/api/categories", (req, res) => {
    res.json(getDb().categories || []);
  });

  app.get("/api/topics", (req, res) => {
    res.json(getDb().topics || []);
  });

  app.get("/api/featured-collections", (req, res) => {
    res.json(getDb().featured_collections || []);
  });

  app.post("/api/categories", (req, res) => {
    const db = getDb();
    const newCategory = {
      ...req.body,
      id: "c_" + Date.now(),
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    db.categories.push(newCategory);
    saveDb(db);
    res.json(newCategory);
  });

  app.delete("/api/categories/:id", (req, res) => {
    const db = getDb();
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 3. Users
  app.get("/api/users", (req, res) => {
    res.json(getDb().users);
  });

  app.post("/api/users", (req, res) => {
    const db = getDb();
    const newUser = {
      ...req.body,
      id: "u_" + Date.now(),
      avatar: req.body.avatar || "https://i.pravatar.cc/150?u=" + Date.now(),
    };
    db.users.push(newUser);
    saveDb(db);
    res.json(newUser);
  });

  app.delete("/api/users/:id", (req, res) => {
    const db = getDb();
    db.users = db.users.filter((u: any) => u.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  app.put("/api/users/:id", (req, res) => {
    const db = getDb();
    const userIndex = db.users.findIndex((u: any) => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    db.users[userIndex] = {
      ...db.users[userIndex],
      ...req.body
    };
    saveDb(db);
    res.json(db.users[userIndex]);
  });

  // 4. Bookmarks
  app.get("/api/bookmarks", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const bookmarks = db.bookmarks || [];
    const userBookmarks = bookmarks.filter((b: any) => b.user_id === userId);

    // Join with articles and sort by newest bookmark first (mocking this by reversing array)
    const populated = userBookmarks
      .map((b: any) => {
        const article = db.articles.find((a: any) => a.id === b.article_id);
        return { ...article, bookmarked_at: b.created_at };
      })
      .filter((a: any) => a.id)
      .reverse();

    res.json(populated);
  });

  app.post("/api/bookmarks", (req, res) => {
    const db = getDb();
    if (!db.bookmarks) db.bookmarks = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const articleId = req.body.article_id;

    const existing = db.bookmarks.find(
      (b: any) => b.user_id === userId && b.article_id === articleId,
    );
    if (!existing) {
      db.bookmarks.push({
        user_id: userId,
        article_id: articleId,
        created_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    res.json({ success: true });
  });

  app.delete("/api/bookmarks/:articleId", (req, res) => {
    const db = getDb();
    if (!db.bookmarks) db.bookmarks = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const articleId = req.params.articleId;

    db.bookmarks = db.bookmarks.filter(
      (b: any) => !(b.user_id === userId && b.article_id === articleId),
    );
    saveDb(db);
    res.json({ success: true });
  });

  app.get("/api/bookmarks/check/:articleId", (req, res) => {
    const db = getDb();
    const bookmarks = db.bookmarks || [];
    const userId = req.headers["x-user-id"] || "user_1";
    const existing = bookmarks.find(
      (b: any) => b.user_id === userId && b.article_id === req.params.articleId,
    );
    res.json({ isBookmarked: !!existing });
  });

  // 5. Follows
  app.get("/api/follows", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const follows = db.follows || [];

    // Get list of followed authors with their details
    const userFollows = follows
      .filter((f: any) => f.follower_id === userId)
      .map((f: any) => {
        const author = db.users.find((u: any) => u.id === f.author_id);
        return { ...author, followed_at: f.created_at };
      })
      .filter((a: any) => a.id);

    res.json(userFollows);
  });

  app.get("/api/follows/feed", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const follows = db.follows || [];

    // Get list of followed author IDs
    const followedAuthorIds = follows
      .filter((f: any) => f.follower_id === userId)
      .map((f: any) => f.author_id);

    // Fetch articles by followed authors
    const feedArticles = db.articles
      .filter(
        (a: any) =>
          followedAuthorIds.includes(a.author_id) && a.status === "published",
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime(),
      );

    res.json(feedArticles);
  });

  app.post("/api/follows", (req, res) => {
    const db = getDb();
    if (!db.follows) db.follows = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const authorId = req.body.author_id;

    const existing = db.follows.find(
      (f: any) => f.follower_id === userId && f.author_id === authorId,
    );
    if (!existing) {
      db.follows.push({
        follower_id: userId,
        author_id: authorId,
        created_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    res.json({ success: true });
  });

  app.delete("/api/follows/:authorId", (req, res) => {
    const db = getDb();
    if (!db.follows) db.follows = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const authorId = req.params.authorId;

    db.follows = db.follows.filter(
      (f: any) => !(f.follower_id === userId && f.author_id === authorId),
    );
    saveDb(db);
    res.json({ success: true });
  });

  app.get("/api/follows/check/:authorId", (req, res) => {
    const db = getDb();
    const follows = db.follows || [];
    const userId = req.headers["x-user-id"] || "user_1";
    const existing = follows.find(
      (f: any) =>
        f.follower_id === userId && f.author_id === req.params.authorId,
    );
    res.json({ isFollowed: !!existing });
  });

  app.get("/api/users/:id/stats", (req, res) => {
    const db = getDb();
    const authorId = req.params.id;
    const articles = db.articles || [];
    const follows = db.follows || [];

    const totalArticles = articles.filter(
      (a: any) => a.author_id === authorId && a.status === "published",
    ).length;
    const followerCount = follows.filter(
      (f: any) => f.author_id === authorId,
    ).length;

    res.json({ totalArticles, followerCount });
  });

  // Ensure uploads directory exists and mount static serving
  const UPLOADS_DIR = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Centralized Media Library API
  app.get("/api/media", (req, res) => {
    const db = getDb();
    const mediaList = db.media || [];
    // Sort by descending date
    const sorted = [...mediaList].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(sorted);
  });

  app.post("/api/media", async (req, res) => {
    const db = getDb();
    const { file, thumbnail, originalName, title, altText: initialAltText, caption, description } = req.body;

    if (!file || !originalName) {
      return res.status(400).json({ error: "Missing required upload fields: file and originalName" });
    }

    try {
      // 1. Generate SEO-friendly filename
      const ext = ".webp";
      let base = "";
      if (title) {
        base = title;
      } else {
        const lastDot = originalName.lastIndexOf(".");
        base = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
      }
      let clean = base
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      if (!clean) {
        clean = "image-" + Date.now();
      }
      
      let finalFilename = `${clean}${ext}`;
      let filePath = path.join(UPLOADS_DIR, finalFilename);
      let counter = 1;
      while (fs.existsSync(filePath)) {
        finalFilename = `${clean}-${counter}${ext}`;
        filePath = path.join(UPLOADS_DIR, finalFilename);
        counter++;
      }

      // 2. Save WebP main image
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(filePath, buffer);

      // 3. Save thumbnail if provided
      let finalThumbnailFilename = "";
      if (thumbnail) {
        finalThumbnailFilename = `thumb-${finalFilename}`;
        const thumbBase64Data = thumbnail.replace(/^data:image\/\w+;base64,/, "");
        const thumbBuffer = Buffer.from(thumbBase64Data, "base64");
        fs.writeFileSync(path.join(UPLOADS_DIR, finalThumbnailFilename), thumbBuffer);
      }

      // 4. Default AI/AEO/SEO Metadata
      let altText = initialAltText || title || clean.replace(/-/g, " ");
      let aiMetadata = {
        context: `Contextual image representing ${altText} for BitLance platform.`,
        keywords: ["bitcoin", "freelancing", "remote-work", "lightning-network", "tech"],
        schemaJsonLd: {} as any
      };

      // 5. Enrich with Gemini AI if API Key available
      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build"
              }
            }
          });

          const promptText = "Analyze this image in the context of a Bitcoin, Lightning Network, and remote tech freelancing platform (BitLance). Return a JSON object with: 'altText' (highly search-optimized, short, under 8 words), 'contextDescription' (a natural, detailed sentence explaining the visual and its thematic connection to Bitcoin/tech freelancing), 'semanticKeywords' (an array of 5-8 highly relevant, search-indexed keywords).";

          const geminiRes = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              {
                inlineData: {
                  mimeType: "image/webp",
                  data: base64Data
                }
              },
              { text: promptText }
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  altText: { type: Type.STRING },
                  contextDescription: { type: Type.STRING },
                  semanticKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["altText", "contextDescription", "semanticKeywords"]
              }
            }
          });

          if (geminiRes.text) {
            const parsed = JSON.parse(geminiRes.text);
            if (parsed.altText && !initialAltText) {
              altText = parsed.altText;
            }
            aiMetadata.context = parsed.contextDescription || aiMetadata.context;
            aiMetadata.keywords = parsed.semanticKeywords || aiMetadata.keywords;
          }
        } catch (geminiErr) {
          console.error("Gemini Image Enrichment failed:", geminiErr);
        }
      }

      // 6. Structured JSON-LD ImageObject schema
      const schemaJsonLd = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "contentUrl": `https://blog.bitlance.work/uploads/${finalFilename}`,
        "creator": {
          "@type": "Organization",
          "name": "BitLance Team"
        },
        "caption": caption || altText,
        "description": description || aiMetadata.context,
        "keywords": aiMetadata.keywords.join(", "),
        "name": finalFilename
      };
      aiMetadata.schemaJsonLd = schemaJsonLd;

      // 7. Store media item details in DB
      const newMedia = {
        id: "m_" + Date.now(),
        filename: finalFilename,
        thumbnailFilename: finalThumbnailFilename || finalFilename,
        url: `/uploads/${finalFilename}`,
        thumbnailUrl: finalThumbnailFilename ? `/uploads/${finalThumbnailFilename}` : `/uploads/${finalFilename}`,
        originalName,
        mimeType: "image/webp",
        size: buffer.length,
        altText,
        title: title || clean.replace(/-/g, " "),
        caption: caption || "",
        description: description || "",
        createdAt: new Date().toISOString(),
        aiMetadata
      };

      if (!db.media) db.media = [];
      db.media.push(newMedia);
      saveDb(db);

      res.status(201).json(newMedia);
    } catch (err: any) {
      console.error("Failed to upload/optimize image:", err);
      res.status(500).json({ error: err.message || "Failed to process image upload" });
    }
  });

  app.put("/api/media/:id", (req, res) => {
    const db = getDb();
    const mediaId = req.params.id;
    const { altText, title, caption, description } = req.body;

    const mediaIndex = (db.media || []).findIndex((m: any) => m.id === mediaId);
    if (mediaIndex === -1) {
      return res.status(404).json({ error: "Media not found" });
    }

    const item = db.media[mediaIndex];
    if (altText !== undefined) item.altText = altText;
    if (title !== undefined) item.title = title;
    if (caption !== undefined) item.caption = caption;
    if (description !== undefined) item.description = description;

    // Refresh JSON-LD structured schema
    if (item.aiMetadata) {
      item.aiMetadata.schemaJsonLd = {
        ...item.aiMetadata.schemaJsonLd,
        "caption": item.caption || item.altText,
        "description": item.description || item.aiMetadata.context,
      };
    }

    saveDb(db);
    res.json(item);
  });

  app.delete("/api/media/:id", (req, res) => {
    const db = getDb();
    const mediaId = req.params.id;

    const mediaIndex = (db.media || []).findIndex((m: any) => m.id === mediaId);
    if (mediaIndex === -1) {
      return res.status(404).json({ error: "Media not found" });
    }

    const item = db.media[mediaIndex];

    try {
      // Delete main file
      const mainPath = path.join(UPLOADS_DIR, item.filename);
      if (fs.existsSync(mainPath)) {
        fs.unlinkSync(mainPath);
      }
      // Delete thumbnail file if exists
      if (item.thumbnailFilename && item.thumbnailFilename !== item.filename) {
        const thumbPath = path.join(UPLOADS_DIR, item.thumbnailFilename);
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      }
    } catch (err) {
      console.error("Error unlinking files from disk:", err);
    }

    db.media.splice(mediaIndex, 1);
    saveDb(db);
    res.json({ success: true });
  });

  let vite: any = null;

  // HTML Meta Injection helper functions
  function getMetadataForPath(reqPath: string) {
    const db = getDb();
    
    // 1. Article detail page: /article/:slug
    const articleMatch = reqPath.match(/^\/article\/([^/?#]+)/);
    if (articleMatch) {
      const slugOrId = articleMatch[1];
      const article = db.articles.find(
        (a: any) => a.slug === slugOrId || a.id === slugOrId
      );
      
      if (article) {
        const author = db.users.find((u: any) => u.id === article.author_id) || {
          name: "BitLance Team",
          avatar: "https://i.pravatar.cc/150?u=admin",
        };
        
        const title = article.seo_title || article.title || "BitLance Article";
        const description = article.meta_description || article.subtitle || article.content?.replace(/<[^>]+>/g, "").substring(0, 155) || "Read this article on BitLance.";
        const image = article.og_image || article.featured_image || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop";
        const url = `https://blog.bitlance.work/article/${article.slug || article.id}`;
        
        return {
          title,
          description,
          image,
          url,
          type: "article",
          publishedTime: article.published_at || article.created_at,
          authorName: author.name,
        };
      }
    }
    
    // 2. Homepage / Blog homepage: /
    const title = "BitLance Blog - Vetted Remote Bitcoin Jobs & Freelance Insights";
    const description = "Discover guides, tutorials, remote work strategies, and industry insights to thrive in the borderless Bitcoin economy on BitLance.";
    const image = "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=2670&auto=format&fit=crop";
    const url = "https://blog.bitlance.work";
    
    return {
      title,
      description,
      image,
      url,
      type: "website",
      publishedTime: null,
      authorName: "BitLance Team",
    };
  }

  function injectMetaTags(html: string, meta: any): string {
    const escapeHtml = (str: string) => {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };

    const cleanTitle = escapeHtml(meta.title);
    const cleanDescription = escapeHtml(meta.description);
    const cleanImage = escapeHtml(meta.image);
    const cleanUrl = escapeHtml(meta.url);
    const cleanAuthor = escapeHtml(meta.authorName);

    const metaTags = `
    <!-- SEO Metadata Injected by BitLance Server -->
    <title>${cleanTitle}</title>
    <meta name="title" content="${cleanTitle}" />
    <meta name="description" content="${cleanDescription}" />
    <link rel="canonical" href="${cleanUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${meta.type}" />
    <meta property="og:url" content="${cleanUrl}" />
    <meta property="og:title" content="${cleanTitle}" />
    <meta property="og:description" content="${cleanDescription}" />
    <meta property="og:image" content="${cleanImage}" />
    <meta property="og:site_name" content="BitLance" />
    ${meta.publishedTime ? `<meta property="article:published_time" content="${meta.publishedTime}" />` : ""}
    ${meta.authorName ? `<meta property="article:author" content="${cleanAuthor}" />` : ""}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${cleanUrl}" />
    <meta name="twitter:title" content="${cleanTitle}" />
    <meta name="twitter:description" content="${cleanDescription}" />
    <meta name="twitter:image" content="${cleanImage}" />
    `;
    
    // Remove existing title tags and canonical links to avoid duplicates
    let cleanedHtml = html.replace(/<title>.*?<\/title>/gi, "");
    cleanedHtml = cleanedHtml.replace(/<link rel="canonical".*?\/>/gi, "");
    
    // Insert the meta tags right before </head>
    return cleanedHtml.replace("</head>", `${metaTags}\n</head>`);
  }

  // Only run server listener and custom client-wildcard routers on persistent hosts, not Vercel
  if (!process.env.VERCEL) {
    const runLocal = async () => {
      // Vite middleware for development
      if (process.env.NODE_ENV !== "production") {
        vite = await createViteServer({
          server: { middlewareMode: true },
          appType: "custom",
        });
        app.use(vite.middlewares);
      } else {
        // Production static serving
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath, { index: false }));
      }

      // Fallback Wildcard Handler to Serve Hydrated HTML Pages
      app.get("*", async (req, res, next) => {
        const url = req.originalUrl || req.url;
        
        // Skip API, assets, or other system routes
        if (
          url.startsWith("/api/") ||
          url.includes(".") ||
          url.startsWith("/@") ||
          url.startsWith("/node_modules/")
        ) {
          return next();
        }
        
        try {
          let template = "";
          if (process.env.NODE_ENV !== "production") {
            const templatePath = path.resolve(process.cwd(), "index.html");
            if (fs.existsSync(templatePath)) {
              template = fs.readFileSync(templatePath, "utf-8");
            } else {
              return next();
            }
            template = await vite.transformIndexHtml(url, template);
          } else {
            const templatePath = path.resolve(process.cwd(), "dist", "index.html");
            if (fs.existsSync(templatePath)) {
              template = fs.readFileSync(templatePath, "utf-8");
            } else {
              return next();
            }
          }
          
          const meta = getMetadataForPath(url);
          const html = injectMetaTags(template, meta);
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
          if (process.env.NODE_ENV !== "production" && vite) {
            vite.ssrFixStacktrace(e as Error);
          }
          next(e);
        }
      });

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    };

    runLocal();
  }

  export default app;
