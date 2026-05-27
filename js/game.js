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
    this.winnersList = [];
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
    } while ((this.players[this.activePlayerIndex].type === 'none' || this.players[this.activePlayerIndex].isFinished()) && iterations < 5);
    
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
  async rewindToken(otherPlayer, otherToken) {
    const startStep = otherToken.step;
    const delayTime = 130; // 130ms per step is the golden speed (readable, elegant, highly satisfying!)
    
    const tokenEl = LudoUtils.qs(`.token[data-player-id="${otherPlayer.id}"][data-token-id="${otherToken.id}"]`, LudoBoard.piecesContainer);
    if (tokenEl) {
      tokenEl.style.zIndex = '40';
      tokenEl.style.transition = 'left 0.11s linear, top 0.11s linear';
    }
    
    for (let s = startStep - 1; s >= 0; s--) {
      otherToken.step = s;
      const coords = otherToken.getCoordinates();
      LudoAudio.playSFX('piece-move');
      
      if (tokenEl) {
        tokenEl.style.left = `${coords[0] * (100 / 15)}%`;
        tokenEl.style.top = `${coords[1] * (100 / 15)}%`;
      }
      
      await LudoUtils.delay(delayTime);
    }
    
    // Final reset to base socket
    otherToken.resetToBase();
    if (tokenEl) {
      const coords = otherToken.getCoordinates();
      tokenEl.classList.add('token-base');
      tokenEl.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
      tokenEl.style.left = `${coords[0] * (100 / 15) - 2.6}%`;
      tokenEl.style.top = `${coords[1] * (100 / 15) - 2.6}%`;
    }
    
    LudoAudio.playSFX('piece-safe');
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
    
    const delayTime = LudoSettings.data.aiSpeed === 'fast' ? 140 : 250;
    const tokenEl = LudoUtils.qs(`.token[data-player-id="${activePlayer.id}"][data-token-id="${token.id}"]`, LudoBoard.piecesContainer);
    
    // Dynamically calculate transition duration to match movement audio play exactly (85% of step delay)
    const transitionSecs = (delayTime * 0.85) / 1000;
    if (tokenEl) {
      tokenEl.style.transition = `left ${transitionSecs}s cubic-bezier(0.25, 0.46, 0.45, 0.94), top ${transitionSecs}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      tokenEl.style.setProperty('--hop-duration', `${transitionSecs}s`);
    }
    
    for (const targetStep of steps) {
      token.step = targetStep;
      const coords = token.getCoordinates();
      LudoAudio.playSFX('piece-move');
      
      if (tokenEl) {
        tokenEl.style.zIndex = '50';
        tokenEl.classList.remove('token-base');
        
        // Retrigger hop CSS animation smoothly matching the exact horizontal travel speed
        tokenEl.style.animation = 'none';
        void tokenEl.offsetWidth; // trigger reflow
        tokenEl.style.animation = `token-hop-step ${transitionSecs}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        tokenEl.style.left = `${coords[0] * (100/15)}%`;
        tokenEl.style.top = `${coords[1] * (100/15)}%`;
      }
      
      await LudoUtils.delay(delayTime);
    }
    
    const finalCoords = token.getCoordinates();
    
    if (token.step === 56) {
      LudoAudio.playSFX('piece-finish');
      LudoUI.logMessage(`Piece ${token.id + 1} of ${activePlayer.name} has finished!`, 'sys');
      LudoBoard.triggerSafeAnimation(finalCoords[0], finalCoords[1]);
      
      if (activePlayer.isFinished()) {
        if (!this.winnersList.includes(activePlayer)) {
          this.winnersList.push(activePlayer);
          LudoUI.logMessage(`🏆 ${activePlayer.name} has finished all tokens! Ranked #${this.winnersList.length}!`, 'sys');
        }
        
        const activeParticipants = this.players.filter(p => p.type !== 'none');
        
        if (this.winnersList.length >= activeParticipants.length - 1) {
          // Push any remaining player who hasn't finished as the last place (loser)
          activeParticipants.forEach(p => {
            if (!this.winnersList.includes(p)) {
              this.winnersList.push(p);
            }
          });
          
          this.gameState = 'gameover';
          LudoAudio.stopBGM();
          LudoAudio.playSFX('win');
          LudoModal.openWinScreen(this.winnersList, this.matchStats.captures, this.matchStats.rollsCount);
          return;
        }
      }
    } else if (LudoRules.isSafeCell(finalCoords[0], finalCoords[1])) {
      LudoAudio.playSFX('piece-safe');
      LudoBoard.triggerSafeAnimation(finalCoords[0], finalCoords[1]);
    } else {
      let isCaptured = false;
      const capturePromises = [];
      
      for (const otherPlayer of this.players) {
        if (otherPlayer.id === activePlayer.id || otherPlayer.type === 'none' || otherPlayer.isFinished()) continue;
        
        for (const otherToken of otherPlayer.tokens) {
          if (otherToken.step === -1 || otherToken.step === 56) continue;
          
          const otherCoords = otherToken.getCoordinates();
          if (otherCoords[0] === finalCoords[0] && otherCoords[1] === finalCoords[1]) {
            isCaptured = true;
            LudoUI.logMessage(`${activePlayer.name} captured ${otherPlayer.name}'s token!`, 'sys');
            
            // Initiate fast rollback traceback animation
            capturePromises.push(this.rewindToken(otherPlayer, otherToken));
          }
        }
      }
      
      if (isCaptured) {
        this.matchStats.captures++;
        LudoAudio.playSFX('piece-capture');
        LudoBoard.triggerCaptureAnimation(finalCoords[0], finalCoords[1]);
        
        // Wait for trace-back rewinding to complete!
        await Promise.all(capturePromises);
        
        LudoBoard.update(this.players);
        await LudoUtils.delay(500);
        
        if (roll === 6 && !activePlayer.isFinished()) {
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
    
    LudoBoard.update(this.players);
    
    if (roll === 6 && !activePlayer.isFinished()) {
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
