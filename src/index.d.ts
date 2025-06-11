declare module 'resize-quill-image' {
  import { Module } from 'quill';

  interface ImageResizeOptions {
    helpIcon?: boolean;
    displaySize?: boolean;
    styleSelection?: boolean;
    noSelectionClass?: string;
    minWidth?: number;
    minHeight?: number;
    overlayStyles?: Record<string, any>;
    handleStyles?: Record<string, any>;
    positions?: Array<{
      top?: number;
      left?: number;
      right?: number;
      bottom?: number;
      clipPath?: string;
    }>;
  }

  export default class ImageResize extends Module {
    constructor(quill: any, options?: ImageResizeOptions);
    destroy(): void;
  }
}