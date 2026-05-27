const LudoModal = {
  startMenuEl: null,
  settingsEl: null,
  winScreenEl: null,
  
  init() {
    this.startMenuEl = LudoUtils.qs('#modal-start-menu');
    this.settingsEl = LudoUtils.qs('#modal-settings');
    this.winScreenEl = LudoUtils.qs('#modal-win-screen');
    
    this.initStartMenu();
    this.initSettingsModal();
    this.initWinScreen();
  },
  
  initStartMenu() {
    if (!this.startMenuEl) return;
    
    const modeCards = LudoUtils.qsa('.mode-card', this.startMenuEl);
    modeCards.forEach(card => {
      LudoUtils.on(card, 'click', () => {
        modeCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        
        const radio = LudoUtils.qs('input[type="radio"]', card);
        if (radio) radio.checked = true;
        
        this.updatePlayerSetupListVisibility();
      });
    });
    
    const startBtn = LudoUtils.qs('#btn-start-game', this.startMenuEl);
    if (startBtn) {
      LudoUtils.on(startBtn, 'click', () => {
        const mode = LudoUtils.qs('input[name="game-mode"]:checked').value;
        const playerConfigs = [];
        
        for (let i = 0; i < 4; i++) {
          const nameInput = LudoUtils.qs(`#input-player-name-${i}`);
          const typeSelect = LudoUtils.qs(`#select-player-type-${i}`);
          
          playerConfigs.push({
            name: nameInput ? nameInput.value.trim() : `Player ${i+1}`,
            type: typeSelect ? typeSelect.value : 'human'
          });
        }
        
        this.startMenuEl.close();
        LudoGame.start(mode, playerConfigs);
      });
    }
  },
  
  updatePlayerSetupListVisibility() {
    const mode = LudoUtils.qs('input[name="game-mode"]:checked').value;
    for (let i = 0; i < 4; i++) {
      const typeSelect = LudoUtils.qs(`#select-player-type-${i}`);
      const row = LudoUtils.qs(`.setup-row[data-id="${i}"]`);
      
      if (mode === 'vs-ai') {
        if (i === 3) {
          if (typeSelect) typeSelect.value = 'human';
          if (row) row.classList.remove('inactive');
        } else {
          if (typeSelect) typeSelect.value = 'ai-medium';
          if (row) row.classList.remove('inactive');
        }
      } else {
        if (i === 0 || i === 3) {
          if (typeSelect && typeSelect.value === 'none') {
            typeSelect.value = 'human';
          }
          if (row) row.classList.remove('inactive');
        }
      }
    }
  },
  
  initSettingsModal() {
    if (!this.settingsEl) return;
    
    const closeBtn = LudoUtils.qs('#btn-settings-close', this.settingsEl);
    if (closeBtn) {
      LudoUtils.on(closeBtn, 'click', () => {
        this.settingsEl.close();
      });
    }
    
    const bgmSlider = LudoUtils.qs('#slider-volume-bgm', this.settingsEl);
    if (bgmSlider) {
      bgmSlider.value = LudoSettings.data.bgmVolume;
      LudoUtils.on(bgmSlider, 'input', () => {
        LudoSettings.update('bgmVolume', parseInt(bgmSlider.value));
        LudoAudio.applySettings();
      });
    }
    
    const sfxSlider = LudoUtils.qs('#slider-volume-sfx', this.settingsEl);
    if (sfxSlider) {
      sfxSlider.value = LudoSettings.data.sfxVolume;
      LudoUtils.on(sfxSlider, 'input', () => {
        LudoSettings.update('sfxVolume', parseInt(sfxSlider.value));
        LudoAudio.applySettings();
      });
    }
    
    const speedToggle = LudoUtils.qs('#toggle-ai-speed', this.settingsEl);
    if (speedToggle) {
      speedToggle.checked = LudoSettings.data.aiSpeed === 'fast';
      const desc = LudoUtils.qs('#speed-desc', this.settingsEl);
      if (desc) desc.textContent = speedToggle.checked ? 'Fast Speed' : 'Normal Speed';
      
      LudoUtils.on(speedToggle, 'change', () => {
        const speed = speedToggle.checked ? 'fast' : 'normal';
        LudoSettings.update('aiSpeed', speed);
        if (desc) desc.textContent = speed === 'fast' ? 'Fast Speed' : 'Normal Speed';
      });
    }
  },
  
  initWinScreen() {
    if (!this.winScreenEl) return;
    
    const playAgainBtn = LudoUtils.qs('#btn-win-restart', this.winScreenEl);
    if (playAgainBtn) {
      LudoUtils.on(playAgainBtn, 'click', () => {
        this.winScreenEl.close();
        LudoGame.restart();
      });
    }
    
    const mainMenuBtn = LudoUtils.qs('#btn-win-menu', this.winScreenEl);
    if (mainMenuBtn) {
      LudoUtils.on(mainMenuBtn, 'click', () => {
        this.winScreenEl.close();
        this.openStartMenu();
      });
    }
  },
  
  openStartMenu() {
    if (this.startMenuEl) {
      this.updatePlayerSetupListVisibility();
      this.startMenuEl.showModal();
    }
  },
  
  openSettings() {
    if (this.settingsEl) {
      this.settingsEl.showModal();
    }
  },
  
  openWinScreen(winnersList, capturesCount, totalRolls) {
    if (this.winScreenEl) {
      const winnerDisplay = LudoUtils.qs('#winner-name-display', this.winScreenEl);
      if (winnerDisplay && winnersList.length > 0) {
        winnerDisplay.textContent = `🏆 ${winnersList[0].name} wins the match!`;
      }
      
      const ranksContainer = LudoUtils.qs('#leaderboard-ranks-container', this.winScreenEl);
      if (ranksContainer) {
        ranksContainer.innerHTML = '<h3>Final Leaderboard Ranks</h3>';
        
        winnersList.forEach((player, index) => {
          const rankNum = index + 1;
          let medalEmoji = '';
          const rankClass = `rank-${rankNum}`;
          
          if (rankNum === 1) medalEmoji = '🥇';
          else if (rankNum === 2) medalEmoji = '🥈';
          else if (rankNum === 3) medalEmoji = '🥉';
          else medalEmoji = '💀';
          
          const roleText = rankNum === winnersList.length ? 'Loser' : 'Finisher';
          
          const row = LudoUtils.createElement('div', ['rank-row', rankClass]);
          row.innerHTML = `
            <div class="rank-left">
              <span class="rank-number">${rankNum}</span>
              <span class="rank-name">${medalEmoji} ${player.name}</span>
            </div>
            <span class="rank-role">${roleText}</span>
          `;
          ranksContainer.appendChild(row);
        });
      }
      
      const capDisplay = LudoUtils.qs('#stat-captures', this.winScreenEl);
      if (capDisplay) capDisplay.textContent = capturesCount;
      
      const rollDisplay = LudoUtils.qs('#stat-rolls', this.winScreenEl);
      if (rollDisplay) rollDisplay.textContent = totalRolls;
      
      this.winScreenEl.showModal();
    }
  }
};
LudoModal.updatePlayerSetupListVisibility = LudoModal.updatePlayerSetupListVisibility.bind(LudoModal);
