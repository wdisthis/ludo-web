const LudoAI = {
  selectMove(player, roll, players) {
    const eligibleTokens = player.tokens.filter(t => LudoRules.canTokenMove(player.id, t, roll));
    if (eligibleTokens.length === 0) return null;
    
    for (const token of eligibleTokens) {
      const targetStep = token.step === -1 ? 0 : token.step + roll;
      const targetCoords = LudoPath.getPathCoordinates(player.id, targetStep, token.id);
      
      if (!LudoRules.isSafeCell(targetCoords[0], targetCoords[1])) {
        for (const otherPlayer of players) {
          if (otherPlayer.id === player.id || otherPlayer.isFinished()) continue;
          
          for (const otherToken of otherPlayer.tokens) {
            if (otherToken.step === -1 || otherToken.step === 56) continue;
            
            const otherCoords = otherToken.getCoordinates();
            if (otherCoords[0] === targetCoords[0] && otherCoords[1] === targetCoords[1]) {
              return token;
            }
          }
        }
      }
    }
    
    const baseSix = eligibleTokens.find(t => t.step === -1 && roll === 6);
    if (baseSix) return baseSix;
    
    for (const token of eligibleTokens) {
      const targetStep = token.step + roll;
      const targetCoords = LudoPath.getPathCoordinates(player.id, targetStep, token.id);
      if (LudoRules.isSafeCell(targetCoords[0], targetCoords[1])) {
        return token;
      }
    }
    
    let bestToken = null;
    let maxStep = -2;
    for (const token of eligibleTokens) {
      if (token.step > maxStep) {
        maxStep = token.step;
        bestToken = token;
      }
    }
    if (bestToken) return bestToken;
    
    return eligibleTokens[Math.floor(Math.random() * eligibleTokens.length)];
  }
};
