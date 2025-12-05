import React from "react";

export interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  zoomInLabel?: string;
  zoomOutLabel?: string;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  style,
  buttonStyle,
  zoomInLabel = "+",
  zoomOutLabel = "−",
}) => {
  const defaultStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    ...style,
  };

  const defaultButtonStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    ...buttonStyle,
  };

  return (
    <div style={defaultStyle}>
      <button
        onClick={onZoomIn}
        style={defaultButtonStyle}
        title="Zoom In"
      >
        {zoomInLabel}
      </button>
      <button
        onClick={onZoomOut}
        style={defaultButtonStyle}
        title="Zoom Out"
      >
        {zoomOutLabel}
      </button>
    </div>
  );
};

export default ZoomControls;

