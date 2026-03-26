"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { ThemeToggle } from "@/components/shared/theme/theme-toggle";
import { Home, LayoutGrid, Search, User, LogOut, Scan, Menu, X, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const NAV_LINKS = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Collection", href: "/dashboard/collection", icon: LayoutGrid },
    { label: "Browse", href: "/dashboard/browse", icon: Search },
    { label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
    { label: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-current/10 bg-background flex flex-col p-4 
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-10 px-4">
          <h1 className="text-xl font-bold">Coll X</h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-current/5 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isActive ? "bg-current/10 text-foreground" : "text-foreground/50 hover:bg-current/5 hover:text-foreground"
                  }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-current/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-11 h-11 rounded-2xl bg-current/5 flex items-center justify-center shrink-0">
              <User size={22} className="text-foreground/60" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user?.name || "Root Admin"}</p>
              <p className="text-[11px] text-foreground/40 truncate">{user?.email || "root@gmail.com"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300
        ${isSidebarOpen ? "md:ml-64" : "ml-0"}
      `}>
        {/* Navbar */}
        <header className="h-18 border-b border-current/10 flex items-center justify-between px-4 md:px-8 bg-background/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 hover:bg-current/5 rounded-xl transition-all ${isSidebarOpen ? "opacity-0 invisible w-0 p-0" : "opacity-100 visible"}`}
            >
              <Menu size={20} />
            </button>
            <div className={isSidebarOpen ? "hidden md:block" : "block"}>
              <Link href="/" className="md:hidden text-xl font-bold">Coll X</Link>
              <h1 className="hidden md:block text-lg font-medium text-foreground/60">Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">

            <div className="flex items-center gap-4 border-l border-current/10 pl-6 h-8">
              <ThemeToggle />
            </div>

            <button
              onClick={logout}
              className="flex items-center bg-red-500/40 px-3 md:px-4 rounded-full gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors h-8"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
