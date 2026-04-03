import type { ImageResizeOptions, HandlePosition, CSSStyles } from 'resize-quill-image';

const styles: CSSStyles = { fontSize: 12, background: '#fff' };

const positions: HandlePosition[] = [
  { top: 0, left: 0, clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' },
  { top: 0, right: 0 },
  { bottom: 0, left: 0 },
  { bottom: 0, right: 0 },
];

const _options: ImageResizeOptions = {
  helpIcon: true,
  displaySize: true,
  styleSelection: true,
  noSelectionClass: 'no-selection',
  minWidth: 20,
  minHeight: 20,
  overlayStyles: styles,
  handleStyles: { width: 15, height: 15 },
  displaySizeStyles: { fontSize: 12 },
  positions,
};
