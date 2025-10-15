"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search, Key, Menu, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCookie, deleteCookie } from "cookies-next";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

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
  const checkLogin = () => {
    const token = getCookie("authToken");
    setIsLoggedIn(!!token);
  };

  checkLogin();
  window.addEventListener("storage", checkLogin);
  return () => window.removeEventListener("storage", checkLogin);
}, []);


  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
  try {
    //Sign out from Firebase (removes Firebase session)
    await signOut(auth);

    // Remove cookies used by your app
    deleteCookie("authToken", { path: "/" });
    deleteCookie("guestMode", { path: "/" });

    // Update UI instantly
    setIsLoggedIn(false);

    // Optional: notify other tabs
    window.dispatchEvent(new Event("storage"));

    // Redirect to homepage
    router.push("/");
  } catch (err) {
    console.error("Logout error:", err);
  }
  };

  return (
    <header 
    className="w-full  flex items-center justify-between px-6 py-12 relative z-50"
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
  <Image
    src="/logo-nobg.png"
    alt="Glitch Logo"
    width={48}
    height={48}
    priority
  />
  <span className="text-4xl font-bold text-primary" style={{ textShadow: "0 0 30px #00ff00" }}>
    GLITCH
  </span>
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