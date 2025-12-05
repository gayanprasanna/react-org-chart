import React, { useState } from "react";

interface NodeCardProps {
  node: {
    data: {
      name: string;
      role: string;
      photo: string;
    };
  };
  onToggle: () => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, onToggle }) => {
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

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        width: 140,
        padding: "12px",
        borderRadius: "12px",
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        cursor: "pointer",
        textAlign: "center",
        fontFamily: "sans-serif",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      }}
    >
      {!imageError && photo ? (
        <img
          src={photo}
          alt={name}
          onError={handleImageError}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            marginBottom: "8px",
            objectFit: "cover",
            backgroundColor: "#e0e0e0",
          }}
        />
      ) : (
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            marginBottom: "8px",
            backgroundColor: "#1976d2",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            fontWeight: "bold",
            margin: "0 auto 8px auto",
          }}
        >
          {getInitials(name)}
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
        {name}
      </div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{role}</div>
    </div>
  );
};

export default NodeCard;
