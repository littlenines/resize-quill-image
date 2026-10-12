const emptyRect = () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 });

Range.prototype.getBoundingClientRect = emptyRect;
Range.prototype.getClientRects = () => [];

for (const [prop, attr] of [['offsetWidth', 'width'], ['offsetHeight', 'height']]) {
  Object.defineProperty(HTMLImageElement.prototype, prop, {
    configurable: true,
    get() {
      return Number(this.getAttribute(attr)) || 0;
    },
  });
}
