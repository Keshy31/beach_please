import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Beach } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, Filter, Search, SortAsc, SortDesc, Anchor, Trophy, 
  Palmtree, Award, Waves, Fish, LifeBuoy, Home, CheckCircle2 
} from "lucide-react";
import { Link } from "wouter";

// Enhanced Beach Card component for the all beaches page
const BeachGridCard = ({ beach }: { beach: Beach }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine province icon
  const ProvinceIcon = () => {
    switch(beach.province) {
      case 'Western Cape':
        return <Anchor className="h-3.5 w-3.5 mr-1" />;
      case 'Eastern Cape':
        return <Trophy className="h-3.5 w-3.5 mr-1" />;
      default: // KwaZulu-Natal
        return <Palmtree className="h-3.5 w-3.5 mr-1" />;
    }
  };

  // Helper function to render feature icons
  const renderFeatureIcon = (feature: number | null | undefined, Icon: React.ElementType, label: string) => {
    const featureValue = feature || 0;
    return (
      <div className={`flex items-center ${featureValue === 1 ? "text-green-500" : featureValue === 2 ? "text-red-500" : "text-gray-300"}`} title={`${featureValue === 1 ? "Yes" : featureValue === 2 ? "No" : "Unknown"}: ${label}`}>
        <Icon className="h-4 w-4" />
      </div>
    );
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 h-full ${
        isHovered ? "transform -translate-y-1 shadow-xl border-[hsl(var(--color-primary))]" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Beach Image with Gradient Overlay */}
      <div className="relative h-44 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9]">
        <img 
          src={beach.imageUrl} 
          alt={beach.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50"></div>

        {/* Province Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[hsl(var(--color-text))] px-2 py-1 rounded-md text-sm font-semibold flex items-center">
          <ProvinceIcon /> 
          {beach.province}
        </span>

        {/* Rank Badge */}
        <Badge variant="default" className="absolute top-3 right-3 bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary))]">
          <Trophy className="h-3.5 w-3.5 mr-1" /> Rank #{beach.previousRank || "N/A"}
        </Badge>

        {/* Blue Flag Badge (if applicable) */}
        {beach.isBlueFlag === 1 && (
          <Badge variant="secondary" className="absolute bottom-3 right-3 bg-blue-500 text-white border-none">
            <Award className="h-3.5 w-3.5 mr-1" /> Blue Flag Beach
          </Badge>
        )}
      </div>

      {/* Beach Information */}
      <CardContent className="p-4 bg-gradient-to-br from-white to-[hsl(var(--color-secondary))]/5 flex flex-col h-[calc(100%-11rem)]">
        <div className="mb-2">
          <Link href={`/beach/${beach.id}`} className="inline-block">
            <h3 className="font-display font-bold text-lg text-[hsl(var(--color-text))] hover:text-[hsl(var(--color-primary))] transition-colors duration-200">{beach.name}</h3>
          </Link>
        </div>

        <p className="text-sm mb-3 flex-grow line-clamp-2 text-[hsl(var(--color-text))/80]">{beach.description}</p>

        {/* Features */}
        <div className="flex justify-between mt-auto mb-2">
          {renderFeatureIcon(beach.isSwimming, Waves, "Swimming")}
          {renderFeatureIcon(beach.isSurfing, Waves, "Surfing")}
          {renderFeatureIcon(beach.isFishing, Fish, "Fishing")}
          {renderFeatureIcon(beach.hasLifeguards, LifeBuoy, "Lifeguards")}
          {renderFeatureIcon(beach.hasFacilities, Home, "Facilities")}
        </div>

        {/* Rating */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-sm font-semibold">Rating</span>
          <span className="text-[hsl(var(--color-primary))] font-mono font-medium">{beach.rating}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Beaches() {
  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
  const [featureFilter, setFeatureFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("rank"); // rank, name, rating
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch all beaches
  const { data: beaches = [], isLoading, isError } = useQuery<Beach[]>({
    queryKey: ['/api/beaches'],
    staleTime: 60000, // 1 minute
  });

  // Apply filters and sorting
  const filteredAndSortedBeaches = beaches
    // Apply search filter
    .filter((beach: Beach) => 
      searchTerm === "" || 
      beach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beach.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beach.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Apply province filter
    .filter((beach: Beach) => 
      !provinceFilter ||
      beach.province === provinceFilter
    )
    // Apply feature filter
    .filter((beach: Beach) => {
      if (!featureFilter) return true;
      
      switch (featureFilter) {
        case "swimming":
          return beach.isSwimming === 1;
        case "surfing":
          return beach.isSurfing === 1;
        case "fishing":
          return beach.isFishing === 1;
        case "blueflag":
          return beach.isBlueFlag === 1;
        case "lifeguards":
          return beach.hasLifeguards === 1;
        case "facilities":
          return beach.hasFacilities === 1;
        default:
          return true;
      }
    })
    // Apply sorting
    .sort((a: Beach, b: Beach) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        comparison = a.rating - b.rating;
      } else if (sortBy === "rank") {
        // Default to rating if rank is not available
        const rankA = a.previousRank || Number.MAX_SAFE_INTEGER;
        const rankB = b.previousRank || Number.MAX_SAFE_INTEGER;
        comparison = rankA - rankB;
      } else if (sortBy === "province") {
        comparison = a.province.localeCompare(b.province);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setProvinceFilter(null);
    setFeatureFilter(null);
    setSortBy("rank");
    setSortDirection("asc");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--color-text))]">Explore South African Beaches</h1>
          <p className="text-[hsl(var(--color-text))/60] mt-1">
            Discover and compare {beaches.length} stunning coastal destinations
          </p>
        </div>
        
        <Link href="/">
          <Button variant="outline" className="flex gap-2 items-center">
            <Heart className="h-4 w-4" />
            Back to Voting
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search beaches by name, province, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Province Filter */}
          <div className="w-full md:w-[200px]">
            <Select 
              value={provinceFilter || "all"} 
              onValueChange={(value) => setProvinceFilter(value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                <SelectItem value="Western Cape">Western Cape</SelectItem>
                <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feature Filter */}
          <div className="w-full md:w-[200px]">
            <Select 
              value={featureFilter || "all"} 
              onValueChange={(value) => setFeatureFilter(value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Features" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Features</SelectItem>
                <SelectItem value="swimming">Swimming</SelectItem>
                <SelectItem value="surfing">Surfing</SelectItem>
                <SelectItem value="fishing">Fishing</SelectItem>
                <SelectItem value="blueflag">Blue Flag</SelectItem>
                <SelectItem value="lifeguards">Lifeguards</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="w-full md:w-[200px]">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Sort by Rank</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
                <SelectItem value="province">Sort by Province</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Sort Direction */}
          <Button variant="outline" onClick={toggleSortDirection} className="w-full md:w-auto">
            {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>

          {/* Reset Filters */}
          <Button variant="ghost" onClick={resetFilters} className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardContent>
      </Card>

      {/* Results Stats */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[hsl(var(--color-text))/60]">
          Showing {filteredAndSortedBeaches.length} of {beaches.length} beaches
        </p>
        
        {/* Legend */}
        <div className="flex gap-3 text-xs items-center">
          <div className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" /> Yes
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-red-500 mr-1" /> No
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="h-3 w-3 text-gray-300 mr-1" /> Unknown
          </div>
        </div>
      </div>

      {/* Beaches Grid */}
      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-44 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-between">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-500">Failed to load beaches. Please try again later.</p>
        </div>
      ) : filteredAndSortedBeaches.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <p className="text-gray-500 mb-4">No beaches found matching your filters.</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedBeaches.map((beach: Beach) => (
            <BeachGridCard key={beach.id} beach={beach} />
          ))}
        </div>
      )}
    </div>
  );
}