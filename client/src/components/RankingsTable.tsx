import { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Beach } from "@shared/schema";
import { Trophy, ArrowUp, ArrowDown, Minus, ListFilter, MapPin, Info } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-50 text-green-700 border border-green-100">
          <ArrowUp className="h-3 w-3 mr-1" /> {change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-[hsl(var(--color-accent))/10] text-[hsl(var(--color-accent))] border border-[hsl(var(--color-accent))/20]">
          <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(change)}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-50 text-gray-500 border border-gray-100">
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
    <Card id="rankings" className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <CardHeader className="bg-[hsl(var(--color-primary))] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            <CardTitle className="text-xl font-display font-bold">Top Beaches</CardTitle>
          </div>
          <div className="flex items-center">
            <button className="text-xs text-white bg-white/20 rounded-md px-2 py-1 flex items-center space-x-1">
              <ListFilter className="h-3 w-3 mr-1" />
              <span>All Provinces</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <div ref={tableRef} className="overflow-hidden">
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader className="bg-[hsl(var(--color-secondary))]/10 sticky top-0">
              <TableRow>
                <TableHead className="w-16 text-[hsl(var(--color-text))]">Rank</TableHead>
                <TableHead className="text-[hsl(var(--color-text))]">Beach</TableHead>
                <TableHead className="w-20 text-right text-[hsl(var(--color-text))]">Score</TableHead>
                <TableHead className="w-20 text-center text-[hsl(var(--color-text))]">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-[hsl(var(--color-secondary))]/5">
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-16 w-16 rounded-md" />
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
                      className={`hover:bg-[hsl(var(--color-secondary))]/5 ${
                        isTopThree ? 'bg-[hsl(var(--color-primary))]/5' : ''
                      }`}
                    >
                      <TableCell className="font-medium">
                        {isTopThree ? (
                          <div className="flex items-center justify-center h-6 w-6 rounded-md bg-[hsl(var(--color-primary))] text-white">
                            {currentRank}
                          </div>
                        ) : (
                          currentRank
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 border-[#20B2AA]/20">
                              <img 
                                className="h-16 w-16 object-cover" 
                                src={beach.imageUrl} 
                                alt={beach.name}
                              />
                            </div>
                            <div className="ml-4">
                              <Link href={`/beach/${beach.id}`}>
                                <div className="text-sm font-medium text-[hsl(var(--color-text))] hover:text-[hsl(var(--color-primary))] transition-colors duration-200">{beach.name}</div>
                              </Link>
                              <div className="text-xs text-gray-500 flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-[hsl(var(--color-primary))]" />
                                {beach.province}
                              </div>
                            </div>
                          </div>

                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-[hsl(var(--color-text))]">
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
      <CardContent className="p-4 border-t border-gray-100 bg-[hsl(var(--color-secondary))]/5 flex justify-between">
        <Link href="/beaches" className="text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary))]/80 font-medium inline-flex items-center">
          View all beaches <ArrowUp className="h-4 w-4 ml-1 transform rotate-45" />
        </Link>
        <Link href="/rankings" className="text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary))]/80 font-medium inline-flex items-center">
          Full rankings <Trophy className="h-4 w-4 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
