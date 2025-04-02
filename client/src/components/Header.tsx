import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Umbrella, Shell, Anchor, Menu } from "lucide-react";
import BeachPleaseLogo from "../assets/temp/beach-please-logo-trimmed.png";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="bg-[#f5efdc] shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src={BeachPleaseLogo} alt="Beach Please" className="h-16" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-[#20B2AA] hover:text-[#FF7F50] transition-colors flex items-center gap-1 font-medium">
            <Umbrella className="h-4 w-4" /> Explore
          </Link>
          <Link href="#rankings" className="text-[#20B2AA] hover:text-[#FF7F50] transition-colors flex items-center gap-1 font-medium">
            <Anchor className="h-4 w-4" /> Rankings
          </Link>
          <Link href="#about" className="text-[#20B2AA] hover:text-[#FF7F50] transition-colors flex items-center gap-1 font-medium">
            <Shell className="h-4 w-4" /> About
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden text-[#20B2AA]" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-[#f5efdc]">
            <div className="flex justify-start pt-6 pl-2">
              <img src={BeachPleaseLogo} alt="Beach Please" className="h-14" />
            </div>
            <nav className="flex flex-col space-y-4 mt-8">
              <Link 
                href="/" 
                className="text-[#20B2AA] hover:text-[#FF7F50] transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsNavOpen(false)}
              >
                <Umbrella className="h-5 w-5" /> Explore
              </Link>
              <Link 
                href="#rankings" 
                className="text-[#20B2AA] hover:text-[#FF7F50] transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsNavOpen(false)}
              >
                <Anchor className="h-5 w-5" /> Rankings
              </Link>
              <Link 
                href="#about" 
                className="text-[#20B2AA] hover:text-[#FF7F50] transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsNavOpen(false)}
              >
                <Shell className="h-5 w-5" /> About
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
