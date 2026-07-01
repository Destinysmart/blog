import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ArrowRight, CheckCircle, Zap, Shield, Briefcase, User, Sparkles, AlertCircle, Info } from "lucide-react";

export function SignupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Detect selected signup type
  const typeParam = searchParams.get("type");
  
  // Local state for selected mode: 'hire' (client) or 'work' (freelancer)
  const [signupType, setSignupType] = useState<"hire" | "work" | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Client-specific form states
  const [companyName, setCompanyName] = useState("");
  const [projectBrief, setProjectBrief] = useState("");
  const [budgetSats, setBudgetSats] = useState("");
  
  // Freelancer-specific form states
  const [specialty, setSpecialty] = useState("");
  const [lightningAddress, setLightningAddress] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  
  // General flow states
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the URL search parameter on load and route transitions
  useEffect(() => {
    if (typeParam === "hire") {
      setSignupType("hire");
      setErrorMsg("");
    } else if (typeParam === "work") {
      setSignupType("work");
      setErrorMsg("");
    } else {
      // If type param is missing or invalid, make sure we show selection
      // But if there was a param and it was invalid, we can gracefully reset/warn
      if (typeParam !== null && typeParam !== "hire" && typeParam !== "work") {
        // Redirect to the clean default signup page without invalid params
        setSearchParams({});
      }
      setSignupType(null);
    }
  }, [typeParam, setSearchParams]);

  const handleSelectType = (selected: "hire" | "work") => {
    // This updates the URL param, which triggers the useEffect above
    setSearchParams({ type: selected });
  };

  const handleResetType = () => {
    setName("");
    setEmail("");
    setPassword("");
    setCompanyName("");
    setProjectBrief("");
    setBudgetSats("");
    setSpecialty("");
    setLightningAddress("");
    setPortfolioUrl("");
    setIsSuccess(false);
    setSearchParams({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (signupType === "work" && !lightningAddress.trim()) {
      setErrorMsg("Lightning payout address is required for freelancers to receive direct payouts.");
      return;
    }

    setIsSubmitting(true);

    // Simulate saving to local storage
    setTimeout(() => {
      const userData = {
        name,
        email,
        role: signupType === "hire" ? "Client" : "Freelancer",
        details: signupType === "hire" ? {
          companyName,
          projectBrief,
          budgetSats
        } : {
          specialty,
          lightningAddress,
          portfolioUrl
        },
        avatar: signupType === "hire" 
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem("registeredUser", JSON.stringify(userData));
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  // SEO metadata depending on account preselection
  const pageTitle = signupType === "hire"
    ? "Hire Vetted Remote Bitcoin Freelancers - Register Client Account"
    : signupType === "work"
    ? "Find Remote Bitcoin Jobs - Register Freelancer Account"
    : "Join Bitlance - The Vetted Remote Bitcoin Job Marketplace";

  const pageDescription = signupType === "hire"
    ? "Sign up as a client to hire top-tier global remote engineers, designers, and technical writers who work for Bitcoin. Lock contract budgets in secure Lightning escrows."
    : signupType === "work"
    ? "Sign up as a freelancer to discover curated remote Bitcoin-native roles. Earn hard currency and receive instant self-custodial payouts directly to your Lightning address."
    : "Register a secure, KYC-free account on Bitlance to hire vetted remote talent or work in the decentralized, borderless Bitcoin economy.";

  const pageCanonical = signupType === "hire"
    ? "https://www.bitlance.work/signup?type=hire"
    : signupType === "work"
    ? "https://www.bitlance.work/signup?type=work"
    : "https://www.bitlance.work/signup";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={pageCanonical}
        orgSchema={true}
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Sign Up", item: `/signup${signupType ? `?type=${signupType}` : ""}` }
        ]}
      />
      <Navigation />

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid md:grid-cols-12 min-h-[600px] animate-fade-in">
          
          {/* Left Feature Column */}
          <div className="md:col-span-5 bg-gradient-to-br from-gray-900 to-brand-950 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
                <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-extrabold shadow-sm">
                  B
                </div>
                <span className="font-extrabold tracking-tight text-lg group-hover:text-brand-300 transition-colors">Bitlance</span>
              </Link>

              {/* Dynamic Feature List based on account selection */}
              {signupType === "hire" ? (
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> Client Experience
                  </div>
                  <h2 className="text-2xl font-black tracking-tight leading-tight md:text-3xl">
                    Hire the World's Best Bitcoin Developers
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Access elite remote talent who understand cryptography, Layer-2 integration, and peer-to-peer engineering.
                  </p>
                  
                  <ul className="space-y-4 pt-4 text-sm text-gray-200">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Pre-Vetted Proof of Work</strong>
                        <span>We verify skills so you don't waste time interviewing.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Lightning Smart Escrow</strong>
                        <span>Fund milestones securely. Talent keeps 100% of payout.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Friction-Free Onboarding</strong>
                        <span>KYC-free early setup. Sign up and post jobs immediately.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              ) : signupType === "work" ? (
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-brand-500/20 text-brand-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 fill-current" /> Freelancer Experience
                  </div>
                  <h2 className="text-2xl font-black tracking-tight leading-tight md:text-3xl">
                    Earn Hard Money for Your Contributions
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Say goodbye to high fees and payment delays. Get paid in Bitcoin for doing what you love.
                  </p>
                  
                  <ul className="space-y-4 pt-4 text-sm text-gray-200">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">0% Freelancer Earnings Cut</strong>
                        <span>Keep 100% of what you earn. Employer pays the 5% flat fee.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">Direct Self-Custodial Payouts</strong>
                        <span>Escrows pay out instantly to your configured Lightning address.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">True Privacy-First Focus</strong>
                        <span>No intrusive identity checks. Build a profile on your Proof of Work.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black tracking-tight leading-tight md:text-3xl">
                    Connect with the Bitcoin Economy
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Bitlance is the vetted global marketplace connecting innovative employers with remote Bitcoin developers, designers, and specialists.
                  </p>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-500/15 rounded-lg flex items-center justify-center text-brand-400 font-extrabold text-sm shrink-0">
                        LN
                      </div>
                      <p className="text-xs text-gray-300 font-medium">Lightning Network instant micro-payroll.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-500/15 rounded-lg flex items-center justify-center text-brand-400 font-extrabold text-sm shrink-0">
                        0%
                      </div>
                      <p className="text-xs text-gray-300 font-medium">100% earnings to freelancers, no commission cuts.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 pt-8 border-t border-gray-800 mt-10">
              <p className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-400" /> Secure SSL Escrow Escort
              </p>
            </div>
          </div>

          {/* Right Action Column */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
            
            {/* 1. Account type selection screen (if parameter is missing/invalid) */}
            {!signupType && !isSuccess && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
                    Create Your Account
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">
                    Choose how you want to interact with the Bitlance network.
                  </p>
                </div>

                <div className="grid gap-4">
                  {/* Employer Choice */}
                  <button
                    onClick={() => handleSelectType("hire")}
                    className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 hover:border-brand-500 hover:bg-brand-50/20 text-left transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-100 transition-colors">
                      <Briefcase className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-950 text-base group-hover:text-brand-700 transition-colors flex items-center justify-between">
                        I want to Hire Talent
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                        I am a company, founder, or project manager looking to find remote developers and lock milestones in secure Bitcoin escrows.
                      </p>
                    </div>
                  </button>

                  {/* Freelancer Choice */}
                  <button
                    onClick={() => handleSelectType("work")}
                    className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 hover:border-brand-500 hover:bg-brand-50/20 text-left transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                      <User className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-950 text-base group-hover:text-brand-700 transition-colors flex items-center justify-between">
                        I want to Find Work
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                        I am an engineer, designer, or specialist looking to bid on Bitcoin contracts and receive self-custodial payouts.
                      </p>
                    </div>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400 font-semibold">
                    Already have an account? <Link to="/profile" className="text-brand-600 hover:underline">Log In</Link>
                  </p>
                </div>
              </div>
            )}

            {/* 2. Success screen */}
            {isSuccess && (
              <div className="space-y-6 text-center animate-fade-in max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-black text-gray-950 tracking-tight mb-2">
                    Welcome to the Network!
                  </h2>
                  <p className="text-sm text-gray-500 font-medium">
                    Your <strong className="text-gray-900">{signupType === "hire" ? "Client" : "Freelancer"}</strong> profile was successfully created and initialized on-chain.
                  </p>
                </div>

                {signupType === "hire" ? (
                  <div className="bg-brand-50/30 rounded-2xl p-4 border border-brand-100 text-left text-xs leading-relaxed text-brand-900">
                    <p className="font-bold mb-1 flex items-center gap-1.5 text-brand-800">
                      <Info className="w-4 h-4" /> Next Steps for Clients:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 mt-1 font-semibold text-brand-750">
                      <li>Configure your company profile on your dashboard.</li>
                      <li>Post a job with a milestone budget (denominated in sats).</li>
                      <li>Receive curated bids from verified, pre-vetted freelancers.</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-brand-50/30 rounded-2xl p-4 border border-brand-100 text-left text-xs leading-relaxed text-brand-900">
                    <p className="font-bold mb-1 flex items-center gap-1.5 text-brand-800">
                      <Info className="w-4 h-4" /> Next Steps for Freelancers:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 mt-1 font-semibold text-brand-750">
                      <li>Your Lightning Address <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">{lightningAddress}</code> is configured.</li>
                      <li>Explore published articles and active jobs.</li>
                      <li>Place bids on active milestones with zero commission cuts.</li>
                    </ul>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleGoToProfile}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm text-sm"
                  >
                    Go to My Dashboard
                  </button>
                  <button
                    onClick={handleResetType}
                    className="w-full bg-white hover:bg-gray-50 text-gray-600 font-bold py-2.5 px-6 rounded-xl border border-gray-200 transition-all text-xs"
                  >
                    Register another account
                  </button>
                </div>
              </div>
            )}

            {/* 3. Personalized Client/Freelancer registration forms */}
            {signupType && !isSuccess && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResetType}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 hover:bg-gray-100 py-1.5 px-3 rounded-lg transition-all border border-transparent hover:border-gray-150"
                  >
                    ← Choose Type
                  </button>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    signupType === "hire" 
                      ? "bg-brand-50 text-brand-700 border-brand-200" 
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {signupType === "hire" ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {signupType === "hire" ? "Client Account" : "Freelancer Account"}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
                    {signupType === "hire" ? "Hire Bitcoin Freelancers" : "Earn Bitcoin for Your Work"}
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">
                    {signupType === "hire" 
                      ? "Create a client profile to source global experts and fund secure escrows."
                      : "Create a freelancer profile to browse work and receive direct micro-payouts."}
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Common required fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alice Nakamoto"
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alice@company.com"
                        className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                    />
                  </div>

                  {/* Client-specific onboarding questions */}
                  {signupType === "hire" ? (
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Company Name <span className="text-gray-400 font-medium">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Satoshi Labs Inc."
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Initial Project Brief
                          </label>
                          <input
                            type="text"
                            value={projectBrief}
                            onChange={(e) => setProjectBrief(e.target.value)}
                            placeholder="e.g. Integrate LND smart escrow"
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Preferred Milestone Budget <span className="text-gray-400 font-medium">(sats)</span>
                          </label>
                          <input
                            type="number"
                            value={budgetSats}
                            onChange={(e) => setBudgetSats(e.target.value)}
                            placeholder="e.g. 5000000"
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Freelancer-specific onboarding questions */
                    <div className="space-y-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Primary Specialty / Skill <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          placeholder="e.g. Lightning Network Integration (LND/CLN)"
                          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            Lightning Payout Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={lightningAddress}
                            onChange={(e) => setLightningAddress(e.target.value)}
                            placeholder="satoshi@getalby.com"
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all font-mono"
                          />
                          <p className="text-[10px] text-gray-400 mt-1 font-semibold leading-relaxed">
                            Escrow releases land directly in this self-custodial wallet.
                          </p>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                            GitHub / Portfolio Link
                          </label>
                          <input
                            type="url"
                            value={portfolioUrl}
                            onChange={(e) => setPortfolioUrl(e.target.value)}
                            placeholder="https://github.com/satoshi"
                            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-medium text-sm transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md text-sm mt-6 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Initializing On-Chain Account..."
                    ) : (
                      <>
                        Initialize My Bitlance Profile
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
