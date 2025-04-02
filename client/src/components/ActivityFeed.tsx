import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, ArrowUp, ArrowDown, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Extended vote type with beach names and rating changes
interface EnhancedVote {
  id: number;
  winnerBeachId: number;
  loserBeachId: number;
  createdAt: string;
  winnerName: string;
  winnerProvince: string;
  loserName: string;
  loserProvince: string;
  winnerRatingChange?: number;
  loserRatingChange?: number;
  winnerPreviousRating?: number;
  loserPreviousRating?: number;
}

export default function ActivityFeed() {
  // Fetch recent votes
  const { data: votes, isLoading } = useQuery<EnhancedVote[]>({
    queryKey: ["/api/votes/recent"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Format relative time (e.g., "2 minutes ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) {
      return "just now";
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardHeader className="bg-ocean text-white p-4">
        <CardTitle className="text-xl font-display font-bold">Beach Comparisons</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[450px]">
          <div className="p-4">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {isLoading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index < 4 && (
                          <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <Skeleton className="h-10 w-10 rounded-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm space-x-1">
                                <Skeleton className="h-4 w-24 inline-block" />
                                <span>vs</span>
                                <Skeleton className="h-4 w-24 inline-block" />
                              </div>
                              <Skeleton className="h-3 w-16 mt-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : votes && votes.length > 0 ? (
                  // Actual data
                  votes.map((vote, index) => (
                    <li key={vote.id}>
                      <div className="relative pb-8">
                        {index < votes.length - 1 && (
                          <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-ocean flex items-center justify-center ring-8 ring-white">
                              <Trophy className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col">
                              <div className="flex items-center mb-1">
                                <Badge variant="default" className="bg-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))] mr-2">
                                  Winner
                                </Badge>
                                <span className="font-medium text-gray-900">{vote.winnerName}</span>
                                <span className="text-gray-500 text-xs ml-2">({vote.winnerProvince})</span>
                                
                                {vote.winnerRatingChange && (
                                  <div className="ml-auto flex items-center">
                                    <span className="text-sm font-medium text-emerald-600 flex items-center">
                                      <ArrowUp className="h-4 w-4 mr-1" />
                                      {vote.winnerRatingChange > 0 ? '+' : ''}{vote.winnerRatingChange}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center">
                                <span className="text-xs font-medium text-gray-500 mr-2">vs</span>
                                <span className="font-medium text-gray-500">{vote.loserName}</span>
                                <span className="text-gray-400 text-xs ml-2">({vote.loserProvince})</span>
                                
                                {vote.loserRatingChange && (
                                  <div className="ml-auto flex items-center">
                                    <span className="text-sm font-medium text-red-500 flex items-center">
                                      <ArrowDown className="h-4 w-4 mr-1" />
                                      {vote.loserRatingChange}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="mt-1 text-xs text-gray-400">
                                {formatRelativeTime(vote.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  // Empty state
                  <li className="py-8 text-center text-gray-500">
                    No comparison data yet. Vote on some beaches to see results!
                  </li>
                )}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t border-gray-200 text-right">
        <a href="#rankings" className="text-ocean hover:text-ocean-dark font-medium">View full rankings →</a>
      </div>
    </Card>
  );
}
