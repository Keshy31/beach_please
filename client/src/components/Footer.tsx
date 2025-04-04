import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Info, Map, Anchor, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#20B2AA] text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Beach Please</h3>
            <p className="text-white/90 text-sm">
              Helping you discover the best beaches in South Africa through community voting and fair rankings.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/rankings" className="text-white/90 hover:text-white transition-colors flex items-center gap-1">
                  <Anchor className="h-4 w-4" /> Top Beaches
                </Link>
              </li>
              <li>
                <Link href="/beaches" className="text-white/90 hover:text-white transition-colors flex items-center gap-1">
                  <Map className="h-4 w-4" /> All Beaches
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white/90 hover:text-white transition-colors flex items-center gap-1">
                  <Heart className="h-4 w-4" /> Vote Now
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/90 hover:text-white transition-colors flex items-center gap-1">
                  <Info className="h-4 w-4" /> How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/90 hover:text-white transition-colors">
                  Our Mission
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <p className="text-white/90 text-sm mb-3">Follow us for beach updates and tips</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/90 hover:text-white transition-colors p-2 rounded-full bg-[#1A9994] hover:bg-[#177E79]">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors p-2 rounded-full bg-[#1A9994] hover:bg-[#177E79]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors p-2 rounded-full bg-[#1A9994] hover:bg-[#177E79]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@beachplease.com" className="text-white/90 hover:text-white transition-colors p-2 rounded-full bg-[#1A9994] hover:bg-[#177E79]">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 mt-8 text-center text-sm text-white/90">
          <p>© {new Date().getFullYear()} Beach Please - South African Beaches Edition. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
