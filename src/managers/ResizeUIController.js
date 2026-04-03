import { OverlayManager } from "./OverlayManager.js";
import { HandleManager } from "./HandleManager.js";
import { DragController } from "./DragController.js";
import { DisplaySizeManager } from "./DisplaySizeManager.js";
import { TooltipInfoManager } from "./TooltipInfoManager.js";

export class ResizeUIController {
  constructor(parent, options) {
    this.options = options;
    this.img = null;
    this._showing = false;

    /** @type {OverlayManager | null} */
    this.overlayManager = new OverlayManager(parent, options.overlayStyles);
    /** @type {DragController | null} */
    this.dragController = new DragController(
      options.minWidth,
      options.minHeight,
      this.overlayManager,
      null,
      null,
    );

    this.handleMousedown = this.handleMousedown.bind(this);
  }

  show(img) {
    if (this.img === img) return;
    if (!img || !(img instanceof HTMLImageElement)) return;
    if (this._showing) return;

    this._showing = true;
    this.hide();

    this.img = img;
    if (!this.overlayManager?.overlay) this.overlayManager?.create();
    this.handleManager = new HandleManager(
      this.overlayManager?.overlay,
      this.options.positions,
      this.options.handleStyles,
      this.handleMousedown,
    );
    this.handleManager.createHandles();
    this.overlayManager?.reposition(this.img);

    if (this.options.displaySize) {
      this.displaySizeManager = new DisplaySizeManager(
        this.overlayManager?.overlay,
        this.img,
        this.options.displaySizeStyles,
      );
      this.displaySizeManager.create();
      this.dragController?.setDisplaySizeManager(this.displaySizeManager);
    }

    if (this.options.helpIcon) {
      this.tooltipInfoManager = new TooltipInfoManager(
        this.overlayManager?.overlay,
      );
      this.tooltipInfoManager.create();
      this.dragController?.setTooltipInfoManager(this.tooltipInfoManager);
    }

    this._showing = false;
  }

  hide() {
    this.dragController?.setDisplaySizeManager(null);
    this.dragController?.setTooltipInfoManager(null);

    if (this.handleManager) this.handleManager.removeHandles();
    this.overlayManager?.remove();

    if (this.displaySizeManager) this.displaySizeManager.remove();
    this.displaySizeManager = null;

    if (this.tooltipInfoManager) {
      this.tooltipInfoManager.remove();
      this.tooltipInfoManager = null;
    }

    this.img = null;
  }

  update() {
    this.overlayManager?.reposition(this.img);
    if (this.displaySizeManager) this.displaySizeManager.update();
    if (this.tooltipInfoManager) this.tooltipInfoManager.update();
  }

  handleMousedown(evt) {
    if (!(evt.target instanceof HTMLElement)) return;
    this.dragController?.startDragging(evt, this.img, evt.target);
  }

  destroy() {
    this.hide();
    this.dragController?.destroy();
    this.dragController = null;
    this.overlayManager = null;
  }
}
