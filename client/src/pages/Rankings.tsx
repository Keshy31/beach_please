import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Trophy, Filter, ArrowUp, ArrowDown, Info, 
  AlertTriangle, BarChart3, PieChart, Anchor
} from "lucide-react";
import { Beach } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import RankingsTable from "@/components/RankingsTable";

export default function Rankings() {
  // State for filters and view options
  const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"rank" | "rating" | "name" | "change">("rank");
  const [view, setView] = useState<"all" | "gainers" | "losers">("all");

  // Fetch rankings data
  const { 
    data: rankings = [], 
    isLoading,
    isError,
  } = useQuery<Beach[]>({ 
    queryKey: ["/api/rankings"],
    staleTime: 30000, // 30 seconds
  });

  // Apply filters and sorting
  const filteredRankings = rankings
    .filter(beach => !provinceFilter || beach.province === provinceFilter)
    .filter(beach => {
      if (view === "all") return true;
      if (!beach.previousRating) return false;
      
      const hasGained = beach.rating > beach.previousRating;
      return view === "gainers" ? hasGained : !hasGained;
    })
    .sort((a, b) => {
      if (sortOption === "rank") {
        // Already sorted by rank
        return 0;
      } else if (sortOption === "rating") {
        return b.rating - a.rating;
      } else if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "change") {
        const changeA = a.previousRating ? a.rating - a.previousRating : 0;
        const changeB = b.previousRating ? b.rating - b.previousRating : 0;
        return changeB - changeA; // Sort by biggest change first
      }
      return 0;
    });

  // Calculate stats
  const totalBeaches = rankings.length;
  const provinceCounts = rankings.reduce((acc, beach) => {
    acc[beach.province] = (acc[beach.province] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get top gainers and losers
  const withChanges = rankings.filter(beach => beach.previousRating !== null && beach.previousRating !== undefined);
  const topGainers = [...withChanges]
    .sort((a, b) => (b.rating - (b.previousRating || b.rating)) - (a.rating - (a.previousRating || a.rating)))
    .slice(0, 3);
  
  const topLosers = [...withChanges]
    .sort((a, b) => (a.rating - (a.previousRating || a.rating)) - (b.rating - (b.previousRating || b.rating)))
    .slice(0, 3);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Rankings</h1>
        <p className="text-gray-600 mb-6 text-center">
          We're having trouble loading the beach rankings. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--color-text))]">
          Beach Rankings
        </h1>
        <p className="text-[hsl(var(--color-text))/60]">
          Discover South Africa's top-rated beaches, voted by users like you.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-[hsl(var(--color-primary))]" />
              Total Beaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalBeaches}</p>
            <p className="text-sm text-muted-foreground">Ranked by ELO rating system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-[hsl(var(--color-primary))]" />
              Top Province
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(provinceCounts).length > 0 ? (
              <>
                <p className="text-2xl font-bold">
                  {Object.entries(provinceCounts).sort((a, b) => b[1] - a[1])[0][0]}
                </p>
                <p className="text-sm text-muted-foreground">
                  With {Object.entries(provinceCounts).sort((a, b) => b[1] - a[1])[0][1]} beaches
                </p>
              </>
            ) : (
              <p className="text-gray-500">Loading province data...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-[hsl(var(--color-primary))]" />
              Rating Range
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rankings.length > 0 ? (
              <>
                <p className="text-2xl font-bold">
                  {Math.max(...rankings.map(b => b.rating)) - Math.min(...rankings.map(b => b.rating))}
                </p>
                <p className="text-sm text-muted-foreground">
                  Between highest and lowest rated
                </p>
              </>
            ) : (
              <p className="text-gray-500">Calculating ratings...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter Rankings
          </CardTitle>
          <CardDescription>
            Customize your view of the beach rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium block mb-2">Province</label>
              <Select 
                value={provinceFilter || "all"} 
                onValueChange={(value) => setProvinceFilter(value === "all" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  <SelectItem value="Western Cape">Western Cape</SelectItem>
                  <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                  <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium block mb-2">Sort By</label>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank">Rank (Default)</SelectItem>
                  <SelectItem value="rating">Rating Score</SelectItem>
                  <SelectItem value="name">Beach Name</SelectItem>
                  <SelectItem value="change">Biggest Changes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-1/3">
              <label className="text-sm font-medium block mb-2">View</label>
              <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="gainers">Gainers</TabsTrigger>
                  <TabsTrigger value="losers">Losers</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Rankings Table */}
      <RankingsTable beaches={filteredRankings} isLoading={isLoading} />

      {/* Top Movers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Top Gainers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ArrowUp className="h-4 w-4 mr-2 text-green-500" />
              Top Gainers
            </CardTitle>
            <CardDescription>
              Beaches with the biggest rating increases
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {topGainers.length > 0 ? (
              <ul className="space-y-4">
                {topGainers.map((beach) => (
                  <li key={beach.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={beach.imageUrl} 
                          alt={beach.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/beach/${beach.id}`}>
                          <span className="font-medium hover:text-[hsl(var(--color-primary))] transition-colors duration-200">
                            {beach.name}
                          </span>
                        </Link>
                        <p className="text-sm text-gray-500">{beach.province}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-50 text-green-700 border border-green-100">
                        <ArrowUp className="h-3 w-3 mr-1" /> 
                        {beach.previousRating ? (beach.rating - beach.previousRating).toFixed(0) : "N/A"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">No rating changes recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ArrowDown className="h-4 w-4 mr-2 text-red-500" />
              Top Losers
            </CardTitle>
            <CardDescription>
              Beaches with the biggest rating decreases
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {topLosers.length > 0 ? (
              <ul className="space-y-4">
                {topLosers.map((beach) => (
                  <li key={beach.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={beach.imageUrl} 
                          alt={beach.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/beach/${beach.id}`}>
                          <span className="font-medium hover:text-[hsl(var(--color-primary))] transition-colors duration-200">
                            {beach.name}
                          </span>
                        </Link>
                        <p className="text-sm text-gray-500">{beach.province}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-50 text-red-700 border border-red-100">
                        <ArrowDown className="h-3 w-3 mr-1" /> 
                        {beach.previousRating ? Math.abs(beach.rating - beach.previousRating).toFixed(0) : "N/A"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">No rating changes recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-r from-[hsl(var(--color-primary))]/5 to-transparent border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <Info className="h-8 w-8 text-[hsl(var(--color-primary))]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How the Beach Rankings Work</h3>
              <p className="text-[hsl(var(--color-text))/80]">
                Our beach ranking system uses the ELO rating method, originally developed for chess rankings. 
                Each beach starts with a rating of 1500. When users vote in a beach comparison, 
                the winner's rating increases while the loser's decreases.
              </p>
              <p className="text-[hsl(var(--color-text))/80] mt-2">
                The amount of rating change depends on the current ratings of both beaches. 
                If a low-rated beach defeats a high-rated beach, it gains more points. 
                This creates a fair and dynamic ranking system that evolves with each vote.
              </p>
              <div className="mt-4">
                <Link href="/">
                  <Button variant="outline" className="mr-2">
                    Go Vote Now
                  </Button>
                </Link>
                <Link href="/beaches">
                  <Button variant="ghost">
                    View All Beaches
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}