LudoUtils.on(document, 'DOMContentLoaded', () => {
  LudoGame.init();
  LudoDice.init();
  LudoModal.openStartMenu();
});
