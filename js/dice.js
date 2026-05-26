const LudoDice = {
  cubeEl: null,
  rollBtn: null,
  isRolling: false,
  lastValue: 1,
  
  init() {
    this.cubeEl = LudoUtils.qs('#dice-3d-model');
    this.rollBtn = LudoUtils.qs('#btn-roll-dice');
  },
  
  async roll() {
    if (this.isRolling) return null;
    this.isRolling = true;
    
    if (this.rollBtn) this.rollBtn.disabled = true;
    
    LudoAudio.playSFX('dice-roll');
    
    if (this.cubeEl) {
      this.cubeEl.className = 'dice-cube rolling';
    }
    
    await LudoUtils.delay(750);
    
    const value = LudoUtils.randomRange(1, 6);
    this.lastValue = value;
    
    if (this.cubeEl) {
      this.cubeEl.className = `dice-cube roll-${value}`;
    }
    
    this.isRolling = false;
    return value;
  },
  
  setValue(value) {
    this.lastValue = value;
    if (this.cubeEl) {
      this.cubeEl.className = `dice-cube roll-${value}`;
    }
  },
  
  enable(callback) {
    if (this.rollBtn) {
      this.rollBtn.disabled = false;
      this.rollBtn.classList.add('pulse-active');
      
      const touchArea = LudoUtils.qs('#dice-touch-area');
      
      const clickHandler = async () => {
        this.disable();
        const value = await this.roll();
        if (callback && value !== null) callback(value);
      };
      
      this.rollBtn.onclick = clickHandler;
      if (touchArea) {
        touchArea.onclick = clickHandler;
      }
    }
  },
  
  disable() {
    if (this.rollBtn) {
      this.rollBtn.disabled = true;
      this.rollBtn.classList.remove('pulse-active');
      this.rollBtn.onclick = null;
    }
    const touchArea = LudoUtils.qs('#dice-touch-area');
    if (touchArea) {
      touchArea.onclick = null;
    }
  }
};
