import OrgChart from "./components/OrgChart";
import orgData from "./mockData/org-data";

export const OrgChartView = () => {
  return (
    <div>
      <h1>Org Chart</h1>
      <OrgChart data={orgData} />
    </div>
  );
};
