import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Umbrella, 
  Info, 
  Fish, 
  Landmark, 
  Shield, 
  Sun, 
  Droplets, 
  MapPin,
  Waves,
  HeartHandshake
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="space-y-10 pb-8">
      {/* Main About Section */}
      <section className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">About Beach Please</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Info className="h-6 w-6 text-[hsl(var(--color-primary))]" />
              Our Mission
            </h2>
            <p className="text-[hsl(var(--color-text))/80] leading-relaxed">
              Beach Please was created to celebrate and showcase the incredible diversity of South African beaches. 
              Our mission is to help locals and travelers discover the beauty of South Africa's coastline 
              through an interactive and community-driven platform.
            </p>
            <p className="text-[hsl(var(--color-text))/80] leading-relaxed">
              We believe that by highlighting these natural treasures, we can promote sustainable tourism
              and foster appreciation for South Africa's coastal ecosystems and communities.
            </p>
          </div>

          <Card className="bg-gradient-to-r from-[hsl(var(--color-primary))]/5 to-transparent border-none shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                Why We Built This
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <Badge variant="outline" className="mt-1">01</Badge>
                  <p>To showcase South Africa's world-class beaches to a global audience</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline" className="mt-1">02</Badge>
                  <p>To create a fair ranking system based on community preferences</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline" className="mt-1">03</Badge>
                  <p>To help travelers discover beaches beyond the usual tourist spots</p>
                </li>
                <li className="flex gap-2">
                  <Badge variant="outline" className="mt-1">04</Badge>
                  <p>To celebrate the diverse coastal environments across South Africa</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Waves className="h-6 w-6 text-[hsl(var(--color-primary))]" />
          How Our Ranking System Works
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">The ELO Rating System</h3>
                <p className="text-[hsl(var(--color-text))/80]">
                  Our beach ranking system uses the ELO rating method, originally developed for chess rankings. 
                  Each beach starts with a rating of 1500. When users vote in a beach comparison, 
                  the winner's rating increases while the loser's decreases.
                </p>
                <p className="text-[hsl(var(--color-text))/80]">
                  The amount of rating change depends on the current ratings of both beaches. 
                  If a low-rated beach defeats a high-rated beach, it gains more points. 
                  This creates a fair and dynamic ranking system that evolves with each vote.
                </p>
                <div className="mt-6">
                  <Link href="/">
                    <Badge className="text-sm cursor-pointer" variant="outline">
                      Go Vote Now &rarr;
                    </Badge>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Why ELO Works for Beaches</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <div>
                      <h4 className="font-medium">Fair Comparisons</h4>
                      <p className="text-sm text-[hsl(var(--color-text))/70]">
                        The system balances ratings by accounting for the expected outcome based on current ratings.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Waves className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <div>
                      <h4 className="font-medium">Dynamic Updates</h4>
                      <p className="text-sm text-[hsl(var(--color-text))/70]">
                        Rankings evolve over time as more users vote, reflecting changing preferences.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <div>
                      <h4 className="font-medium">Crowd Wisdom</h4>
                      <p className="text-sm text-[hsl(var(--color-text))/70]">
                        Collective voting creates more accurate rankings than individual ratings alone.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* South African Coastline Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-[hsl(var(--color-primary))]" />
          Explore South Africa's Coastline
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-[hsl(var(--color-primary))]/10 flex items-center justify-center">
                  <Droplets className="h-7 w-7 text-[hsl(var(--color-primary))]" />
                </div>
                <h3 className="text-xl font-semibold">KwaZulu-Natal</h3>
                <p className="text-[hsl(var(--color-text))/80]">
                  Warm waters, golden sands, and tropical climate perfect for swimming year-round. 
                  Home to vibrant marine life and coastal forests.
                </p>
                <div className="pt-2">
                  <Badge>Warm Waters</Badge>
                  <Badge className="ml-2">Tropical</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-[hsl(var(--color-primary))]/10 flex items-center justify-center">
                  <Landmark className="h-7 w-7 text-[hsl(var(--color-primary))]" />
                </div>
                <h3 className="text-xl font-semibold">Western Cape</h3>
                <p className="text-[hsl(var(--color-text))/80]">
                  Dramatic mountain backdrops, crystal clear waters, and pristine white sand beaches. 
                  Famous for penguin colonies and whale watching.
                </p>
                <div className="pt-2">
                  <Badge>Scenic</Badge>
                  <Badge className="ml-2">Wildlife</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-[hsl(var(--color-primary))]/10 flex items-center justify-center">
                  <Fish className="h-7 w-7 text-[hsl(var(--color-primary))]" />
                </div>
                <h3 className="text-xl font-semibold">Eastern Cape</h3>
                <p className="text-[hsl(var(--color-text))/80]">
                  Wild coastlines, untouched beaches, and magnificent surfing spots. 
                  Known for rugged landscapes and diverse marine ecosystems.
                </p>
                <div className="pt-2">
                  <Badge>Surfing</Badge>
                  <Badge className="ml-2">Untamed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blue Flag Beaches Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Umbrella className="h-6 w-6 text-[hsl(var(--color-primary))]" />
          South Africa's Blue Flag Beaches
        </h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What is a Blue Flag Beach?</h3>
                <p className="text-[hsl(var(--color-text))/80] mb-4">
                  Blue Flag is an international award given to beaches, marinas, and sustainable boating tourism operators.
                  To qualify for Blue Flag status, a series of stringent environmental, educational, safety, and accessibility criteria must be met and maintained.
                </p>
                <p className="text-[hsl(var(--color-text))/80]">
                  South Africa boasts over 40 Blue Flag beaches, highlighting the country's commitment to maintaining 
                  high standards of beach quality and environmental management.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Blue Flag Criteria</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Droplets className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <p>Excellent water quality</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <p>Safety services and equipment</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <p>Environmental information and education</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <Umbrella className="h-5 w-5 text-[hsl(var(--color-primary))] mt-1" />
                    <p>Environmental management and facilities</p>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}