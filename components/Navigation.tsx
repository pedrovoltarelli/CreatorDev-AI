"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Terminal, User, ChevronDown, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const navItems = (t: { dashboard: string; generate: string; history: string; pricing: string; pains: string }, isAdmin?: boolean) => [
  { name: t.dashboard, href: "/dashboard" },
  { name: t.generate, href: "/dashboard/generate" },
  { name: t.history, href: "/dashboard/history" },
  { name: t.pains, href: "/dashboard/pains" },
  { name: t.pricing, href: "/pricing" },
  ...(isAdmin ? [{ name: "Admin", href: "/dashboard/admin" }] : []),
];

const languagesList: { code: Language; label: string; flag: string }[] = [
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "en-US", label: "English", flag: "🇺🇸" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t: translations } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navItemsList = navItems(translations, user?.isAdmin);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (logout) {
      logout().then(() => {
        window.location.href = "/";
      });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-800 rounded-md flex items-center justify-center">
              <Terminal className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="font-medium text-zinc-50 hidden sm:block">CreatorDev AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItemsList.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? "text-zinc-50 bg-white/5"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center gap-1">
              {languagesList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    language === lang.code
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 ml-4">
                <Link href="/login" className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                  {translations.login}
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                  {translations.signup}
                </Link>
              </div>
            ) : (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full bg-zinc-800" />
                  <span className="text-sm text-zinc-300 hidden lg:block">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-zinc-300">{user?.name}</p>
                      <p className="text-xs text-zinc-600">{user?.email}</p>
                    </div>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5">
                      <User className="w-4 h-4" />
                      {translations.settings}
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/5">
                      <LogOut className="w-4 h-4" />
                      {translations.logout}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-zinc-400">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-zinc-950">
          <div className="px-6 py-4 space-y-1">
            {navItemsList.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm ${pathname === item.href ? "text-zinc-50 bg-white/5" : "text-zinc-500"}`}>
                {item.name}
              </Link>
            ))}

            <div className="border-t border-white/5 mt-4 pt-4">
              <p className="px-4 text-xs text-zinc-600 mb-2">Idioma / Language</p>
              <div className="flex gap-2 px-4">
                {languagesList.map((lang) => (
                  <button key={lang.code} onClick={() => { setLanguage(lang.code); setMobileMenuOpen(false); }} className={`flex-1 py-2 rounded-lg text-sm ${language === lang.code ? "bg-violet-600 text-white" : "bg-white/5 text-zinc-400"}`}>
                    {lang.flag} {lang.code.split("-")[0]}
                  </button>
                ))}
              </div>
            </div>
            
            {!isAuthenticated ? (
              <div className="pt-4 space-y-2 border-t border-white/5 mt-4">
                <Link href="/login" className="block btn-secondary text-center py-2.5">{translations.login}</Link>
                <Link href="/register" className="block btn-primary text-center py-2.5">{translations.signup}</Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/5 mt-4">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                  <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full bg-zinc-800" />
                  <div>
                    <p className="text-sm text-zinc-300">{user?.name}</p>
                    <p className="text-xs text-zinc-600">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-zinc-500">
                  {translations.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}