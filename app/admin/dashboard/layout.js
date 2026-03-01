"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/layout/sidebar/Sidebar";

export default function AdminLayout({ children }) {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) window.location.href = "/admin";
      else { setAuthed(true); setChecking(false); }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = "/admin";
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <svg className="animate-spin h-5 w-5 text-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <SidebarProvider>
      {/* Sonner toast container — position top-right */}
      <Toaster position="top-right" richColors closeButton />

      <div className="flex min-h-screen w-full bg-neutral-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-neutral-100 bg-white flex items-center px-4 gap-3 shrink-0">
            <SidebarTrigger className="text-neutral-400 hover:text-neutral-900 transition-colors" />
            <div className="w-px h-4 bg-neutral-200" />
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-neutral-400">Dashboard</p>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}