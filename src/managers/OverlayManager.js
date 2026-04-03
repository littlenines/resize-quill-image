export class OverlayManager {
  constructor(parent, styles) {
    this.parent = parent;
    this.styles = styles;
    this.overlay = null;
  }

  create() {
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, this.styles);
    this.parent.appendChild(this.overlay);
  }

  remove() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  reposition(img) {
    if (!this.overlay) return;

    const imgRect = img.getBoundingClientRect();
    const positionedParent = this.overlay.offsetParent || this.parent;
    const containerRect = positionedParent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + positionedParent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + positionedParent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  }
}
