const LudoUI = {
  activeTurnColorBadge: null,
  liveLogsEl: null,
  
  init() {
    this.activeTurnColorBadge = LudoUtils.qs('#active-turn-color');
    this.liveLogsEl = LudoUtils.qs('#game-live-logs');
    this.initHeaderControls();
  },
  
  initHeaderControls() {
    const soundBtn = LudoUtils.qs('#btn-sound-toggle');
    const settingsBtn = LudoUtils.qs('#btn-settings-trigger');
    const restartBtn = LudoUtils.qs('#btn-restart-trigger');
    
    if (soundBtn) {
      LudoUtils.on(soundBtn, 'click', () => {
        const soundOn = !LudoSettings.data.soundOn;
        LudoSettings.update('soundOn', soundOn);
        this.updateSoundButtonUI();
        LudoAudio.applySettings();
        if (soundOn) {
          LudoAudio.startBGM();
        } else {
          LudoAudio.stopBGM();
        }
      });
    }
    
    if (settingsBtn) {
      LudoUtils.on(settingsBtn, 'click', () => {
        LudoModal.openSettings();
      });
    }
    
    if (restartBtn) {
      LudoUtils.on(restartBtn, 'click', () => {
        LudoGame.restart();
      });
    }
    
    this.updateSoundButtonUI();
  },
  
  updateSoundButtonUI() {
    const soundImg = LudoUtils.qs('#img-sound-status');
    if (soundImg) {
      const soundOn = LudoSettings.data.soundOn;
      soundImg.src = soundOn ? 'assets/images/ui/icon-sound-on.png' : 'assets/images/ui/icon-sound-off.png';
      soundImg.alt = soundOn ? 'Sound On' : 'Sound Off';
    }
  },
  
  updateScoreboard(players, activePlayerId) {
    players.forEach(player => {
      const card = LudoUtils.qs(`#card-player-${player.id}`);
      if (!card) return;
      
      if (player.isFinished()) {
        card.className = `player-card card-${player.color} finished`;
        const status = LudoUtils.qs(`#status-player-${player.id}`);
        if (status) status.textContent = 'FINISHED!';
        return;
      }
      
      if (player.type === 'none') {
        card.className = `player-card card-${player.color} inactive`;
        const status = LudoUtils.qs(`#status-player-${player.id}`);
        if (status) status.textContent = 'Inactive';
        return;
      }
      
      let classes = `player-card card-${player.color}`;
      if (player.id === activePlayerId) {
        classes += ' active';
      }
      card.className = classes;
      
      const nameEl = LudoUtils.qs(`#name-player-${player.id}`);
      if (nameEl) nameEl.textContent = player.name;
      
      const statusEl = LudoUtils.qs(`#status-player-${player.id}`);
      if (statusEl) {
        statusEl.textContent = player.type === 'human' ? 'Your Turn' : 'Computer';
      }
      
      const counterEl = LudoUtils.qs(`#counter-player-${player.id}`);
      if (counterEl) {
        counterEl.textContent = `${player.getFinishedTokensCount()}/4`;
      }
    });
  },
  
  updateActiveTurnBadge(player) {
    if (!this.activeTurnColorBadge) return;
    this.activeTurnColorBadge.textContent = player.name;
    this.activeTurnColorBadge.className = `current-turn-badge ${player.color}`;
    
    const banner = LudoUtils.qs('#turn-banner');
    if (banner) {
      banner.style.boxShadow = `inset 0 0 15px var(--color-${player.color}-glow)`;
    }
  },
  
  logMessage(message, type = 'sys') {
    if (!this.liveLogsEl) return;
    
    const row = LudoUtils.createElement('div', ['log-row', `${type}-msg`]);
    row.textContent = message;
    
    this.liveLogsEl.appendChild(row);
    this.liveLogsEl.scrollTop = this.liveLogsEl.scrollHeight;
  },
  
  clearLogs() {
    if (this.liveLogsEl) {
      this.liveLogsEl.innerHTML = '';
    }
  }
};
