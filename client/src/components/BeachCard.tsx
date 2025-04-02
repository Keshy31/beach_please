import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Beach } from "@shared/schema";
import { Anchor, Trophy, Heart, MapPin, ThumbsUp, Palmtree, Info } from "lucide-react";
import { Link } from "wouter";

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

  return (
    <Card 
      className={`beach-card bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full transition-all duration-300 ${
        isHovered ? "transform -translate-y-1 shadow-xl border-[hsl(var(--color-primary))]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Beach Image */}
      <div className="relative h-52 bg-[hsl(var(--color-primary))]">
        <img 
          src={beach.imageUrl} 
          alt={beach.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/40 opacity-60"></div>
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[hsl(var(--color-text))] px-2 py-1 rounded-md text-sm font-medium flex items-center">
          <ProvinceIcon /> 
          {beach.province}
        </span>
        <span className="absolute top-3 right-3 bg-[hsl(var(--color-primary))]/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
          <Trophy className="h-3.5 w-3.5 mr-1" /> Rank #{rank}
        </span>
      </div>

      {/* Beach Information */}
      <CardContent className="p-5 bg-gradient-to-br from-white to-[hsl(var(--color-secondary))]/10">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-[hsl(var(--color-text))]">{beach.name}</h3>
            <p className="text-sm flex items-center text-gray-600 mb-3">
              <MapPin className="h-3.5 w-3.5 mr-1 text-[hsl(var(--color-primary))]" /> {beach.province}
            </p>
          </div>
          <Link href={`/beach/${beach.id}`}>
            <Button variant="outline" size="sm" className="text-[hsl(var(--color-primary))] hover:text-[hsl(var(--color-primary))-darker]">
              <Info className="h-3.5 w-3.5 mr-1" /> Details
            </Button>
          </Link>
        </div>
        <p className="text-sm mb-4 line-clamp-3 text-[hsl(var(--color-text))/80]">{beach.description}</p>
        
        {/* Vote Button */}
        <Button 
          className={`w-full py-6 transition-all duration-300 text-white ${
            hasVoted 
              ? "bg-[hsl(var(--color-accent))] hover:bg-[#e05f32]" 
              : "bg-[hsl(var(--color-primary))] hover:bg-[#188a84]"
          } ${isVoting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.01]"}`}
          onClick={handleVote}
          disabled={isVoting || hasVoted}
        >
          {hasVoted ? (
            <div className="flex items-center justify-center">
              Thanks for voting! <Heart className="h-4 w-4 ml-2 fill-white" />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Vote for this beach <ThumbsUp className="h-4 w-4 ml-2" />
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
