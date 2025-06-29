// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Utility for conditional classes, optional

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Blogs", href: "/blogs" },
  { name: "Projects", href: "/projects" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold text-pink-500 tracking-wide hover:glitch-effect">
        Glitch
      </Link>
      <div className="space-x-4 text-sm sm:text-base">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-white hover:text-pink-400 transition-colors",
              pathname === link.href ? "underline underline-offset-4 text-pink-400" : ""
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
