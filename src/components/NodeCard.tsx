import React, { useState } from "react";
import { OrgChartTheme } from "../types";

interface NodeCardProps {
  node: {
    data: {
      name: string;
      role: string;
      photo: string;
    };
  };
  onToggle: () => void;
  theme: OrgChartTheme;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, onToggle, theme }) => {
  const { name, role, photo } = node.data;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const { nodeCard, avatar, initials, text } = theme;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        width: nodeCard.width,
        padding: `${nodeCard.padding}px`,
        borderRadius: `${nodeCard.borderRadius}px`,
        background: nodeCard.backgroundColor,
        boxShadow: nodeCard.boxShadow,
        cursor: "pointer",
        textAlign: "center",
        fontFamily: nodeCard.fontFamily,
        transition: "transform 0.2s, box-shadow 0.2s",
        boxSizing: "border-box",
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
          alt={name}
          onError={handleImageError}
          style={{
            width: avatar.size,
            height: avatar.size,
            borderRadius: avatar.borderRadius,
            marginBottom: `${avatar.marginBottom}px`,
            objectFit: "cover",
            backgroundColor: avatar.backgroundColor,
          }}
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
          {getInitials(name)}
        </div>
      )}
      <div
        style={{
          fontWeight: text.name.fontWeight,
          fontSize: `${text.name.fontSize}px`,
          marginBottom: `${text.name.marginBottom}px`,
          color: text.name.color,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: `${text.role.fontSize}px`,
          opacity: text.role.opacity,
          color: text.role.color,
        }}
      >
        {role}
      </div>
    </div>
  );
};

export default NodeCard;
