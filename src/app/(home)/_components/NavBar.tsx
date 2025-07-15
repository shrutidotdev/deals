"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
}

interface NavBarProps {
  navItems?: NavItem[];
  ctaText?: string;
  ctaHref?: string;
  logoHref?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  navItems = [
    { name: "Product", href: "/product" },
    { name: "Solutions", href: "/solutions" },
    { name: "Documentation", href: "/documentation" },
    { name: "Media", href: "/media" },
    { name: "Pricing", href: "/pricing" },
  ],
  ctaText = "Get started",
  ctaHref = "/get-started",
  logoHref = "/",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative w-full overflow-hidden border-2 rounded-b-4xl">
      <nav className="bg-neutral-950 py-4">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="ml-10 mt-0.5 hidden md:block">
            <div className="flex gap-6">
              {navItems.map((item) => (
                <Button key={item.name} asChild className="bg-transparent">
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>
          </div>
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href={logoHref} className="block">
              <svg
                width="40"
                height="auto"
                viewBox="0 0 50 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-neutral-50"
              >
                <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" />
                <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" />
              </svg>
            </Link>
          </div>

          {/* Desktop CTA Button */}
          <Button asChild className="mr-10 hidden  md:block">
            <Link
              href={ctaHref}
              className=" rounded-md px-3 py-1.5 text-sm text-neutral-50 "
            >
              <span className="font-bold">{ctaText}</span>
            </Link>
            
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="mt-0.5 block text-2xl text-neutral-50 md:hidden"
            aria-label="Toggle mobile menu"
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col gap-4 border-t border-neutral-800 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-50 transition-colors hover:text-neutral-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild>
                <Link
                  href={ctaHref}
                  className="mt-2 w-fit rounded-md px-3 py-1.5 text-sm text-neutral-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-bold">{ctaText}</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
