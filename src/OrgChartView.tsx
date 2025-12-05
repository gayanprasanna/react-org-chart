import OrgChart from "./components/OrgChart";
const data = {
  name: "John Silva",
  role: "CEO",
  photo: "/photos/ceo.jpg",
  children: [
    {
      name: "Amanda Perera",
      role: "CTO",
      photo: "/photos/cto.jpg",
      children: [
        {
          name: "Nuwan",
          role: "Senior Engineer",
          photo: "/photos/eng1.jpg",
        },
        {
          name: "Kasun",
          role: "Engineer",
          photo: "/photos/eng2.jpg",
        },
      ],
    },
    {
      name: "Ruwan",
      role: "CFO",
      photo: "/photos/cfo.jpg",
    },
  ],
};
export const OrgChartView = () => {
  return (
    <div>
      <h1>Org Chart</h1>
      <OrgChart data={data} />
    </div>
  );
};
