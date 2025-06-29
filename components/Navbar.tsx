"use client"
import * as React from "react";
import { Button } from "@/components/ui/button"; // Adjust path based on your structure
import { Search, Menu, Key } from "lucide-react"; // Added Key icon for keypad
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Adjust path based on your structure

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Pages", href: "/pages" },
  { name: "Projects", href: "/projects" },
  { name: "Insights", href: "/insights" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const officeDetails = {
    address: "Office Address\n123/A, Miranda City\nLilkai Prikano, Dope",
    phone: "+0999 7876 9653 9\n+(090) 8765 8654 83 85",
    email: "info@example.mail@hum.com",
  };

  return (
    <header className="w-full px-6 py-10 bg-background flex items-center justify-between shadow-md relative">
      {/* Left Navbar */}
      <nav className="flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-foreground hover:text-primary transition-colors text-sm sm:text-base",
              pathname === link.href ? "underline underline-offset-4 text-primary" : ""
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-primary flex items-center space-x-2">
        <span>GLITCH</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
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

      {/* Modal for Office Details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg text-foreground w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Office Details</h2>
            <p className="mb-2"><strong>Address:</strong><br />{officeDetails.address}</p>
            <p className="mb-2"><strong>Phone Number:</strong><br />{officeDetails.phone}</p>
            <p className="mb-4"><strong>Email Address:</strong><br />{officeDetails.email}</p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-foreground hover:text-primary"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}