/**
 * Calculate ELO rating changes
 * 
 * @param winnerRating Current rating of the winner
 * @param loserRating Current rating of the loser
 * @param kFactor How much ratings can change (higher = more volatile)
 * @returns Object with new ratings for both players
 */
export function calculateEloRatings(
  winnerRating: number,
  loserRating: number,
  kFactor = 32
) {
  // Calculate expected scores
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
  
  // Calculate new ratings
  const newWinnerRating = Math.round(winnerRating + kFactor * (1 - expectedScoreWinner));
  const newLoserRating = Math.round(loserRating + kFactor * (0 - expectedScoreLoser));
  
  return {
    winner: newWinnerRating,
    loser: newLoserRating,
    winnerGain: newWinnerRating - winnerRating,
    loserLoss: loserRating - newLoserRating
  };
}

/**
 * Calculate the probability of player A winning against player B
 * 
 * @param ratingA Rating of player A
 * @param ratingB Rating of player B
 * @returns Probability from 0 to 1
 */
export function calculateWinProbability(ratingA: number, ratingB: number) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}
