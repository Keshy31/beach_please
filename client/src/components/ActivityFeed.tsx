import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Extended vote type with beach names
interface EnhancedVote {
  id: number;
  winnerBeachId: number;
  loserBeachId: number;
  createdAt: string;
  voterName: string;
  winnerName: string;
  winnerProvince: string;
  loserName: string;
  loserProvince: string;
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

  // Generate random voter names
  const getRandomVoterName = () => {
    const prefixes = ["Beach", "Sun", "Wave", "Sand", "Surf", "Ocean", "Coast"];
    const suffixes = ["Lover", "Seeker", "Explorer", "Fan", "Enthusiast", "Traveler"];
    
    const randomNames = [
      "BeachLover",
      "SunSeeker",
      "WaveCatcher",
      "CoastalExplorer",
      "SandyFeet",
      "OceanDreamer",
      "TideChaser",
      "SeaShell",
      "SaltLife",
      "BeachBum"
    ];
    
    return randomNames[Math.floor(Math.random() * randomNames.length)];
  };

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardHeader className="bg-ocean text-white p-4">
        <CardTitle className="text-xl font-display font-bold">Recent Activity</CardTitle>
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
                                <Skeleton className="h-4 w-20 inline-block" />
                                <span>voted for</span>
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
                              <i className="fas fa-umbrella-beach text-white"></i>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">{vote.voterName || getRandomVoterName()}</span>{" "}
                                voted for{" "}
                                <span className="font-medium text-gray-900">{vote.winnerName}</span>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
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
                    No voting activity yet. Be the first to vote!
                  </li>
                )}
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t border-gray-200 text-right">
        <a href="#" className="text-ocean hover:text-ocean-dark font-medium">View all activity →</a>
      </div>
    </Card>
  );
}
