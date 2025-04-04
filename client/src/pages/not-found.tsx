import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Compass, MapPin, Waves, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-200 p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 relative overflow-hidden">
        {/* Beach-themed decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full opacity-40 -z-10" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-tr-full opacity-40 -z-10" aria-hidden="true"></div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <Waves className="h-16 w-16 text-blue-500" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-xl font-bold text-white">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
          Looks like you're lost at sea!
        </h1>
        
        <p className="text-gray-600 text-center mb-6">
          The beach you're looking for might have been washed away by the tide or never existed in the first place.
        </p>
        
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3 text-gray-700">
            <Compass className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span>Try navigating back to familiar shores</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span>Explore our beach rankings or listings</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50">
            <Link href="/beaches">
              <MapPin className="h-4 w-4" />
              Explore Beaches
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
