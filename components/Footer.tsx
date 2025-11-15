import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#245D51] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="relative w-40 h-12">
                <Image src="/images/logo1.png" alt="Askuala logo" fill className="object-contain" />
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-gray-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-gray-300">
                    About
                  </Link>
                </li>
                   <li>
                  <Link href="/services" className="hover:text-gray-300">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-bold mb-6">Support</h3>
              <p className="text-gray-300 mb-6">
                Askuala is a dedicated tutor and consultancy company which delivers an online and face to face services
                on education
              </p>
               
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Social Links</h3>
              <div className="flex space-x-4">
                <Link href="https://facebook.com/askuala" target="_blank" aria-label="Facebook" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-90">
                  <Facebook className="w-5 h-5 text-[#245D51]" />
                </Link>
                <Link href="https://twitter.com/askuala" target="_blank" aria-label="Twitter" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-90">
                  <Twitter className="w-5 h-5 text-[#245D51]" />
                </Link>
                <Link href="https://instagram.com/askuala" target="_blank" aria-label="Instagram" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-90">
                  <Instagram className="w-5 h-5 text-[#245D51]" />
                </Link>
                <Link href="https://linkedin.com/company/askuala" target="_blank" aria-label="LinkedIn" className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:opacity-90">
                  <Linkedin className="w-5 h-5 text-[#245D51]" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">Copyright © Askuala 2025, All Rights Reserved</p>
          </div>
        </div>
      </footer>
  )
}