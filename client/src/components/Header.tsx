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
    <header className="bg-[hsl(var(--color-primary))] shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Waves className="text-white h-7 w-7" />
          <h1 className="text-2xl font-display font-bold text-white">
            <span className="font-normal">Beach</span><span className="font-black">Please</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-[hsl(var(--color-secondary))] transition-colors flex items-center gap-1 font-medium">
            <Umbrella className="h-4 w-4" /> Explore
          </Link>
          <Link href="#rankings" className="text-white hover:text-[hsl(var(--color-secondary))] transition-colors flex items-center gap-1 font-medium">
            <Anchor className="h-4 w-4" /> Rankings
          </Link>
          <Link href="#about" className="text-white hover:text-[hsl(var(--color-secondary))] transition-colors flex items-center gap-1 font-medium">
            <Shell className="h-4 w-4" /> About
          </Link>
          <Button className="bg-[hsl(var(--color-accent))] text-white hover:bg-[#e05f32]">
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
          <SheetContent className="bg-[hsl(var(--color-primary))]">
            <div className="flex justify-start pt-6 pl-2">
              <h2 className="text-xl font-display font-bold text-white">
                <span className="font-normal">Beach</span><span className="font-black">Please</span>
              </h2>
            </div>
            <nav className="flex flex-col space-y-4 mt-8">
              <Link 
                href="/" 
                className="text-white hover:text-[hsl(var(--color-secondary))] transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsNavOpen(false)}
              >
                <Umbrella className="h-5 w-5" /> Explore
              </Link>
              <Link 
                href="#rankings" 
                className="text-white hover:text-[hsl(var(--color-secondary))] transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsNavOpen(false)}
              >
                <Anchor className="h-5 w-5" /> Rankings
              </Link>
              <Link 
                href="#about" 
                className="text-white hover:text-[hsl(var(--color-secondary))] transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsNavOpen(false)}
              >
                <Shell className="h-5 w-5" /> About
              </Link>
              <Button className="bg-[hsl(var(--color-accent))] text-white hover:bg-[#e05f32] w-full mt-4">
                <Fish className="h-4 w-4 mr-1" /> Sign In
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
