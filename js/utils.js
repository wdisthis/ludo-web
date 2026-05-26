const LudoUtils = {
  qs(selector, parent = document) {
    return parent.querySelector(selector);
  },
  qsa(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },
  on(element, event, handler) {
    if (element) {
      element.addEventListener(event, handler);
    }
  },
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  createElement(tag, classes = [], attrs = {}) {
    const el = document.createElement(tag);
    classes.forEach(c => el.classList.add(c));
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }
};
