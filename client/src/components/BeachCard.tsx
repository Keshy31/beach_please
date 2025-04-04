import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Beach } from "@shared/schema";
import { Anchor, Trophy, Heart, MapPin, ThumbsUp, Palmtree, Award, Star } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface BeachCardProps {
  beach: Beach;
  onVote: () => void;
  isVoting: boolean;
}

export default function BeachCard({ beach, onVote, isVoting }: BeachCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleVote = () => {
    setHasVoted(true);
    setShowConfetti(true);
    
    // Hide confetti after animation completes
    setTimeout(() => {
      setShowConfetti(false);
    }, 1500);
    
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
    <div className="relative">
      {/* Victory Award Animation */}
      <AnimatePresence>
        {hasVoted && (
          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -20, opacity: 1, scale: [1, 1.2, 1] }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Award className="h-12 w-12 text-yellow-400 drop-shadow-lg" />
          </motion.div>
        )}

        {/* Confetti Animation */}
        {showConfetti && (
          <>
            {Array.from({ length: 20 }).map((_, i) => {
              const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-400", 
                "bg-pink-500", "bg-purple-500", "bg-cyan-400"];
              
              const randomX = Math.random() * 200 - 100;
              const randomY = Math.random() * 200 - 100;
              const scale = 0.5 + Math.random() * 0.5;
              const rotation = Math.random() * 360;
              const delay = Math.random() * 0.2;
              
              return (
                <motion.div
                  key={i}
                  className={`absolute top-1/2 left-1/2 h-3 w-3 rounded-full ${colors[i % colors.length]}`}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    rotate: 0
                  }}
                  animate={{ 
                    x: randomX, 
                    y: randomY - 100,
                    opacity: 0,
                    scale: [1, scale, 0],
                    rotate: rotation
                  }}
                  transition={{ 
                    duration: 1 + Math.random(), 
                    ease: "easeOut",
                    delay
                  }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>
      
      <motion.div
        animate={hasVoted ? 
          { scale: [1, 1.1, 1.05], y: [0, -15, -10], 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" } : 
          { scale: 1 }
        }
        transition={{ duration: 0.6 }}
      >
        <Card 
          className={`beach-card bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full transition-all duration-300 ${
            isHovered ? "transform -translate-y-1 shadow-xl border-[hsl(var(--color-primary))]" : ""
          } ${hasVoted ? "border-2 border-yellow-400" : ""}`}
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
                <Link href={`/beach/${beach.id}`} className="inline-block">
                  <h3 className="font-display font-bold text-xl text-[hsl(var(--color-text))] hover:text-[hsl(var(--color-primary))] transition-colors duration-200">{beach.name}</h3>
                </Link>
                <p className="text-sm flex items-center text-gray-600 mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-[hsl(var(--color-primary))]" /> {beach.province}
                </p>
              </div>
            </div>
            <p className="text-sm mb-4 line-clamp-3 text-[hsl(var(--color-text))/80]">{beach.description}</p>
            
            {/* Vote Button */}
            <motion.div whileHover={{ scale: hasVoted ? 1 : 1.02 }} whileTap={{ scale: hasVoted ? 1 : 0.98 }}>
              <Button 
                className={`w-full py-6 transition-colors duration-300 text-white ${
                  hasVoted 
                    ? "bg-[hsl(var(--color-accent))] hover:bg-[#e05f32]" 
                    : "bg-[hsl(var(--color-primary))] hover:bg-[#188a84]"
                } ${isVoting ? "opacity-70 cursor-not-allowed" : ""}`}
                onClick={handleVote}
                disabled={isVoting || hasVoted}
              >
                {hasVoted ? (
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Thanks for voting! <Heart className="h-4 w-4 ml-2 fill-white" />
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center">
                    Vote for this beach <ThumbsUp className="h-4 w-4 ml-2" />
                  </div>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
