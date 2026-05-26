const LudoAudio = {
  bgm: null,
  sfx: {},
  
  init() {
    this.bgm = new Audio('assets/audio/bgm.mp3');
    this.bgm.loop = true;
    
    const sfxFiles = [
      'dice-roll', 'piece-move', 'piece-capture', 
      'piece-enter-home', 'piece-finish', 'piece-safe', 
      'turn-change', 'six-rolled', 'win', 'lose'
    ];
    
    sfxFiles.forEach(name => {
      this.sfx[name] = new Audio(`assets/audio/${name}.mp3`);
    });
    
    this.applySettings();
  },
  
  applySettings() {
    const isMuted = !LudoSettings.data.soundOn;
    const bgmVol = LudoSettings.data.bgmVolume / 100;
    const sfxVol = LudoSettings.data.sfxVolume / 100;
    
    if (this.bgm) {
      this.bgm.volume = isMuted ? 0 : bgmVol;
    }
    
    Object.values(this.sfx).forEach(audio => {
      audio.volume = isMuted ? 0 : sfxVol;
    });
  },
  
  startBGM() {
    if (!this.bgm) this.init();
    this.applySettings();
    this.bgm.play().catch(() => {
      document.addEventListener('click', () => {
        this.bgm.play().catch(() => {});
      }, { once: true });
    });
  },
  
  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
    }
  },
  
  playSFX(name) {
    if (!this.bgm) this.init();
    const effect = this.sfx[name];
    if (effect) {
      this.applySettings();
      effect.currentTime = 0;
      effect.play().catch(() => {});
    }
  }
};
