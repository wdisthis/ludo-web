class LudoPiece {
  constructor(id, playerId, color) {
    this.id = id;
    this.playerId = playerId;
    this.color = color;
    this.step = -1;
  }
  
  moveStep(count) {
    if (this.step === -1 && count === 6) {
      this.step = 0;
      return true;
    }
    if (this.step >= 0 && (this.step + count) <= 56) {
      this.step += count;
      return true;
    }
    return false;
  }
  
  resetToBase() {
    this.step = -1;
  }
  
  getCoordinates() {
    return LudoPath.getPathCoordinates(this.playerId, this.step, this.id);
  }
}
window.LudoPiece = LudoPiece;
