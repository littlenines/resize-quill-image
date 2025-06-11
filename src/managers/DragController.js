export class DragController {
  constructor(minWidth, minHeight, overlayManager, displaySizeManager, tooltipInfoManager) {
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.overlayManager = overlayManager;
    this.displaySizeManager = displaySizeManager;
    this.tooltipInfoManager = tooltipInfoManager;

    this.img = null;
    this.dragBox = null;
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;

    this.handleDrag = this.handleDrag.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
  }

  setDisplaySizeManager(displaySizeManager) {
    this.displaySizeManager = displaySizeManager;
  }

  setTooltipInfoManager(tooltipInfoManager) {
    this.tooltipInfoManager = tooltipInfoManager;
  }

  addEventListeners() {
    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("touchmove", this.handleDrag, { passive: false });
    document.addEventListener("mouseup", this.handleMouseup, true);
    document.addEventListener("touchend", this.handleMouseup, true);
    document.addEventListener("touchcancel", this.handleMouseup, true);
  }

  removeEventListeners() {
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("touchmove", this.handleDrag);
    document.removeEventListener("mouseup", this.handleMouseup, true);
    document.removeEventListener("touchend", this.handleMouseup, true);
    document.removeEventListener("touchcancel", this.handleMouseup, true);
  }

  startDragging(evt, img, box) {
    evt.preventDefault();
    this.img = img;
    this.dragBox = box;

    if (evt.type === "touchstart") {
      this.startX = evt.changedTouches[0].clientX;
      this.startY = evt.changedTouches[0].clientY;
    } else {
      this.startX = evt.clientX;
      this.startY = evt.clientY;
    }

    this.startWidth = img.width || img.naturalWidth;
    this.startHeight = img.height || img.naturalHeight;

    this.addEventListeners();
  }

  handleDrag(evt) {
    if (!this.img) return;

    let clientX, clientY;
    if (evt.type === "touchmove") {
      clientX = evt.changedTouches[0].clientX;
      clientY = evt.changedTouches[0].clientY;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }

    let deltaX = clientX - this.startX;
    let deltaY = clientY - this.startY;
    let aspectRatio = this.startWidth / this.startHeight;

    const isCtrlPressed = evt.ctrlKey;
    const isShiftPressed = evt.shiftKey;
    const isAltPressed = evt.altKey;

    if (isCtrlPressed) {
      let newWidth = this.startWidth + deltaX;
      let newHeight = this.startHeight + deltaY;

      newWidth = Math.max(newWidth, this.minWidth);
      newHeight = Math.max(newHeight, this.minHeight);

      this.img.style.width = `${newWidth}px`;
      this.img.style.height = `${newHeight}px`;
    } else if (isShiftPressed) {
      let newHeight = this.startHeight + deltaY;
      this.img.style.height = `${Math.max(newHeight, this.minHeight)}px`;
    } else if (isAltPressed) {
      let newWidth = this.startWidth + deltaX;
      this.img.style.width = `${Math.max(newWidth, this.minWidth)}px`;
    } else {
      const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
      let newWidth = this.startWidth + delta;
      let newHeight = newWidth / aspectRatio;

      newWidth = Math.max(newWidth, this.minWidth);
      newHeight = Math.max(newHeight, this.minHeight);

      this.img.style.width = `${newWidth}px`;
      this.img.style.height = `${newHeight}px`;
    }

    if (this.overlayManager) this.overlayManager.reposition(this.img);

    if (this.displaySizeManager) this.displaySizeManager.update();
    if (this.tooltipInfoManager) this.tooltipInfoManager.update();

    this.startX = clientX;
    this.startY = clientY;
    this.startWidth = this.img.offsetWidth;
    this.startHeight = this.img.offsetHeight;
  }

  handleMouseup() {
    this.removeEventListeners();
    this.img = null;
    this.dragBox = null;
  }

  destroy() {
  this.removeEventListeners();
  this.img = null;
  this.dragBox = null;
  this.overlayManager = null;
  this.displaySizeManager = null;
  this.tooltipInfoManager = null;
}
}
