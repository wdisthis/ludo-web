class LudoPlayer {
  constructor(id, name, type, color) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.color = color;
    this.tokens = [];
    this.initTokens();
  }
  
  initTokens() {
    this.tokens = [];
    for (let i = 0; i < 4; i++) {
      this.tokens.push(new LudoPiece(i, this.id, this.color));
    }
  }
  
  getActiveTokensCount() {
    return this.tokens.filter(t => t.step >= 0 && t.step < 56).length;
  }
  
  getFinishedTokensCount() {
    return this.tokens.filter(t => t.step === 56).length;
  }
  
  isFinished() {
    return this.getFinishedTokensCount() === 4;
  }
}
window.LudoPlayer = LudoPlayer;
