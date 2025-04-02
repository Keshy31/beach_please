import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <i className="fas fa-umbrella-beach text-ocean text-2xl"></i>
            <h1 className="text-2xl font-display font-bold text-ocean-dark">
              <span className="text-ocean">Beach</span> Rank
            </h1>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <a className="text-neutral-dark hover:text-ocean transition-colors">Home</a>
          </Link>
          <Link href="#rankings">
            <a className="text-neutral-dark hover:text-ocean transition-colors">Rankings</a>
          </Link>
          <Link href="#about">
            <a className="text-neutral-dark hover:text-ocean transition-colors">About</a>
          </Link>
          <Button className="bg-ocean text-white hover:bg-ocean-dark">
            Sign In
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden" aria-label="Menu">
              <i className="fas fa-bars text-ocean-dark text-xl"></i>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/">
                <a 
                  className="text-neutral-dark hover:text-ocean transition-colors py-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  Home
                </a>
              </Link>
              <Link href="#rankings">
                <a 
                  className="text-neutral-dark hover:text-ocean transition-colors py-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  Rankings
                </a>
              </Link>
              <Link href="#about">
                <a 
                  className="text-neutral-dark hover:text-ocean transition-colors py-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  About
                </a>
              </Link>
              <Button className="bg-ocean text-white hover:bg-ocean-dark w-full mt-4">
                Sign In
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
