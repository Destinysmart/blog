import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader2 } from "lucide-react";

// Emails allowed into the admin UI. Server-side enforcement lives in
// server.ts (ADMIN_EMAILS) — this is a UX gate, not the security boundary.
const ADMIN_EMAILS = ["smartdestinyonyekachi@gmail.com"];

export function AdminGuard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
        <p className="text-gray-500 text-sm font-semibold">Verifying Secure Session...</p>
      </div>
    );
  }

  if (!user || !ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
