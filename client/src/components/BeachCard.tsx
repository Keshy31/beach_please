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
    
    // Hide confetti after animation completes (but keep the award and card highlight)
    setTimeout(() => {
      setShowConfetti(false);
    }, 2500);
    
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
          <div className="confetti-container">
            {/* Confetti shapes */}
            <motion.div 
              className="absolute top-1/2 left-1/4 h-4 w-4 bg-blue-500 rounded-full z-30"
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{ 
                y: -100, 
                x: -50,
                opacity: 0, 
                scale: [1, 1.5, 0.5] 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute top-1/2 right-1/4 h-4 w-4 bg-green-500 rounded-full z-30"
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{ 
                y: -100, 
                x: 50,
                opacity: 0, 
                scale: [1, 1.5, 0.5] 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 h-4 w-4 bg-yellow-400 rotate-45 z-30"
              style={{ width: '12px', height: '12px' }}
              initial={{ y: 0, x: -45, opacity: 1, rotate: 0 }}
              animate={{ 
                y: -120, 
                x: -80,
                opacity: 0, 
                rotate: 180,
                scale: [1, 1.5, 0.5] 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 h-4 w-4 bg-pink-500 rotate-45 z-30"
              style={{ width: '12px', height: '12px' }}
              initial={{ y: 0, x: 15, opacity: 1, rotate: 0 }}
              animate={{ 
                y: -120, 
                x: 60,
                opacity: 0, 
                rotate: 180,
                scale: [1, 1.5, 0.5] 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            
            {/* More confetti in various directions */}
            <motion.div 
              className="absolute top-1/2 left-1/2 h-3 w-3 bg-purple-500 rounded-full z-30"
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{ 
                y: -80, 
                x: -30,
                opacity: 0, 
                scale: [1, 1.5, 0.5] 
              }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 h-3 w-3 bg-cyan-400 rounded-full z-30"
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{ 
                y: -80, 
                x: 30,
                opacity: 0, 
                scale: [1, 1.5, 0.5] 
              }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 h-5 w-2 bg-red-500 rounded-full z-30"
              initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
              animate={{ 
                y: -100, 
                x: -20,
                opacity: 0, 
                rotate: 90,
                scale: [1, 1.2, 0.5] 
              }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 h-5 w-2 bg-orange-400 rounded-full z-30"
              initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
              animate={{ 
                y: -100, 
                x: 20,
                opacity: 0, 
                rotate: -90,
                scale: [1, 1.2, 0.5] 
              }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            />
          </div>
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
