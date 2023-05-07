import React, { useState, useEffect } from "react";
import Map from "./Map";
import { Line } from "react-chartjs-2";
import RiskOverTimeGraph from './RiskOverTimeGraph';
import { Chart } from 'chart.js/auto';

import DataTable from "./DataTable";
// import LineChart from "./line-chart"


function App() {
  const [decade, setDecade] = useState("2030");
  const [locations, setLocations] = useState([]);
  const [data, setData] = useState([]);
  const [location, setLocation] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  //  const categories = [...new Set(data.map((d) => d["Business Category"]))];
  useEffect(() => {
    const decadeLocations = data.filter((d) => d.Year >= parseInt(decade) && d.Year < parseInt(decade) + 10);
    setLocations(decadeLocations);
  }, [data, decade]);

  useEffect(() => {
    const filtered = data.filter(risk => {
      if (selectedAsset && ((selectedAsset == "all") || risk["Asset Name"] == selectedAsset)) {
        return true;
      }
      if (selectedCategory && ((selectedCategory == "all") || risk["Business Category"] == selectedCategory)) {
        return true;
      }
      return false;
    }).filter(risk => {
      if (location[0] && location[1]) {
        if (risk.Lat == parseFloat(location[0]) && risk.Long == parseFloat(location[1]))
          return true;
        else return false;
      }
      return true;
    });
    setRiskData(filtered);
  }, [data, location, selectedAsset, selectedCategory])

  // Fetch the risk data when the component mounts
  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setData(data); setRiskData(data);
      })
      .catch(error => console.error(error));
  }, []);

  // Handler for selecting a location
  function handleLocationChange(event) {
    const { value } = event.target;
    const [lat, long] = value.split(',');
    setLocation([lat, long]);
  }

  // Handler for selecting an asset
  function handleAssetChange(event) {
    const { value } = event.target;
    setSelectedAsset(value);
  }

  // Handler for selecting a business category
  function handleCategoryChange(event) {
    const { value } = event.target;
    setSelectedCategory(value);
  }


  const setSelectedLocation = (location) => {
    // Filter the risk data based on the selected filters
    setLocation(location);
  }

  return (
    <div className="App">
      <h1>Climate Risk Map</h1>


      <div>
        <label htmlFor="decade-select">Select Decade:</label>
        <select
          id="decade-select"
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
        >
          <option value="2030">2030s</option>
          <option value="2040">2040s</option>
          <option value="2050">2050s</option>
          <option value="2060">2060s</option>
          <option value="2070">2070s</option>
        </select>

        <label htmlFor="asset-select">Select Asset:</label>
        <select
          id="asset-select"
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
        >
          <option value="all">All</option>
          {riskData ? riskData.map(a => a["Asset Name"]).map(a => <option value={a}>{a}</option>) : ''}
        </select>

        <label htmlFor="category-select">Select Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          {riskData ? [... new Set(riskData.map(r => r["Business Category"]))].map(c => <option value={c}>{c}</option>) : ''}
        </select>
      </div>

      {riskData ?
        <Line height={"100px"} width={"500px"}
          data={{
            labels: [... new Set(riskData.map(r => r.Year))].sort(),
            datasets: [
              {
                label: "Average Risk Rating",
                data: Object.values(riskData.sort((a, b) => a.Year - b.Year).reduce((pv, cv) => {
                  let year = cv.Year;
                  if (pv[year] !== undefined) {
                    pv[year] += cv["Risk Rating"];
                  } else {
                    pv[year] = 0;
                  }
                  return pv;
                }, {})),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
              }
            ]
          }}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }}
        />
        : ''}



      <Map locations={locations} setSelectedLocation={setSelectedLocation} />
      {/* <DataTable data={locations} /> */}
    </div>
  );
}

export default App;
