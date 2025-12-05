export const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      style={{
        padding: "12px 20px",
        background: "#b6b8ccff",
        color: "white",
        borderRadius: "6px",
      }}
    >
      {children}
    </button>
  );
};
