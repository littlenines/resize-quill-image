export class HandleManager {
  constructor(overlay, positions, handleStyles, mousedownCallback) {
    this.overlay = overlay;
    this.positions = positions;
    this.handleStyles = handleStyles;
    this.mousedownCallback = mousedownCallback;
    this.boxes = [];
  }

  createHandles() {
    this.positions.forEach((pos) => {
      const box = document.createElement("div");
      Object.assign(box.style, this.handleStyles, pos);
      box.style.clipPath = pos.clipPath;

      const isDiagonalNWSE = (pos.top !== undefined && pos.left !== undefined) || (pos.bottom !== undefined && pos.right !== undefined);
      
      box.style.cursor = isDiagonalNWSE ? "nwse-resize" : "nesw-resize";

      box.addEventListener("mousedown", this.mousedownCallback, false);
      box.addEventListener("touchstart", this.mousedownCallback, { passive: false });

      this.overlay.appendChild(box);
      this.boxes.push(box);
    });
  }

  removeHandles() {
    this.boxes.forEach((box) => {
      box.removeEventListener("mousedown", this.mousedownCallback);
      box.removeEventListener("touchstart", this.mousedownCallback);
      box.onmousedown = null;
      box.ontouchstart = null;
      box.remove();
    });

    this.boxes = [];
    this.overlay = null;
    this.positions = null;
    this.handleStyles = null;
    this.mousedownCallback = null;
  }
}
