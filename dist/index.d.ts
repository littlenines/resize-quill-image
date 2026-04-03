import Quill, { Module } from 'quill';

export type CSSStyles = Record<string, string | number>;

export interface HandlePosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  clipPath?: string;
}

export interface TooltipOptions {
  iconStyles?: CSSStyles;
  textStyles?: CSSStyles;
}

export interface ImageResizeOptions {
  helpIcon?: boolean;
  displaySize?: boolean;
  styleSelection?: boolean;
  noSelectionClass?: string;
  minWidth?: number;
  minHeight?: number;
  overlayStyles?: CSSStyles;
  handleStyles?: CSSStyles;
  displaySizeStyles?: CSSStyles;
  displaySizePositionStyles?: CSSStyles;
  tooltip?: TooltipOptions;
  positions?: HandlePosition[];
}

declare class ImageResize extends Module<ImageResizeOptions> {
  constructor(quill: Quill, options?: ImageResizeOptions);
  show(img: HTMLImageElement): void;
  hide(): void;
  destroy(): void;
}

export default ImageResize;
