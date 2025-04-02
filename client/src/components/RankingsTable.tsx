import { useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Beach } from "@shared/schema";

interface RankingsTableProps {
  beaches: Beach[];
  isLoading: boolean;
}

export default function RankingsTable({ beaches, isLoading }: RankingsTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  // Helper function to get change indicator
  const getRankChange = (currentRank: number, previousRank: number) => {
    if (!previousRank) return 0;
    return previousRank - currentRank;
  };

  // Helper function to render rank change indicator
  const renderRankChange = (change: number) => {
    if (change > 0) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <i className="fas fa-arrow-up mr-1"></i> {change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <i className="fas fa-arrow-down mr-1"></i> {Math.abs(change)}
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          <i className="fas fa-minus mr-1"></i> 0
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
    <Card id="rankings" className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardHeader className="bg-ocean text-white p-4">
        <CardTitle className="text-xl font-display font-bold">Current Rankings</CardTitle>
      </CardHeader>
      <div ref={tableRef} className="overflow-hidden">
        <ScrollArea className="h-[450px]">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Beach</TableHead>
                <TableHead className="w-20 text-right">Score</TableHead>
                <TableHead className="w-20 text-center">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
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
                  <TableCell colSpan={4} className="text-center py-8 text-neutral-dark">
                    No beaches ranked yet. Start voting to see rankings!
                  </TableCell>
                </TableRow>
              ) : (
                // Actual data
                beaches.map((beach, index) => {
                  const currentRank = index + 1;
                  const rankChange = getRankChange(currentRank, beach.previousRank);
                  
                  return (
                    <TableRow key={beach.id}>
                      <TableCell className="font-medium">{currentRank}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                            <img 
                              className="h-10 w-10 object-cover" 
                              src={beach.imageUrl} 
                              alt={beach.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{beach.name}</div>
                            <div className="text-sm text-gray-500">{beach.province}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{beach.rating}</TableCell>
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
      <CardContent className="p-4 border-t border-gray-200 text-right">
        <a href="#" className="text-ocean hover:text-ocean-dark font-medium">View all rankings →</a>
      </CardContent>
    </Card>
  );
}
