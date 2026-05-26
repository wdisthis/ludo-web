const LudoPath = {
  commonPath: [
    [6, 13], [6, 12], [6, 11], [6, 10], [6, 9],
    [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
    [0, 7],
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
    [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
    [7, 0],
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
    [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
    [14, 7],
    [14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
    [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
    [7, 14], [6, 14]
  ],
  
  startIndices: {
    0: 13, // Green starts at [1, 6]
    1: 26, // Yellow starts at [8, 1]
    2: 39, // Blue starts at [13, 8]
    3: 0   // Red starts at [6, 13]
  },
  
  homeRuns: {
    0: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    1: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    2: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
    3: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]]
  },
  
  finishes: {
    0: [6, 7],
    1: [7, 6],
    2: [8, 7],
    3: [7, 8]
  },
  
  baseSockets: {
    0: [[2, 2], [4, 2], [2, 4], [4, 4]],
    1: [[11, 2], [13, 2], [11, 4], [13, 4]],
    2: [[11, 11], [13, 11], [11, 13], [13, 13]],
    3: [[2, 11], [4, 11], [2, 13], [4, 13]]
  },
  
  getPathCoordinates(playerId, step, tokenIndex = 0) {
    if (step === -1) {
      return this.baseSockets[playerId][tokenIndex];
    }
    if (step >= 0 && step <= 50) {
      const startIndex = this.startIndices[playerId];
      const index = (startIndex + step) % 52;
      return this.commonPath[index];
    }
    if (step >= 51 && step <= 55) {
      return this.homeRuns[playerId][step - 51];
    }
    if (step >= 56) {
      return this.finishes[playerId];
    }
    return [7, 7];
  }
};
