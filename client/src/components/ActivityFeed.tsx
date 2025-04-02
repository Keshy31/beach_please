import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, ArrowUp, ArrowDown, Waves } from "lucide-react";
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
  winnerImageUrl?: string;
  loserImageUrl?: string;
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
        <CardTitle className="text-xl font-display font-bold flex items-center">
          <Waves className="mr-2 h-5 w-5" /> Beach Comparisons
        </CardTitle>
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
                    <li key={vote.id} className="mb-6">
                      <div className="relative bg-gradient-to-r from-slate-50 to-white rounded-lg p-4 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="default" className="bg-[#20B2AA] hover:bg-[#20B2AA]">
                            Winner
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatRelativeTime(vote.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative w-16 h-16 overflow-hidden rounded-md border-2 border-[#20B2AA]">
                            {vote.winnerImageUrl ? (
                              <img 
                                src={vote.winnerImageUrl} 
                                alt={vote.winnerName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                <Waves className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{vote.winnerName}</h4>
                            <p className="text-sm text-slate-500">{vote.winnerProvince}</p>
                          </div>
                          {vote.winnerRatingChange && (
                            <div className="flex items-center text-emerald-600 font-semibold">
                              <ArrowUp className="h-4 w-4 mr-1" />
                              +{vote.winnerRatingChange}
                            </div>
                          )}
                        </div>
                        
                        <div className="relative flex items-center justify-center my-2">
                          <div className="absolute w-full border-t border-gray-200"></div>
                          <div className="relative bg-white px-3 text-sm text-gray-500">vs</div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="relative w-16 h-16 overflow-hidden rounded-md border-2 border-slate-300">
                            {vote.loserImageUrl ? (
                              <img 
                                src={vote.loserImageUrl} 
                                alt={vote.loserName}
                                className="w-full h-full object-cover opacity-90"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                                <Waves className="h-8 w-8 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-600">{vote.loserName}</h4>
                            <p className="text-sm text-slate-400">{vote.loserProvince}</p>
                          </div>
                          {vote.loserRatingChange && (
                            <div className="flex items-center text-red-500 font-semibold">
                              <ArrowDown className="h-4 w-4 mr-1" />
                              {vote.loserRatingChange}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  // Empty state
                  <li className="py-8 text-center text-gray-500">
                    <Waves className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p>No comparison data yet. Vote on some beaches to see results!</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t border-gray-200 text-right">
        <a href="#rankings" className="text-[#20B2AA] hover:text-[#188a84] font-medium">View full rankings →</a>
      </div>
    </Card>
  );
}
