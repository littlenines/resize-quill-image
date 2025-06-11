import { Module } from "quill";
import { DEFAULT_OPTIONS } from "./constants.js";
import { OverlayManager } from "./managers/OverlayManager.js";
import { HandleManager } from "./managers/HandleManager.js";
import { DragController } from "./managers/DragController.js";
import { DisplaySizeManager } from "./managers/DisplaySizeManager.js";
import { TooltipInfoManager } from "./managers/TooltipInfoManager.js";
import css from './imageResize.css?inline';

const injectCSS = (css) => {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}


injectCSS(css);

export default class ImageResize extends Module {
    constructor(quill, options = {}) {
        super(quill, options);
        this.quill = quill;
        this.options = { helpIcon: true, displaySize: true, styleSelection: true, ...DEFAULT_OPTIONS, ...options };
        this.img = null;

        this.overlayManager = new OverlayManager(this.quill.root.parentNode, this.options.overlayStyles);
        this.dragController = new DragController(this.options.minWidth, this.options.minHeight, this.overlayManager, null, null);

        this.imageFormat = this.quill.constructor.import('formats/image');

        this.bindHandlers();
        this.addEventListeners();
    }

    bindHandlers() {
        this.handleClick = this.handleClick.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleMousedown = this.handleMousedown.bind(this);
    }

    addEventListeners() {
        this.quill.root.addEventListener("click", this.handleClick);
        this.quill.on("selection-change", this.handleSelectionChange);
        this.quill.on("text-change", this.handleTextChange);
    }

    removeEventListeners() {
        this.quill.root.removeEventListener("click", this.handleClick);
        this.quill.off("selection-change", this.handleSelectionChange);
        this.quill.off("text-change", this.handleTextChange);
    }

    handleClick(evt) {
        if (evt.target.tagName === "IMG") {
            const blot = this.quill.constructor.find(evt.target);
            if (blot) this.quill.setSelection(blot.offset(this.quill.scroll), blot.length());
        }
    }

    handleSelectionChange(range) {
        if (!range) return this.hide();

        const [blot] = this.quill.scroll.descendant(this.quill.constructor.import('formats/image'), range.index);

        if (blot && blot.domNode instanceof HTMLImageElement) {
            this.disableTextSelection();
            this.show(blot.domNode);
        } else {
            this.enableTextSelection();
            this.hide();
        }
    }

    disableTextSelection() {
        if (this.options.styleSelection) this.quill.root.classList.add(this.options.noSelectionClass);
    }

    enableTextSelection() {
        if (this.options.styleSelection) this.quill.root.classList.remove(this.options.noSelectionClass);
    }

    handleTextChange() {
        if (this.img) {
            if (!this.quill.root.contains(this.img)) {
                this.hide();
                this.enableTextSelection();
            } else {
                this.overlayManager.reposition(this.img);
                if (this.displaySizeManager) this.displaySizeManager.update();
                if (this.tooltipInfoManager) this.tooltipInfoManager.update();
            }
        }
    }

    show(img) {
        if (this.img === img) return;
        if (!img || !(img instanceof HTMLImageElement)) return;

        this.hide();

        this.img = img;
        if (!this.overlayManager.overlay) this.overlayManager.create();
        this.handleManager = new HandleManager(this.overlayManager.overlay, this.options.positions, this.options.handleStyles, this.handleMousedown);
        this.handleManager.createHandles();
        this.overlayManager.reposition(this.img);

        if (this.options.displaySize) {
            this.displaySizeManager = new DisplaySizeManager(this.overlayManager.overlay, this.img);
            this.displaySizeManager.create();
            this.dragController.setDisplaySizeManager(this.displaySizeManager);
        }

        if (this.options.helpIcon) {
            this.tooltipInfoManager = new TooltipInfoManager(this.overlayManager.overlay);
            this.tooltipInfoManager.create();
            this.dragController.setTooltipInfoManager(this.tooltipInfoManager);
        }
    }

    hide() {
        this.dragController.setDisplaySizeManager(null);
        this.dragController.setTooltipInfoManager(null);

        if (this.handleManager) this.handleManager.removeHandles();
        this.overlayManager.remove();

        if (this.displaySizeManager) this.displaySizeManager.remove();
        this.displaySizeManager = null;

        if (this.tooltipInfoManager) {
            this.tooltipInfoManager.remove();
            this.tooltipInfoManager = null;
        }

        this.img = null;
    }

    handleMousedown(evt) {
        if (!(evt.target instanceof HTMLElement)) return;
        this.dragController.startDragging(evt, this.img, evt.target);
    }

    destroy() {
        this.removeEventListeners();
        this.hide();
        this.dragController?.destroy();
        this.dragController = null;
    }
}
