"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

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

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/solutions" },
  { name: "Analytics ", href: "/documentation" },
  { name: "Settings", href: "/media" },
  { name: "Pricing", href: "/pricing" },
];

const NavBar: React.FC<NavBarProps> = ({
  navItems = DEFAULT_NAV_ITEMS,
  logoHref = "/",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="relative w-full overflow-hidden border-2 rounded-b-4xl">
      <nav className="bg-neutral-950 py-4">
        <div className="mx-auto flex items-center justify-between px-4 md:px-10">
          {/* Desktop Navigation - Left Side */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navItems.map((item) => (
              <Button
                key={item.name}
                asChild
                variant="ghost"
                className="text-neutral-50 hover:text-neutral-300 hover:bg-neutral-800 text-sm xl:text-base px-2 xl:px-4"
              >
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>

          {/* Mobile: Logo on left, Menu on right */}
          <div className="flex items-center lg:hidden">
            <Link
              href={logoHref}
              className="block transition-transform hover:scale-105"
              aria-label="Go to homepage"
            >
              <svg
                width="32"
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

          {/* Desktop: Logo in center */}
          <div className="hidden lg:flex items-center absolute left-1/2 transform translate-x-1/2">
            <Link
              href={logoHref}
              className="block transition-transform hover:scale-105"
              aria-label="Go to homepage"
            >
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

          {/* Desktop Auth Buttons - Right Side */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 xl:w-10 xl:h-10",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile: Auth + Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <Button
              onClick={toggleMobileMenu}
              className="p-2 text-neutral-50 hover:text-neutral-300 transition-colors ml-2"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 border-t border-neutral-800">
            <div className="flex flex-col py-4 px-4 space-y-3">
              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-50  hover:bg-primary/95  hover:text-neutral-300 transition-colors py-1 px-6 rounded-md text-base font-medium"
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
