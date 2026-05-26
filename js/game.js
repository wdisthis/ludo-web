const LudoGame = {
  players: [],
  activePlayerIndex: 0,
  currentRollValue: null,
  gameState: 'waiting',
  gameMode: 'vs-ai',
  
  matchStats: {
    captures: 0,
    rollsCount: 0
  },
  
  init() {
    LudoBoard.init();
    LudoUI.init();
    LudoModal.init();
  },
  
  start(mode, configs) {
    this.gameMode = mode;
    this.players = [];
    this.matchStats.captures = 0;
    this.matchStats.rollsCount = 0;
    
    const colors = ['green', 'yellow', 'blue', 'red'];
    
    configs.forEach((cfg, idx) => {
      const player = new LudoPlayer(idx, cfg.name, cfg.type, colors[idx]);
      this.players.push(player);
    });
    
    LudoUI.clearLogs();
    LudoUI.logMessage('The board game has started! Good luck!', 'sys');
    
    LudoAudio.startBGM();
    
    this.gameState = 'playing';
    this.activePlayerIndex = 3; // Red starts (Player 3)
    this.nextTurn();
  },
  
  restart() {
    LudoAudio.stopBGM();
    LudoModal.openStartMenu();
    this.gameState = 'waiting';
  },
  
  getActivePlayer() {
    return this.players[this.activePlayerIndex];
  },
  
  nextTurn() {
    if (this.gameState !== 'playing') return;
    
    let iterations = 0;
    do {
      this.activePlayerIndex = (this.activePlayerIndex + 1) % 4;
      iterations++;
    } while (this.players[this.activePlayerIndex].type === 'none' && iterations < 5);
    
    const activePlayer = this.getActivePlayer();
    
    LudoUI.updateScoreboard(this.players, activePlayer.id);
    LudoUI.updateActiveTurnBadge(activePlayer);
    
    LudoBoard.update(this.players);
    LudoBoard.clearHighlights();
    
    this.currentRollValue = null;
    
    if (activePlayer.type === 'human') {
      LudoUI.logMessage(`It's your turn, ${activePlayer.name}! Roll the dice.`, activePlayer.color);
      LudoDice.enable((val) => this.handleRollResult(val));
    } else {
      LudoUI.logMessage(`${activePlayer.name} (Computer) is preparing to roll...`, 'sys');
      LudoDice.disable();
      this.triggerAITurn();
    }
  },
  
  async handleRollResult(value) {
    this.matchStats.rollsCount++;
    this.currentRollValue = value;
    
    const activePlayer = this.getActivePlayer();
    LudoUI.logMessage(`${activePlayer.name} rolled a ${value}!`, activePlayer.color);
    
    if (value === 6) {
      LudoAudio.playSFX('six-rolled');
    }
    
    const eligibleTokens = activePlayer.tokens.filter(t => LudoRules.canTokenMove(activePlayer.id, t, value));
    
    if (eligibleTokens.length === 0) {
      LudoUI.logMessage(`No moves available for ${activePlayer.name}. Turn changes.`, 'sys');
      await LudoUtils.delay(1000);
      this.nextTurn();
      return;
    }
    
    if (activePlayer.type === 'human') {
      LudoDice.disable();
      LudoBoard.update(this.players, eligibleTokens, (token) => this.executeMove(token));
    }
  },
  
  async triggerAITurn() {
    const delayDuration = LudoSettings.data.aiSpeed === 'fast' ? 400 : 1200;
    await LudoUtils.delay(delayDuration);
    
    const value = await LudoDice.roll();
    this.matchStats.rollsCount++;
    this.currentRollValue = value;
    
    const activePlayer = this.getActivePlayer();
    LudoUI.logMessage(`${activePlayer.name} (Computer) rolled a ${value}!`, activePlayer.color);
    
    if (value === 6) {
      LudoAudio.playSFX('six-rolled');
    }
    
    await LudoUtils.delay(delayDuration / 2);
    
    const tokenToMove = LudoAI.selectMove(activePlayer, value, this.players);
    
    if (!tokenToMove) {
      LudoUI.logMessage(`No moves available for ${activePlayer.name}. Turn changes.`, 'sys');
      await LudoUtils.delay(delayDuration);
      this.nextTurn();
      return;
    }
    
    this.executeMove(tokenToMove);
  },
  
  async executeMove(token) {
    const activePlayer = this.getActivePlayer();
    const roll = this.currentRollValue;
    
    LudoBoard.update(this.players);
    LudoBoard.clearHighlights();
    
    const steps = [];
    const initialStep = token.step;
    
    if (initialStep === -1) {
      steps.push(0);
    } else {
      for (let i = 1; i <= roll; i++) {
        steps.push(initialStep + i);
      }
    }
    
    const delayTime = LudoSettings.data.aiSpeed === 'fast' ? 120 : 250;
    
    for (const targetStep of steps) {
      token.step = targetStep;
      
      const coords = token.getCoordinates();
      LudoAudio.playSFX('piece-move');
      
      const tokenEl = LudoUtils.qs(`.token[data-player-id="${activePlayer.id}"][data-token-id="${token.id}"]`, LudoBoard.piecesContainer);
      if (tokenEl) {
        tokenEl.classList.add('moving');
        tokenEl.style.left = `${coords[0] * (100/15)}%`;
        tokenEl.style.top = `${coords[1] * (100/15)}%`;
        setTimeout(() => tokenEl.classList.remove('moving'), 300);
      }
      
      LudoBoard.update(this.players);
      await LudoUtils.delay(delayTime);
    }
    
    const finalCoords = token.getCoordinates();
    
    if (token.step === 56) {
      LudoAudio.playSFX('piece-finish');
      LudoUI.logMessage(`Piece ${token.id + 1} of ${activePlayer.name} has finished!`, 'sys');
      LudoBoard.triggerSafeAnimation(finalCoords[0], finalCoords[1]);
      
      if (activePlayer.isFinished()) {
        this.gameState = 'gameover';
        LudoAudio.stopBGM();
        LudoAudio.playSFX('win');
        LudoModal.openWinScreen(activePlayer.name, this.matchStats.captures, this.matchStats.rollsCount);
        return;
      }
    } else if (LudoRules.isSafeCell(finalCoords[0], finalCoords[1])) {
      LudoAudio.playSFX('piece-safe');
      LudoBoard.triggerSafeAnimation(finalCoords[0], finalCoords[1]);
    } else {
      let isCaptured = false;
      
      for (const otherPlayer of this.players) {
        if (otherPlayer.id === activePlayer.id || otherPlayer.type === 'none' || otherPlayer.isFinished()) continue;
        
        for (const otherToken of otherPlayer.tokens) {
          if (otherToken.step === -1 || otherToken.step === 56) continue;
          
          const otherCoords = otherToken.getCoordinates();
          if (otherCoords[0] === finalCoords[0] && otherCoords[1] === finalCoords[1]) {
            otherToken.resetToBase();
            isCaptured = true;
            LudoUI.logMessage(`${activePlayer.name} captured ${otherPlayer.name}'s token!`, 'sys');
          }
        }
      }
      
      if (isCaptured) {
        this.matchStats.captures++;
        LudoAudio.playSFX('piece-capture');
        LudoBoard.triggerCaptureAnimation(finalCoords[0], finalCoords[1]);
        
        LudoBoard.update(this.players);
        await LudoUtils.delay(1000);
        
        if (roll === 6) {
          LudoUI.logMessage(`Roll was 6! ${activePlayer.name} gets a bonus turn.`, 'sys');
          if (activePlayer.type === 'human') {
            LudoDice.enable((val) => this.handleRollResult(val));
          } else {
            this.triggerAITurn();
          }
        } else {
          this.nextTurn();
        }
        return;
      }
    }
    
    if (roll === 6) {
      LudoUI.logMessage(`Roll was 6! ${activePlayer.name} gets another turn.`, 'sys');
      if (activePlayer.type === 'human') {
        LudoDice.enable((val) => this.handleRollResult(val));
      } else {
        this.triggerAITurn();
      }
    } else {
      this.nextTurn();
    }
  }
};
window.LudoGame = LudoGame;
