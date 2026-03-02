"use client";

import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/sidebar/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <Toaster position="top-right" richColors closeButton />

      <div className="flex min-h-screen w-full bg-neutral-50">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-neutral-100 bg-white flex items-center px-4 gap-3 shrink-0">
            <SidebarTrigger className="text-neutral-400 hover:text-neutral-900 transition-colors" />
            <div className="w-px h-4 bg-neutral-200" />
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-neutral-400">
              Dashboard
            </p>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}