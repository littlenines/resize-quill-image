import { DEFAULT_OPTIONS } from "../constants";

export class DisplaySizeManager {
    constructor(overlay, img) {
        this.overlay = overlay;
        this.img = img;
        this.display = null;
    }

    create() {
        this.display = document.createElement("div");
        Object.assign(this.display.style, DEFAULT_OPTIONS.displaySizeStyles);
        this.overlay.appendChild(this.display);
        this.update();
    }

    update() {
        if (!this.display || !this.img) return;

        const width = this.img.offsetWidth;
        const height = this.img.offsetHeight;

        this.display.innerHTML = `${width} × ${height}`;

        const dispRect = this.display.getBoundingClientRect();

        if (width > 120 && height > 30) {
            Object.assign(this.display.style, DEFAULT_OPTIONS.displaySizePositionStyles);
        } else {
            Object.assign(this.display.style, {
                right: `-${dispRect.width + 4}px`,
                bottom: `0`,
                left: 'auto',
            });
        }
    }

    remove() {
        if (this.display) {
            this.display.remove();
            this.display = null;
            this.overlay = null;
            this.img = null;
        }
    }
}
