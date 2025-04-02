import { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Beach } from "@shared/schema";
import { Trophy, ArrowUp, ArrowDown, Minus, ListFilter, MapPin } from "lucide-react";

interface RankingsTableProps {
  beaches: Beach[];
  isLoading: boolean;
}

export default function RankingsTable({ beaches, isLoading }: RankingsTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  // Helper function to get change indicator
  const getRankChange = (currentRank: number, previousRank: number | null) => {
    if (!previousRank) return 0;
    return previousRank - currentRank;
  };

  // Helper function to render rank change indicator
  const renderRankChange = (change: number) => {
    if (change > 0) {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[hsl(var(--color-seafoam))] text-[hsl(var(--color-ocean-dark))]">
          <ArrowUp className="h-3 w-3 mr-1" /> {change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[hsl(var(--color-coral))/20] text-[hsl(var(--color-coral))]">
          <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(change)}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-500">
          <Minus className="h-3 w-3 mr-1" /> 0
        </span>
      );
    }
  };

  // Scroll to table when loaded
  useEffect(() => {
    if (!isLoading && beaches.length > 0 && tableRef.current) {
      // Implement if needed
    }
  }, [isLoading, beaches]);

  return (
    <Card id="rankings" className="bg-white rounded-xl shadow-md overflow-hidden border border-[hsl(var(--color-ocean-light))]">
      <CardHeader className="bg-gradient-to-r from-[hsl(var(--color-ocean))] to-[hsl(var(--color-ocean-dark))] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            <CardTitle className="text-xl font-display font-bold">Beach Rankings</CardTitle>
          </div>
          <div className="flex items-center">
            <button className="text-xs text-white bg-white/20 rounded-full px-2 py-1 flex items-center space-x-1">
              <ListFilter className="h-3 w-3" />
              <span>All Provinces</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <div ref={tableRef} className="overflow-hidden">
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader className="bg-[hsl(var(--color-ocean-light))/10] sticky top-0">
              <TableRow>
                <TableHead className="w-16 text-[hsl(var(--color-ocean-dark))]">Rank</TableHead>
                <TableHead className="text-[hsl(var(--color-ocean-dark))]">Beach</TableHead>
                <TableHead className="w-20 text-right text-[hsl(var(--color-ocean-dark))]">Score</TableHead>
                <TableHead className="w-20 text-center text-[hsl(var(--color-ocean-dark))]">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-[hsl(var(--color-sand))]/10">
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto" /></TableCell>
                  </TableRow>
                ))
              ) : beaches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No beaches ranked yet. Start voting to see rankings!
                  </TableCell>
                </TableRow>
              ) : (
                // Actual data
                beaches.map((beach, index) => {
                  const currentRank = index + 1;
                  const rankChange = getRankChange(currentRank, beach.previousRank);
                  const isTopThree = currentRank <= 3;
                  
                  return (
                    <TableRow 
                      key={beach.id} 
                      className={`hover:bg-[hsl(var(--color-sand))]/10 ${
                        isTopThree ? 'bg-[hsl(var(--color-ocean-light))]/5' : ''
                      }`}
                    >
                      <TableCell className="font-medium">
                        {isTopThree ? (
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[hsl(var(--color-ocean))] text-white">
                            {currentRank}
                          </div>
                        ) : (
                          currentRank
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-[hsl(var(--color-ocean-light))]">
                            <img 
                              className="h-10 w-10 object-cover" 
                              src={beach.imageUrl} 
                              alt={beach.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[hsl(var(--color-ocean-dark))]">{beach.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-[hsl(var(--color-ocean))]" />
                              {beach.province}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-[hsl(var(--color-ocean-dark))]">
                        {beach.rating}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderRankChange(rankChange)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <CardContent className="p-4 border-t border-gray-100 bg-gradient-to-br from-white to-[hsl(var(--color-sand))]/20 text-right">
        <a href="#" className="text-[hsl(var(--color-ocean))] hover:text-[hsl(var(--color-ocean-dark))] font-medium inline-flex items-center">
          View all rankings <ArrowUp className="h-4 w-4 ml-1 transform rotate-45" />
        </a>
      </CardContent>
    </Card>
  );
}
