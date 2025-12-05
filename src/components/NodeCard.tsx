import React, { useState } from "react";
import {
  OrgChartTheme,
  OrgChartFieldMapping,
  defaultFieldMapping,
} from "../types";

interface NodeCardProps {
  node: {
    data: any;
  };
  onToggle: () => void;
  onClick?: (node: any) => void;
  theme: OrgChartTheme;
  fieldMapping?: Partial<OrgChartFieldMapping>;
  isHighlighted?: boolean;
}

const NodeCard: React.FC<NodeCardProps> = ({
  node,
  onToggle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick: _onClick,
  theme,
  fieldMapping,
  isHighlighted = false,
}) => {
  const fields = { ...defaultFieldMapping, ...fieldMapping };
  const title = node.data[fields.title] || "";
  const subtitle = node.data[fields.subtitle] || "";
  const photo = node.data[fields.photo] || "";
  const [imageError, setImageError] = useState(false);

  // Check if photo is a base64 image
  const isBase64Image =
    photo &&
    (photo.startsWith("data:image/") ||
      photo.startsWith("data:Image/") ||
      /^data:image\/[a-z]+;base64,/.test(photo));

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (text: string) => {
    if (!text) return "";
    return text
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Call onToggle to expand/collapse
    onToggle();
  };

  const { nodeCard, avatar, initials, text } = theme;

  return (
    <div
      onClick={handleClick}
      style={{
        width: nodeCard.width,
        minHeight: nodeCard.height,
        padding: `${nodeCard.padding}px`,
        borderRadius: `${nodeCard.borderRadius}px`,
        background: nodeCard.backgroundColor,
        boxShadow: nodeCard.boxShadow,
        cursor: "pointer",
        textAlign: "center",
        fontFamily: nodeCard.fontFamily,
        transition: "transform 0.2s, box-shadow 0.2s, border 0.2s",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        border: isHighlighted
          ? `${theme.highlight.borderWidth}px solid ${theme.highlight.borderColor}`
          : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = nodeCard.boxShadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = nodeCard.boxShadow;
      }}
    >
      {!imageError && photo ? (
        <img
          src={photo}
          alt={title}
          onError={handleImageError}
          onLoad={() => {
            // Reset error state if image loads successfully (for retries)
            setImageError(false);
          }}
          style={{
            width: avatar.size,
            height: avatar.size,
            borderRadius: avatar.borderRadius,
            margin: "0 auto",
            marginBottom: `${avatar.marginBottom}px`,
            objectFit: "cover",
            backgroundColor: avatar.backgroundColor,
            // Ensure base64 images display correctly
            display: "block",
          }}
          // Only set crossOrigin for external URLs, not for base64 or data URLs
          crossOrigin={isBase64Image ? undefined : "anonymous"}
        />
      ) : (
        <div
          style={{
            width: avatar.size,
            height: avatar.size,
            borderRadius: avatar.borderRadius,
            marginBottom: `${avatar.marginBottom}px`,
            backgroundColor: initials.backgroundColor,
            color: initials.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${initials.fontSize}px`,
            fontWeight: initials.fontWeight,
            margin: `0 auto ${avatar.marginBottom}px auto`,
          }}
        >
          {getInitials(title)}
        </div>
      )}
      <div
        style={{
          fontWeight: text.name.fontWeight,
          fontSize: `${text.name.fontSize}px`,
          marginBottom: `${text.name.marginBottom}px`,
          color: text.name.color,
          lineHeight: "1.3",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: `${text.role.fontSize}px`,
          opacity: text.role.opacity,
          color: text.role.color,
          lineHeight: "1.4",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          hyphens: "auto",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export default NodeCard;
