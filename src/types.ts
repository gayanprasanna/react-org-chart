export interface OrgChartTheme {
  // Node Card Styling
  nodeCard: {
    width: number;
    height: number;
    padding: number;
    borderRadius: number;
    backgroundColor: string;
    boxShadow: string;
    boxShadowHover: string;
    fontFamily: string;
  };

  // Avatar/Photo Styling
  avatar: {
    size: number;
    borderRadius: string;
    backgroundColor: string;
    marginBottom: number;
  };

  // Initials (when photo fails)
  initials: {
    backgroundColor: string;
    color: string;
    fontSize: number;
    fontWeight: string | number;
  };

  // Text Styling
  text: {
    name: {
      fontSize: number;
      fontWeight: string | number;
      color: string;
      marginBottom: number;
    };
    role: {
      fontSize: number;
      color: string;
      opacity: number;
    };
  };

  // Link/Connection Styling
  links: {
    strokeColor: string;
    strokeWidth: number;
    verticalSpacing: number;
  };

  // Container Styling
  container: {
    backgroundColor: string;
    width: number | string;
    height: number;
  };

  // Layout Spacing
  layout: {
    verticalSpacing: number; // dx - spacing between levels
    horizontalSpacing: number; // dy - spacing between siblings
  };
}

export const defaultTheme: OrgChartTheme = {
  nodeCard: {
    width: 140,
    height: 140,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    boxShadowHover: "0 4px 12px rgba(0,0,0,0.2)",
    fontFamily: "sans-serif",
  },
  avatar: {
    size: 60,
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  initials: {
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    name: {
      fontSize: 14,
      fontWeight: 600,
      color: "inherit",
      marginBottom: 4,
    },
    role: {
      fontSize: 12,
      color: "inherit",
      opacity: 0.7,
    },
  },
  links: {
    strokeColor: "#999",
    strokeWidth: 2,
    verticalSpacing: 20,
  },
  container: {
    backgroundColor: "#f8f9fa",
    width: 800,
    height: 700,
  },
  layout: {
    verticalSpacing: 200,
    horizontalSpacing: 200,
  },
};
