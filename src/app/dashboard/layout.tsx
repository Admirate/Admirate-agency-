"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { asset } from "@/lib/cdn";

const navItems = [
  {
    href: "/dashboard",
    label: "Submissions",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/emailer",
    label: "Emailer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    href: "/dashboard/emailer/recipients",
    label: "Recipients",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  // Close the drawer on navigation, so tapping a link doesn't leave it covering
  // the page it just opened.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // Lock the page behind the drawer while it's open.
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#111",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        }}
      />

      {/* Mobile / tablet top bar — the sidebar is off-canvas below lg. */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 h-16 px-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setNavOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          aria-controls="dashboard-sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <Image
            src={asset("admirate logo.webp")}
            alt="Admirate logo"
            width={30}
            height={30}
            className="rounded-lg shrink-0"
          />
          <span className="text-sm font-bold text-gray-900 tracking-wide truncate">
            ADMIRATE
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="ml-auto p-2 text-gray-500 hover:text-[#FF0D0D] hover:bg-[#FF0D0D]/5 rounded-lg transition-colors"
          aria-label="Log out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* Scrim — only rendered (and only clickable) while the drawer is open. */}
      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          aria-hidden="true"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-[270px] max-w-[85vw] bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <Image
              src={asset("admirate logo.webp")}
              alt="Admirate logo"
              width={36}
              height={36}
              className="rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-gray-900 tracking-wide truncate">
                ADMIRATE
              </h1>
              <p className="text-gray-400 text-[11px] font-medium">
                Admin Dashboard
              </p>
            </div>
          </Link>

          <button
            onClick={() => setNavOpen(false)}
            className="lg:hidden p-2 -mr-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Close navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav
          className="flex-1 overflow-y-auto p-3 space-y-0.5 mt-2"
          aria-label="Dashboard navigation"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#FF0D0D]/8 text-[#FF0D0D]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className={isActive ? "text-[#FF0D0D]" : "text-gray-400"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 m-3 mt-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm text-gray-500 hover:text-[#FF0D0D] hover:bg-[#FF0D0D]/5 rounded-xl transition-all duration-200"
            aria-label="Log out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:ml-[270px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
