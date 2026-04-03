import { Module as e } from "quill";
//#region src/constants.js
var t = "#AED2FF", n = "#687EFF", r = "#fff", i = {
	minWidth: 16,
	minHeight: 16,
	noSelectionClass: "no-selection",
	handleStyles: {
		position: "absolute",
		width: "15px",
		height: "15px",
		backgroundColor: t,
		border: `1px solid ${n}`
	},
	overlayStyles: {
		position: "absolute",
		boxSizing: "border-box",
		border: "1px dashed #777",
		zIndex: 8
	},
	positions: [
		{
			top: 0,
			left: 0,
			clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)"
		},
		{
			top: 0,
			right: 0,
			clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)"
		},
		{
			bottom: 0,
			left: 0,
			clipPath: "polygon(0% 100%, 100% 100%, 0% 0%)"
		},
		{
			bottom: 0,
			right: 0,
			clipPath: "polygon(100% 100%, 0% 100%, 100% 0%)"
		}
	],
	displaySizeStyles: {
		position: "absolute",
		fontSize: "12px",
		backgroundColor: t,
		color: r,
		padding: "2px 4px",
		borderRadius: "4px",
		userSelect: "none",
		pointerEvents: "none"
	},
	displaySizePositionStyles: {
		right: "20px",
		bottom: "5px",
		left: "auto"
	},
	tooltip: {
		iconStyles: {
			position: "absolute",
			top: "8px",
			right: "8px",
			width: "20px",
			height: "20px",
			background: t,
			color: r,
			borderRadius: "50%",
			textAlign: "center",
			lineHeight: "20px",
			fontSize: "14px",
			cursor: "pointer",
			userSelect: "none"
		},
		textStyles: {
			position: "absolute",
			background: t,
			color: r,
			padding: "6px 8px",
			borderRadius: "4px",
			display: "none",
			pointerEvents: "none",
			fontSize: "12px",
			whiteSpace: "pre"
		}
	}
}, a = class {
	constructor(e, t) {
		this.parent = e, this.styles = t, this.overlay = null;
	}
	create() {
		this.overlay = document.createElement("div"), Object.assign(this.overlay.style, this.styles), this.parent.appendChild(this.overlay);
	}
	remove() {
		this.overlay &&= (this.overlay.remove(), null);
	}
	reposition(e) {
		if (!this.overlay) return;
		let t = e.getBoundingClientRect(), n = this.overlay.offsetParent || this.parent, r = n.getBoundingClientRect();
		Object.assign(this.overlay.style, {
			left: `${t.left - r.left - 1 + n.scrollLeft}px`,
			top: `${t.top - r.top + n.scrollTop}px`,
			width: `${t.width}px`,
			height: `${t.height}px`
		});
	}
}, o = class {
	constructor(e, t, n, r) {
		this.overlay = e, this.positions = t, this.handleStyles = n, this.mousedownCallback = r, this.boxes = [];
	}
	createHandles() {
		this.positions.forEach((e) => {
			let t = document.createElement("div");
			Object.assign(t.style, this.handleStyles, e), t.style.clipPath = e.clipPath;
			let n = e.top !== void 0 && e.left !== void 0 || e.bottom !== void 0 && e.right !== void 0;
			t.style.cursor = n ? "nwse-resize" : "nesw-resize", t.addEventListener("mousedown", this.mousedownCallback, !1), t.addEventListener("touchstart", this.mousedownCallback, { passive: !1 }), this.overlay.appendChild(t), this.boxes.push(t);
		});
	}
	removeHandles() {
		this.boxes.forEach((e) => {
			e.removeEventListener("mousedown", this.mousedownCallback), e.removeEventListener("touchstart", this.mousedownCallback), e.onmousedown = null, e.ontouchstart = null, e.remove();
		}), this.boxes = [], this.overlay = null, this.positions = null, this.handleStyles = null, this.mousedownCallback = null;
	}
}, s = class {
	constructor(e, t, n, r, i) {
		this.minWidth = e, this.minHeight = t, this.overlayManager = n, this.displaySizeManager = r, this.tooltipInfoManager = i, this.img = null, this.dragBox = null, this.startX = 0, this.startY = 0, this.startWidth = 0, this.startHeight = 0, this.handleDrag = this.handleDrag.bind(this), this.handleMouseup = this.handleMouseup.bind(this);
	}
	setDisplaySizeManager(e) {
		this.displaySizeManager = e;
	}
	setTooltipInfoManager(e) {
		this.tooltipInfoManager = e;
	}
	addEventListeners() {
		document.addEventListener("mousemove", this.handleDrag), document.addEventListener("touchmove", this.handleDrag, { passive: !1 }), document.addEventListener("mouseup", this.handleMouseup, !0), document.addEventListener("touchend", this.handleMouseup, !0), document.addEventListener("touchcancel", this.handleMouseup, !0);
	}
	removeEventListeners() {
		document.removeEventListener("mousemove", this.handleDrag), document.removeEventListener("touchmove", this.handleDrag), document.removeEventListener("mouseup", this.handleMouseup, !0), document.removeEventListener("touchend", this.handleMouseup, !0), document.removeEventListener("touchcancel", this.handleMouseup, !0);
	}
	startDragging(e, t, n) {
		if (e.preventDefault(), this.img = t, this.dragBox = n, e.type === "touchstart") {
			if (!e.changedTouches.length) return;
			this.startX = e.changedTouches[0].clientX, this.startY = e.changedTouches[0].clientY;
		} else this.startX = e.clientX, this.startY = e.clientY;
		this.startWidth = t.width || t.naturalWidth, this.startHeight = t.height || t.naturalHeight, this.addEventListeners();
	}
	handleDrag(e) {
		if (!this.img) return;
		let t, n;
		if (e.type === "touchmove") {
			if (!e.changedTouches.length) return;
			t = e.changedTouches[0].clientX, n = e.changedTouches[0].clientY;
		} else t = e.clientX, n = e.clientY;
		let r = t - this.startX, i = n - this.startY, a = this.startHeight === 0 ? 1 : this.startWidth / this.startHeight, o = e.ctrlKey, s = e.shiftKey, c = e.altKey;
		if (o) {
			let e = this.startWidth + r, t = this.startHeight + i;
			e = Math.max(e, this.minWidth), t = Math.max(t, this.minHeight), this.img.width = Math.round(e), this.img.height = Math.round(t);
		} else if (s) {
			let e = this.startHeight + i;
			e = Math.max(e, this.minHeight), this.img.height = Math.round(e);
		} else if (c) {
			let e = this.startWidth + r;
			e = Math.max(e, this.minWidth), this.img.width = Math.round(e);
		} else {
			let e = Math.abs(r) > Math.abs(i) ? r : i, t = this.startWidth + e, n = t / a;
			t = Math.max(t, this.minWidth), n = Math.max(n, this.minHeight), this.img.width = Math.round(t), this.img.height = Math.round(n);
		}
		this.overlayManager && this.overlayManager.reposition(this.img), this.displaySizeManager && this.displaySizeManager.update(), this.tooltipInfoManager && this.tooltipInfoManager.update(), this.startX = t, this.startY = n, this.startWidth = this.img.offsetWidth, this.startHeight = this.img.offsetHeight;
	}
	handleMouseup() {
		this.removeEventListeners(), this.img = null, this.dragBox = null;
	}
	destroy() {
		this.removeEventListeners(), this.img = null, this.dragBox = null, this.overlayManager = null, this.displaySizeManager = null, this.tooltipInfoManager = null;
	}
}, c = class {
	constructor(e, t, n) {
		this.overlay = e, this.img = t, this.displaySizeStyles = n, this.display = null;
	}
	create() {
		this.display = document.createElement("div"), Object.assign(this.display.style, this.displaySizeStyles), this.overlay.appendChild(this.display), this.update();
	}
	update() {
		if (!this.display || !this.img) return;
		let e = this.img.offsetWidth, t = this.img.offsetHeight;
		this.display.textContent = `${e} × ${t}`;
		let n = this.display.getBoundingClientRect();
		e > 120 && t > 30 ? Object.assign(this.display.style, i.displaySizePositionStyles) : Object.assign(this.display.style, {
			right: `-${n.width + 4}px`,
			bottom: "0",
			left: "auto"
		});
	}
	remove() {
		this.display && (this.display.remove(), this.display = null, this.overlay = null, this.img = null);
	}
}, l = class {
	constructor(e) {
		this.overlay = e, this.icon = null, this.tooltip = null, this.handleMouseEnter = this.handleMouseEnter.bind(this), this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	create() {
		this.icon = document.createElement("div"), this.icon.textContent = "?", Object.assign(this.icon.style, i.tooltip.iconStyles), this.tooltip = document.createElement("div");
		let e = this.tooltip;
		[
			"Shift for vertical",
			"Ctrl for custom",
			"Alt for horizontal"
		].forEach((t) => {
			let n = document.createElement("span");
			n.textContent = t, n.style.display = "block", e.appendChild(n);
		}), Object.assign(this.tooltip.style, i.tooltip.textStyles), this.icon.addEventListener("mouseenter", this.handleMouseEnter), this.icon.addEventListener("mouseleave", this.handleMouseLeave), this.overlay.appendChild(this.icon), this.overlay.appendChild(this.tooltip), this.update();
	}
	handleMouseEnter() {
		this.tooltip && (this.tooltip.style.display = "block");
	}
	handleMouseLeave() {
		this.tooltip && (this.tooltip.style.display = "none");
	}
	update() {
		if (!this.icon || !this.tooltip) return;
		let e = this.icon.offsetTop + 25, t = this.icon.offsetLeft - 100;
		Object.assign(this.tooltip.style, {
			top: `${e}px`,
			left: `${t}px`
		});
	}
	remove() {
		!this.icon && !this.tooltip || (this.icon &&= (this.icon.removeEventListener("mouseenter", this.handleMouseEnter), this.icon.removeEventListener("mouseleave", this.handleMouseLeave), this.icon.remove(), null), this.tooltip &&= (this.tooltip.remove(), null), this.overlay = null);
	}
}, u = class {
	constructor(e, t) {
		this.options = t, this.img = null, this._showing = !1, this.overlayManager = new a(e, t.overlayStyles), this.dragController = new s(t.minWidth, t.minHeight, this.overlayManager, null, null), this.handleMousedown = this.handleMousedown.bind(this);
	}
	show(e) {
		this.img !== e && (!e || !(e instanceof HTMLImageElement) || (this._showing ||= (this._showing = !0, this.hide(), this.img = e, this.overlayManager?.overlay || this.overlayManager?.create(), this.handleManager = new o(this.overlayManager?.overlay, this.options.positions, this.options.handleStyles, this.handleMousedown), this.handleManager.createHandles(), this.overlayManager?.reposition(this.img), this.options.displaySize && (this.displaySizeManager = new c(this.overlayManager?.overlay, this.img, this.options.displaySizeStyles), this.displaySizeManager.create(), this.dragController?.setDisplaySizeManager(this.displaySizeManager)), this.options.helpIcon && (this.tooltipInfoManager = new l(this.overlayManager?.overlay), this.tooltipInfoManager.create(), this.dragController?.setTooltipInfoManager(this.tooltipInfoManager)), !1)));
	}
	hide() {
		this.dragController?.setDisplaySizeManager(null), this.dragController?.setTooltipInfoManager(null), this.handleManager && this.handleManager.removeHandles(), this.overlayManager?.remove(), this.displaySizeManager && this.displaySizeManager.remove(), this.displaySizeManager = null, this.tooltipInfoManager &&= (this.tooltipInfoManager.remove(), null), this.img = null;
	}
	update() {
		this.overlayManager?.reposition(this.img), this.displaySizeManager && this.displaySizeManager.update(), this.tooltipInfoManager && this.tooltipInfoManager.update();
	}
	handleMousedown(e) {
		e.target instanceof HTMLElement && this.dragController?.startDragging(e, this.img, e.target);
	}
	destroy() {
		this.hide(), this.dragController?.destroy(), this.dragController = null, this.overlayManager = null;
	}
};
(() => {
	if (typeof document > "u") return;
	let e = document.createElement("style");
	e.textContent = ".no-selection::selection { background: transparent !important; }", document.head.appendChild(e);
})();
var d = class extends e {
	constructor(e, t = {}) {
		super(e, t), this.quill = e, this.options = {
			helpIcon: !0,
			displaySize: !0,
			styleSelection: !0,
			...i,
			...t,
			overlayStyles: {
				...i.overlayStyles,
				...t.overlayStyles
			},
			handleStyles: {
				...i.handleStyles,
				...t.handleStyles
			},
			displaySizeStyles: {
				...i.displaySizeStyles,
				...t.displaySizeStyles
			}
		};
		let n = this.quill.root.parentNode;
		if (!n) throw Error("ImageResize: quill.root has no parentNode");
		this.uiController = new u(n, this.options), this.bindHandlers(), this.addEventListeners();
	}
	bindHandlers() {
		this.handleClick = this.handleClick.bind(this), this.handleSelectionChange = this.handleSelectionChange.bind(this), this.handleTextChange = this.handleTextChange.bind(this);
	}
	addEventListeners() {
		this.quill.root.addEventListener("click", this.handleClick), this.quill.on("selection-change", this.handleSelectionChange), this.quill.on("text-change", this.handleTextChange);
	}
	removeEventListeners() {
		this.quill.root.removeEventListener("click", this.handleClick), this.quill.off("selection-change", this.handleSelectionChange), this.quill.off("text-change", this.handleTextChange);
	}
	handleClick(e) {
		if (e.target instanceof HTMLImageElement) {
			let t = this.quill.constructor.find(e.target);
			t && (this.quill.setSelection(t.offset(this.quill.scroll), t.length(), "silent"), this.show(e.target), this.disableTextSelection());
		}
	}
	handleSelectionChange(e) {
		if (!e) return this.hide();
		let [t] = this.quill.scroll.descendant(this.quill.constructor.import("formats/image"), e.index);
		t && t.domNode instanceof HTMLImageElement ? (this.disableTextSelection(), this.show(t.domNode)) : (this.enableTextSelection(), this.hide());
	}
	handleTextChange() {
		let e = this.uiController?.img;
		e && (e && !this.quill.root.contains(e) ? (this.hide(), this.enableTextSelection()) : this.uiController?.update());
	}
	disableTextSelection() {
		this.options.styleSelection && this.quill.root.classList.add(this.options.noSelectionClass);
	}
	enableTextSelection() {
		this.options.styleSelection && this.quill.root.classList.remove(this.options.noSelectionClass);
	}
	show(e) {
		this.uiController?.show(e);
	}
	hide() {
		this.uiController?.hide();
	}
	destroy() {
		this.removeEventListeners(), this.uiController?.destroy(), this.uiController = null, this.quill = null;
	}
};
//#endregion
export { d as default };
