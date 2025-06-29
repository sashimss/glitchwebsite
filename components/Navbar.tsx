"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Search, Key, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Insights", href: "/blogs" },
  { name: "Projects", href: "/projects" },
];

export default function Header() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = React.useState(pathname);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const officeDetails = {
    address: "IIT Hyderabad",
    phone: "0123456789",
    email: "glitch@iith.ac.in",
  };

  return (
    <header className="w-full bg-background flex items-center justify-between px-6 py-12 relative">
      
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

      <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-start md:justify-center">
        <img src="/logo-nobg.png" alt="Glitch Logo" className="h-12 mr-2" />
        <span className="text-4xl font-bold text-primary" style={{ textShadow: "0 0 30px #00ff00, 0 0 30px #00ff00, 0 0 0 #00ff00" }}>GLITCH</span>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary hover:text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Right Navbar */}
      <div className="hidden sm:flex items-center space-x-6">
        <a href="mailto:glitch@iith.ac.in" className="text-primary text-sm sm:text-base">
          glitch@iith.ac.in
        </a>
        <button
          className="text-primary hover:text-foreground"
          onClick={() => setIsModalOpen(true)}
        >
          <Key className="h-5 w-5" />
        </button>
      </div>

      {isModalOpen && pathname === "/" && (
        <div className="fixed top-16 right-6 bg-background p-4 rounded-lg shadow-lg text-foreground w-64 z-50 border border-primary">
          <h2 className="text-lg font-bold mb-2">Office Details</h2>
          <p className="mb-1 text-sm"><strong>Address:</strong><br />{officeDetails.address}</p>
          <p className="mb-1 text-sm"><strong>Phone Number:</strong><br />{officeDetails.phone}</p>
          <p className="mb-2 text-sm"><strong>Email Address:</strong><br />{officeDetails.email}</p>
          <button
            className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm hover:bg-primary-foreground hover:text-primary"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </header>
  );
}