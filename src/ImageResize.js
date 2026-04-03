import { Module } from "quill";
import { DEFAULT_OPTIONS } from "./constants.js";
import { ResizeUIController } from "./managers/ResizeUIController.js";

const injectCSS = () => {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = '.no-selection::selection { background: transparent !important; }';
    document.head.appendChild(style);
};

injectCSS();

export default class ImageResize extends Module {
    constructor(quill, options = {}) {
        super(quill, options);
        this.quill = quill;
        this.options = {
            helpIcon: true,
            displaySize: true,
            styleSelection: true,
            ...DEFAULT_OPTIONS,
            ...options,
            overlayStyles: { ...DEFAULT_OPTIONS.overlayStyles, ...options.overlayStyles },
            handleStyles: { ...DEFAULT_OPTIONS.handleStyles, ...options.handleStyles },
            displaySizeStyles: { ...DEFAULT_OPTIONS.displaySizeStyles, ...options.displaySizeStyles },
        };

        const rootParent = this.quill.root.parentNode;
        if (!rootParent) throw new Error('ImageResize: quill.root has no parentNode');

        /** @type {ResizeUIController | null} */
        this.uiController = new ResizeUIController(rootParent, this.options);

        this.bindHandlers();
        this.addEventListeners();
    }

    bindHandlers() {
        this.handleClick = this.handleClick.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
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
        if (evt.target instanceof HTMLImageElement) {
            const blot = this.quill.constructor.find(evt.target);
            if (blot) {
                this.quill.setSelection(blot.offset(this.quill.scroll), blot.length(), 'silent');
                this.show(evt.target);
                this.disableTextSelection();
            }
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

    handleTextChange() {
        const img = this.uiController?.img;
        if (!img) return;

        if (img && !this.quill.root.contains(img)) {
            this.hide();
            this.enableTextSelection();
        } else {
            this.uiController?.update();
        }
    }

    disableTextSelection() {
        if (this.options.styleSelection) this.quill.root.classList.add(this.options.noSelectionClass);
    }

    enableTextSelection() {
        if (this.options.styleSelection) this.quill.root.classList.remove(this.options.noSelectionClass);
    }

    show(img) {
        this.uiController?.show(img);
    }

    hide() {
        this.uiController?.hide();
    }

    destroy() {
        this.removeEventListeners();
        this.uiController?.destroy();
        this.uiController = null;
        this.quill = null;
    }
}
