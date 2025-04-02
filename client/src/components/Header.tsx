import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Waves, Umbrella, Shell, Anchor, Fish, Menu } from "lucide-react";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[hsl(var(--color-ocean-light))] to-[hsl(var(--color-ocean))] shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <Waves className="text-white h-7 w-7" />
            <h1 className="text-2xl font-display font-bold text-white">
              South African <span className="font-black">Beach</span>Rank
            </h1>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <a className="text-white hover:text-[hsl(var(--color-sand))] transition-colors flex items-center gap-1">
              <Umbrella className="h-4 w-4" /> Home
            </a>
          </Link>
          <Link href="#rankings">
            <a className="text-white hover:text-[hsl(var(--color-sand))] transition-colors flex items-center gap-1">
              <Anchor className="h-4 w-4" /> Rankings
            </a>
          </Link>
          <Link href="#about">
            <a className="text-white hover:text-[hsl(var(--color-sand))] transition-colors flex items-center gap-1">
              <Shell className="h-4 w-4" /> About
            </a>
          </Link>
          <Button className="bg-[hsl(var(--color-sand))] text-[hsl(var(--color-ocean-dark))] hover:bg-white">
            <Fish className="h-4 w-4 mr-1" /> Sign In
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-white" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gradient-to-br from-[hsl(var(--color-ocean-light))] to-[hsl(var(--color-ocean))]">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/">
                <a 
                  className="text-white hover:text-[hsl(var(--color-sand))] transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  <Umbrella className="h-5 w-5" /> Home
                </a>
              </Link>
              <Link href="#rankings">
                <a 
                  className="text-white hover:text-[hsl(var(--color-sand))] transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  <Anchor className="h-5 w-5" /> Rankings
                </a>
              </Link>
              <Link href="#about">
                <a 
                  className="text-white hover:text-[hsl(var(--color-sand))] transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsNavOpen(false)}
                >
                  <Shell className="h-5 w-5" /> About
                </a>
              </Link>
              <Button className="bg-[hsl(var(--color-sand))] text-[hsl(var(--color-ocean-dark))] hover:bg-white w-full mt-4">
                <Fish className="h-4 w-4 mr-1" /> Sign In
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
