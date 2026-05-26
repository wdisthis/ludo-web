const LudoBoard = {
  piecesContainer: null,
  cellsContainer: null,
  
  init() {
    this.piecesContainer = LudoUtils.qs('#board-pieces-container');
    this.cellsContainer = LudoUtils.qs('#board-cells-container');
    this.renderCellOverlays();
  },
  
  renderCellOverlays() {
    if (!this.cellsContainer) return;
    this.cellsContainer.innerHTML = '';
    
    for (let gy = 0; gy < 15; gy++) {
      for (let gx = 0; gx < 15; gx++) {
        const cell = LudoUtils.createElement('div', ['cell-overlay']);
        cell.style.gridColumn = gx + 1;
        cell.style.gridRow = gy + 1;
        cell.dataset.gx = gx;
        cell.dataset.gy = gy;
        
        if (LudoRules.isSafeCell(gx, gy)) {
          cell.classList.add('safe-zone-highlight');
        }
        
        this.cellsContainer.appendChild(cell);
      }
    }
  },
  
  update(players, clickableTokens = [], onTokenClick = null) {
    if (!this.piecesContainer) return;
    
    const cellMap = {};
    
    players.forEach(player => {
      if (player.isFinished()) return;
      
      player.tokens.forEach(token => {
        const coords = token.getCoordinates();
        const key = `${coords[0]}_${coords[1]}`;
        
        if (!cellMap[key]) {
          cellMap[key] = [];
        }
        cellMap[key].push({
          token,
          player,
          isClickable: clickableTokens.includes(token)
        });
      });
    });
    
    this.piecesContainer.innerHTML = '';
    
    Object.entries(cellMap).forEach(([key, items]) => {
      const [gx, gy] = key.split('_').map(Number);
      const totalInCell = items.length;
      
      items.forEach((item, index) => {
        const { token, player, isClickable } = item;
        
        const tokenEl = LudoUtils.createElement('div', ['token', player.color]);
        tokenEl.dataset.playerId = player.id;
        tokenEl.dataset.tokenId = token.id;
        
        const cellPercentage = 100 / 15;
        tokenEl.style.left = `${gx * cellPercentage}%`;
        tokenEl.style.top = `${gy * cellPercentage}%`;
        
        tokenEl.classList.add(`stack-size-${totalInCell}`);
        tokenEl.classList.add(`stack-pos-${index}`);
        
        if (isClickable) {
          tokenEl.classList.add('eligible');
          LudoUtils.on(tokenEl, 'click', () => {
            if (onTokenClick) onTokenClick(token);
          });
        }
        
        this.piecesContainer.appendChild(tokenEl);
      });
    });
  },
  
  highlightPath(pathCoords) {
    const cells = LudoUtils.qsa('.cell-overlay', this.cellsContainer);
    cells.forEach(c => c.classList.remove('path-highlight'));
    
    pathCoords.forEach(([x, y]) => {
      const matched = Array.from(cells).find(c => Number(c.dataset.gx) === x && Number(c.dataset.gy) === y);
      if (matched) {
        matched.classList.add('path-highlight');
      }
    });
  },
  
  clearHighlights() {
    const cells = LudoUtils.qsa('.cell-overlay', this.cellsContainer);
    cells.forEach(c => c.classList.remove('path-highlight'));
  },
  
  triggerCaptureAnimation(gx, gy) {
    const container = LudoUtils.qs('#board-effects-container');
    if (!container) return;
    
    const burst = LudoUtils.createElement('div', ['capture-burst']);
    burst.style.left = `${(gx + 0.5) * (100 / 15)}%`;
    burst.style.top = `${(gy + 0.5) * (100 / 15)}%`;
    
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const speed = LudoUtils.randomRange(20, 60);
      const dx = `${Math.cos(angle) * speed}px`;
      const dy = `${Math.sin(angle) * speed}px`;
      
      const spark = LudoUtils.createElement('div', ['capture-spark']);
      spark.style.setProperty('--dx', dx);
      spark.style.setProperty('--dy', dy);
      
      const colors = ['#ff4d4d', '#ffcc00', '#2ecc71', '#3b82f6'];
      spark.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      burst.appendChild(spark);
    }
    
    container.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
  },
  
  triggerSafeAnimation(gx, gy) {
    const container = LudoUtils.qs('#board-effects-container');
    if (!container) return;
    
    const ring = LudoUtils.createElement('div', ['safe-landing-ring']);
    ring.style.left = `${(gx + 0.5) * (100 / 15)}%`;
    ring.style.top = `${(gy + 0.5) * (100 / 15)}%`;
    
    container.appendChild(ring);
    setTimeout(() => ring.remove(), 850);
  }
};
