import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import BeachCard from "@/components/BeachCard";
import RankingsTable from "@/components/RankingsTable";
import ActivityFeed from "@/components/ActivityFeed";
import InfoSection from "@/components/InfoSection";
import { Beach, Vote } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  const [isLoadingNewPair, setIsLoadingNewPair] = useState(false);

  // Fetch a random pair of beaches for voting
  const { 
    data: beachPair, 
    isLoading: isPairLoading,
    isError: isPairError,
    refetch: refetchPair
  } = useQuery<[Beach, Beach]>({ 
    queryKey: ["/api/beaches/pair"],
    refetchOnWindowFocus: false,
  });

  // Fetch rankings
  const { 
    data: rankings,
    isLoading: isRankingsLoading,
  } = useQuery<Beach[]>({ 
    queryKey: ["/api/rankings"],
    refetchInterval: 30000, // Refresh rankings every 30 seconds
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ winnerId, loserId }: { winnerId: number; loserId: number }) => {
      return apiRequest("POST", "/api/votes", {
        winnerBeachId: winnerId,
        loserBeachId: loserId,
        voterName: "Anonymous" // In a real app, this would be the user's name
      });
    },
    onSuccess: async () => {
      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["/api/rankings"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/votes/recent"] });
      
      // Load a new beach pair
      setIsLoadingNewPair(true);
      await refetchPair();
      setIsLoadingNewPair(false);
      
      toast({
        title: "Vote recorded!",
        description: "Thanks for your input. Here's a new matchup.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error recording vote",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle vote
  const handleVote = (winnerId: number, loserId: number) => {
    voteMutation.mutate({ winnerId, loserId });
  };

  // Handle skip
  const handleSkip = async () => {
    setIsLoadingNewPair(true);
    await refetchPair();
    setIsLoadingNewPair(false);
    
    toast({
      title: "Skipped",
      description: "Here's a new matchup for you to vote on.",
    });
  };

  // Show error if beach pair cannot be loaded
  useEffect(() => {
    if (isPairError) {
      toast({
        title: "Error loading beaches",
        description: "Could not load beaches for voting. Please try again.",
        variant: "destructive",
      });
    }
  }, [isPairError, toast]);

  return (
    <>
      {/* Voting Section */}
      <section className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-darkest mb-2">
          Which beach would you rather visit?
        </h2>
        <p className="text-neutral-dark mb-6 max-w-2xl mx-auto">
          Help us rank the most beautiful beaches in South Africa by voting in head-to-head matchups!
        </p>
        
        {/* Beach Cards for Voting */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-12 min-h-[400px]">
          {isPairLoading || isLoadingNewPair || voteMutation.isPending ? (
            <motion.div 
              className="text-center py-12 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-ocean border-t-transparent"></div>
              <p className="mt-4 text-ocean-dark">Loading beach matchup...</p>
            </motion.div>
          ) : beachPair ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${beachPair[0].id}-${beachPair[1].id}`}
                className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* First Beach */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <BeachCard
                    beach={beachPair[0]}
                    onVote={() => handleVote(beachPair[0].id, beachPair[1].id)}
                    isVoting={voteMutation.isPending}
                  />
                </motion.div>
                
                {/* VS Badge */}
                <motion.div 
                  className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xl font-bold shadow-xl border-2 border-white z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  VS
                </motion.div>
                
                {/* Second Beach */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <BeachCard
                    beach={beachPair[1]}
                    onVote={() => handleVote(beachPair[1].id, beachPair[0].id)}
                    isVoting={voteMutation.isPending}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-500 mb-4">Could not load beaches for voting</p>
              <Button
                variant="outline"
                onClick={() => refetchPair()}
                className="mx-auto"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </div>

        {/* Skip Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            className="text-ocean hover:text-ocean-dark font-medium mx-auto"
            onClick={handleSkip}
            disabled={isPairLoading || isLoadingNewPair || voteMutation.isPending}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Skip this matchup
          </Button>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rankings Table */}
        <div className="lg:col-span-2">
          <RankingsTable beaches={rankings || []} isLoading={isRankingsLoading} />
        </div>
        
        {/* Activity Feed */}
        <ActivityFeed />
      </div>

      {/* Info Section */}
      <InfoSection />
    </>
  );
}
