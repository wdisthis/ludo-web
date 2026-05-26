const LudoRules = {
  safeCells: [
    [6, 13], [1, 6], [8, 1], [13, 8],
    [8, 12], [2, 8], [6, 2], [12, 6]
  ],
  
  canTokenMove(playerId, token, roll) {
    if (token.step === -1) {
      return roll === 6;
    }
    return (token.step + roll) <= 56;
  },
  
  isSafeCell(gx, gy) {
    return this.safeCells.some(([x, y]) => x === gx && y === gy);
  }
};
