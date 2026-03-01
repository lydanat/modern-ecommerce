"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Package, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin";
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Products", icon: Package },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-100 bg-white">

      {/* Start Header Logo */}
      <SidebarHeader className="px-2 py-5 border-b border-neutral-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-7 h-7 rounded-md bg-neutral-900 flex items-center justify-center shrink-0">
            <span className="font-serif text-white text-xs font-bold">F</span>
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-serif text-sm font-semibold text-neutral-900 tracking-tight">FLASH OF BUILD</span>
            <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400">Admin</span>
          </div>
        </div>
      </SidebarHeader>
      {/* End Header Logo */}

      {/* Start Navigation */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className={`rounded-lg h-9 gap-3 font-sans text-[0.78rem] tracking-wide transition-all duration-150 ${
                    active
                      ? "bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                  tooltip={label}
                >
                  <Link href={href}>
                    <Icon size={15} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* End Navigation */}

      {/* Start Footer Logout */}
      <SidebarFooter className="px-2 py-4 border-t border-neutral-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="rounded-lg h-9 gap-3 font-sans text-[0.78rem] tracking-wide text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer"
              tooltip="Logout"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* End Footer Logout */}

    </Sidebar>
  );
}