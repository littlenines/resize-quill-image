const COLOR_PRIMARY = "#AED2FF";
const COLOR_BORDER = "#687EFF";
const COLOR_TEXT = "#fff";

export const DEFAULT_OPTIONS = {
  minWidth: 16,
  minHeight: 16,
  noSelectionClass: 'no-selection',

  handleStyles: {
    position: "absolute",
    width: "15px",
    height: "15px",
    backgroundColor: COLOR_PRIMARY,
    border: `1px solid ${COLOR_BORDER}`,
  },

  overlayStyles: {
    position: "absolute",
    boxSizing: "border-box",
    border: "1px dashed #777",
    zIndex: 8,
  },

  positions: [
    { top: 0, left: 0, clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)" },
    { top: 0, right: 0, clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)" },
    { bottom: 0, left: 0, clipPath: "polygon(0% 100%, 100% 100%, 0% 0%)" },
    { bottom: 0, right: 0, clipPath: "polygon(100% 100%, 0% 100%, 100% 0%)" },
  ],

  displaySizeStyles: {
    position: "absolute",
    fontSize: "12px",
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_TEXT,
    padding: "2px 4px",
    borderRadius: "4px",
    userSelect: "none",
    pointerEvents: "none",
  },

  displaySizePositionStyles: {
    right: "20px",
    bottom: "5px",
    left: "auto",
  },

  tooltip: {
    iconStyles: {
      position: "absolute",
      top: "8px",
      right: "8px",
      width: "20px",
      height: "20px",
      background: COLOR_PRIMARY,
      color: COLOR_TEXT,
      borderRadius: "50%",
      textAlign: "center",
      lineHeight: "20px",
      fontSize: "14px",
      cursor: "pointer",
      userSelect: "none",
    },

    textStyles: {
      position: "absolute",
      background: COLOR_PRIMARY,
      color: COLOR_TEXT,
      padding: "6px 8px",
      borderRadius: "4px",
      display: "none",
      pointerEvents: 'none',
      fontSize: "12px",
      whiteSpace: "pre",
    },
  },
};
