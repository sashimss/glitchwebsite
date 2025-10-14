"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search, Key, Menu, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCookie, deleteCookie } from "cookies-next";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Insights", href: "/blogs" },
  { name: "Projects", href: "/projects" },
  {name: "Contact Us", href: "/contact" }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeLink, setActiveLink] = React.useState(pathname);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = getCookie("authToken");
    setIsLoggedIn(!!token); // ✅ check login status
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    deleteCookie("authToken", { path: "/" });
    deleteCookie("guestMode", { path: "/" });
    setIsLoggedIn(false);
    router.push("/"); // redirect to homepage after logout
  };

  return (
    <header 
    className="w-full  flex items-center justify-between px-6 py-12 relative"
          style={{ background: "var(--header-bg)" }}
    >
      
      <nav className="hidden md:flex space-x-4">
        {navLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setActiveLink(link.href)}
            className={cn(
              "text-foreground text-sm sm:text-base transition-colors flex items-center py-1",
              activeLink === link.href
                ? "bg-primary text-primary-foreground px-2 rounded-full"
                : "hover:bg-transparent",
              {
                "hover:text-hover-green-1": index === 0,
                "hover:text-hover-green-2": index === 1,
                "hover:text-hover-green-3": index === 2,
                "hover:text-hover-green-4": index === 3,
                "hover:text-hover-green-5": index === 4,
              }
            )}
          >
            {link.name} ▼
          </Link>
        ))}
      </nav>

      <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-start md:justify-center">
        <img src="/logo-nobg.png" alt="Glitch Logo" className="h-12 mr-2" />
        <span className="text-4xl font-bold text-primary" style={{ textShadow: "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00" }}>GLITCH</span>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary hover:text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Dropdown Menu for Mobile */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background p-4 shadow-lg z-50">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { setActiveLink(link.href); setIsMenuOpen(false); }}
              className={cn(
                "block text-foreground text-sm py-2 transition-colors",
                activeLink === link.href
                  ? "bg-primary text-primary-foreground px-2 rounded-full"
                  : "hover:bg-transparent",
                {
                  "hover:text-hover-green-1": index === 0,
                  "hover:text-hover-green-2": index === 1,
                  "hover:text-hover-green-3": index === 2,
                  "hover:text-hover-green-4": index === 3,
                  "hover:text-hover-green-5": index === 4,
                }
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}


      <div className="hidden sm:flex items-center space-x-1">
        {isLoggedIn ? (
          <button
            className="bg-primary text-white text-base font-semibold ml-16 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-red-500 hover:scale-105"
            style={{ boxShadow: "0 2px 16px 0 #00ff00" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-primary text-white text-base font-semibold ml-16 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:bg-green-600 hover:scale-105"
            style={{ boxShadow: "0 2px 16px 0 #00ff00" }}
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}