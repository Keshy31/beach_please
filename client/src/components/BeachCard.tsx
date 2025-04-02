import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Beach } from "@shared/schema";

interface BeachCardProps {
  beach: Beach;
  onVote: () => void;
  isVoting: boolean;
}

export default function BeachCard({ beach, onVote, isVoting }: BeachCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    setHasVoted(true);
    onVote();
  };

  // Calculate current rank
  const rank = beach.previousRank;

  return (
    <Card 
      className={`beach-card bg-white rounded-xl shadow-lg overflow-hidden max-w-sm w-full transition-transform duration-300 ${
        isHovered ? "transform -translate-y-1 shadow-xl" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Beach Image */}
      <div className="relative h-48 bg-ocean-lighter">
        <img 
          src={beach.imageUrl} 
          alt={beach.name} 
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-ocean-dark px-2 py-1 rounded-md text-sm font-medium">
          <i className={`fas fa-${beach.province === 'Western Cape' ? 'mountain' : 'leaf'} ${
            beach.province === 'Western Cape' ? 'text-sand-dark' : 'text-green-600'
          } mr-1`}></i> 
          Trending
        </span>
        <span className="absolute top-3 right-3 bg-ocean/80 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-medium">
          Rank #{rank}
        </span>
      </div>

      {/* Beach Information */}
      <CardContent className="p-5">
        <h3 className="font-display font-bold text-xl text-neutral-darkest">{beach.name}</h3>
        <p className="text-sm text-neutral-dark mb-3">{beach.province}</p>
        <p className="text-sm mb-4 line-clamp-3">{beach.description}</p>
        
        {/* Vote Button */}
        <Button 
          className={`w-full py-6 transition-all duration-300 ${
            hasVoted ? "bg-green-600 hover:bg-green-700" : "bg-ocean hover:bg-ocean-dark"
          } ${isVoting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"}`}
          onClick={handleVote}
          disabled={isVoting || hasVoted}
        >
          {hasVoted ? (
            <>Thanks for voting! <i className="fas fa-heart text-sand ml-2"></i></>
          ) : (
            <>Vote for this beach <i className="fas fa-check ml-2"></i></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
