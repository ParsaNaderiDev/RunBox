import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "../lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "RunBox",
  description: "Minimal workspace to compose, run, and share code snapshots instantly."
};

const navItems = [
  { label: "Playground", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Admin", href: "/admin" }
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen overflow-x-hidden bg-background text-foreground antialiased", inter.variable)}>
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute left-1/2 top-[-10%] h-56 w-[80%] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
            <span className="absolute bottom-[-30%] left-[-20%] h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                  ▢
                </span>
                <span>RunBox</span>
              </Link>
              <div className="flex items-center gap-6 text-sm text-slate-200">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </header>
          <main className="relative flex-1 overflow-y-auto">{children}</main>
          <footer className="border-t border-white/10 bg-slate-950/70 py-4 text-center text-xs text-gray-400 backdrop-blur">
            © {new Date().getFullYear()} RunBox — Compose, run, and deploy instantly.
          </footer>
        </div>
      </body>
    </html>
  );
}
