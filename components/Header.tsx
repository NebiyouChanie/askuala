"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Search, UserCircle } from "lucide-react";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [user, setUser] = useState<{ name: string; firstName?: string; lastName?: string; email: string; role: string } | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastScrollY;
      setIsScrollingUp(scrollingUp);

      const hideThreshold = 40;
      if (!scrollingUp && currentY > hideThreshold) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentY);
      setIsAtTop(currentY <= 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await res.json()
        setUser(data.user || null)
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('#header-user-menu')) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const headerColorClasses = !isAtTop && isScrollingUp
    ? "bg-[#3E9971] text-white shadow-sm"
    : "bg-transparent text-white";

  return (
    <header className={`${headerColorClasses} fixed top-0 left-0 right-0 z-50 transition-transform duration-300 px-6 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex items-center justify-between">
          <div className="relative flex items-center space-x-2 w-40 h-10 ">
              <Image src="/images/logo1.png" alt="Askuala logo" fill priority className="object-contain" />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:opacity-70">
                Home
              </Link>
              <Link href="/services" className="hover:opacity-70">
                Services
              </Link>
              <Link href="/about" className="hover:opacity-70 font-semibold">
                About
              </Link>
              <Link href="/contact" className="hover:opacity-70">
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <Link href="/auth/signin">
                    <Button className="bg-transparent border border-current text-current hover:bg-[#e55a4a] hover:text-white px-6 py-2 rounded-md">
                      <UserCircle className="w-6 h-6" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-6 py-2 rounded-md">Register Courses</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div id="header-user-menu" className="relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      onClick={() => setIsMenuOpen((v) => !v)}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                        <span className="text-sm font-semibold">{(user.firstName || user.email)?.[0]?.toUpperCase() || 'U'}</span>
                      </div>
                      <span className="hidden sm:inline">{user.firstName || user.email}</span>
                    </button>
                    {isMenuOpen && (
                      <div role="menu" className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg">
                        <Link href="/my-courses" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>My Courses</Link>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={async () => {
                            await fetch('/api/auth/signout', { method: 'POST' })
                            location.reload()
                          }}
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                  <Link href="/services">
                    <Button className="bg-[#FF6652] hover:bg-[#e55a4a] text-white px-6 py-2 rounded-md">Register Courses</Button>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
  )
}