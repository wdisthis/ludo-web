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
    
    const value = LudoUtils.randomRange(1, 6);
    this.lastValue = value;
    
    if (this.cubeEl) {
      const baseRot = {
        1: { x: 0, y: 0 },
        2: { x: -90, y: 0 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: 90, y: 0 },
        6: { x: 0, y: 180 }
      };
      
      const xSpins = (3 + Math.floor(Math.random() * 3)) * 360;
      const ySpins = (3 + Math.floor(Math.random() * 3)) * 360;
      
      const base = baseRot[value];
      const finalRot = `rotateX(${xSpins + base.x - 12}deg) rotateY(${ySpins + base.y + 18}deg)`;
      
      this.cubeEl.style.setProperty('--final-rot', finalRot);
      
      this.cubeEl.className = 'dice-cube';
      void this.cubeEl.offsetWidth; // trigger reflow
      this.cubeEl.className = 'dice-cube rolling';
      
      // Wait for 1200ms animation duration to finish
      await LudoUtils.delay(1200);
      
      // Set the final inline transform so it freezes in place perfectly!
      this.cubeEl.className = 'dice-cube';
      this.cubeEl.style.transform = finalRot;
    } else {
      await LudoUtils.delay(1200);
    }
    
    this.isRolling = false;
    return value;
  },
  
  setValue(value) {
    this.lastValue = value;
    if (this.cubeEl) {
      const baseRot = {
        1: { x: 0, y: 0 },
        2: { x: -90, y: 0 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: 90, y: 0 },
        6: { x: 0, y: 180 }
      };
      const base = baseRot[value];
      const finalRot = `rotateX(${base.x - 12}deg) rotateY(${base.y + 18}deg)`;
      this.cubeEl.className = 'dice-cube';
      this.cubeEl.style.transform = finalRot;
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
