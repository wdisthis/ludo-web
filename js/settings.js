const LudoSettings = {
  data: {
    bgmVolume: 50,
    sfxVolume: 70,
    aiSpeed: 'normal',
    soundOn: true
  },
  load() {
    try {
      const stored = localStorage.getItem('ludo_cozy_settings');
      if (stored) {
        this.data = { ...this.data, ...JSON.parse(stored) };
      }
    } catch (e) {}
    return this.data;
  },
  save() {
    try {
      localStorage.setItem('ludo_cozy_settings', JSON.stringify(this.data));
    } catch (e) {}
  },
  update(key, value) {
    if (key in this.data) {
      this.data[key] = value;
      this.save();
    }
  }
};
LudoSettings.load();
