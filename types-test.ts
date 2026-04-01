import type { ImageResizeOptions, HandlePosition, TooltipOptions, CSSStyles } from 'resize-quill-image';

const styles: CSSStyles = { fontSize: 12, background: '#fff' };

const tooltip: TooltipOptions = {
  iconStyles: { background: '#AED2FF', borderRadius: '50%' },
  textStyles: { fontSize: 12, padding: '4px 8px' },
};

const positions: HandlePosition[] = [
  { top: 0, left: 0, clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' },
  { top: 0, right: 0 },
  { bottom: 0, left: 0 },
  { bottom: 0, right: 0 },
];

const options: ImageResizeOptions = {
  helpIcon: true,
  displaySize: true,
  styleSelection: true,
  noSelectionClass: 'no-selection',
  minWidth: 20,
  minHeight: 20,
  overlayStyles: styles,
  handleStyles: { width: 15, height: 15 },
  displaySizeStyles: { fontSize: 12 },
  displaySizePositionStyles: { bottom: 5, right: 20 },
  tooltip,
  positions,
};
