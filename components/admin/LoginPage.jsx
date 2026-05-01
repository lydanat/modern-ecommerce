"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = "/admin/dashboard";
      else setChecking(false);
    });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim())    return setError("Email is required.");
    if (!password.trim()) return setError("Password is required.");

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    let referrerPath = "";
    if (document.referrer) {
      try {
        referrerPath = new URL(document.referrer).pathname;
      } catch {
        referrerPath = "";
      }
    }
    if (referrerPath.startsWith("/product")) {
      window.location.href = "/product";
      return;
    }

    window.location.href = "/";
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        {/* Loading Icon */}
        <svg className="animate-spin h-5 w-5 text-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />

      <div className="relative w-full max-w-sm">

        <div className="mb-8 flex justify-start">
          <Button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-4 font-sans text-[0.75rem] font-medium tracking-[0.12em] uppercase text-neutral-600 shadow-sm transition-colors duration-200 hover:bg-neutral-200 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Brand mark */}
        <div className="text-center mb-8">
          <p className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">FLASH OF BUILD</p>
          <p className="font-sans text-[0.7rem] tracking-[0.25em] uppercase text-neutral-400 mt-1">Admin Console</p>
        </div>

        <Card className="border border-neutral-200 shadow-sm bg-white rounded-xl">
          <CardHeader className="pb-0 pt-6 px-6">
            <h1 className="font-sans text-base font-medium text-neutral-900 tracking-wide text-center">Sign in to continue</h1>
            <p className="font-sans text-xs text-neutral-400 mt-0.5 text-center">Restricted access — authorised personnel only</p>
          </CardHeader>

          <CardContent className="px-6 pb-6 pt-5">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="font-sans text-[0.72rem] tracking-widest uppercase text-neutral-500">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@brand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-lg border-neutral-200 bg-neutral-50 font-sans text-sm placeholder:text-neutral-300 focus-visible:ring-neutral-900 focus-visible:ring-1 focus-visible:border-neutral-900"
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="font-sans text-[0.72rem] tracking-widest uppercase text-neutral-500">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 rounded-lg border-neutral-200 bg-neutral-50 font-sans text-sm placeholder:text-neutral-300 focus-visible:ring-neutral-900 focus-visible:ring-1 focus-visible:border-neutral-900"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="font-sans text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-10 w-full rounded-lg bg-neutral-900 hover:bg-black text-white font-sans text-[0.78rem] tracking-widest uppercase transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center font-sans text-[0.65rem] text-neutral-300 tracking-wide mt-6">
          © {new Date().getFullYear()} Flash of Build. All rights reserved.
        </p>
      </div>
    </div>
  );
}