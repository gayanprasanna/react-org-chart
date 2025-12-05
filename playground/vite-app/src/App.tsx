import { useState } from "react";
import "./App.css";
import { OrgChartView } from "react-org-chart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <OrgChartView></OrgChartView>
    </>
  );
}

export default App;
