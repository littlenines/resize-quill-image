import { DEFAULT_OPTIONS } from "../constants";

export class TooltipInfoManager {
  constructor(overlay) {
    this.overlay = overlay;
    this.icon = null;
    this.tooltip = null;

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  create() {
    this.icon = document.createElement("div");
    this.icon.textContent = "?";
    Object.assign(this.icon.style, DEFAULT_OPTIONS.tooltip.iconStyles);

    this.tooltip = document.createElement("div");
    this.tooltip.textContent = "Shift for vertical\nCtrl for custom\nAlt for horizontal";
    Object.assign(this.tooltip.style, {...DEFAULT_OPTIONS.tooltip.textStyles,});

    this.icon.addEventListener("mouseenter", this.handleMouseEnter);
    this.icon.addEventListener("mouseleave", this.handleMouseLeave);

    this.overlay.appendChild(this.icon);
    this.overlay.appendChild(this.tooltip);

    this.update();
  }

  handleMouseEnter() {
    if (this.tooltip) this.tooltip.style.display = "block";
  }

  handleMouseLeave() {
    if (this.tooltip) this.tooltip.style.display = "none";
  }

  update() {
    if (!this.icon || !this.tooltip) return;
    
    const iconRect = this.icon.getBoundingClientRect();

    const top = this.icon.offsetTop + 25;
    const left = iconRect.left - 100;

    Object.assign(this.tooltip.style, {
      top: `${top}px`,
      left: `${left}px`,
    });
  }

  remove() {
    if (!this.icon && !this.tooltip) return;

    if (this.icon) {
      this.icon.removeEventListener("mouseenter", this.handleMouseEnter);
      this.icon.removeEventListener("mouseleave", this.handleMouseLeave);
      this.icon.remove();
      this.icon = null;
    }

    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
    this.overlay = null;
  }
}
