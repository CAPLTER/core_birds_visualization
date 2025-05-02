import { loadCSV } from "./fetchData.js";
import { populateDropdowns } from "./dropdowns.js";

let globalData = [];

function renderBarChart(species) {
  const allYearsSet = new Set();
  globalData.forEach(row => {
    const year = new Date(row.survey_date).getFullYear();
    if (!isNaN(year)) allYearsSet.add(year);
  });

  const allYears = [...allYearsSet].sort((a, b) => a - b);

  const filtered = globalData.filter(row => row.common_name === species);

  const countByYear = {};
  filtered.forEach(row => {
    const year = new Date(row.survey_date).getFullYear();
    const count = parseInt(row.bird_count) || 0; 

    if (!isNaN(year)) {
      countByYear[year] = (countByYear[year] || 0) + count;
    }
  });

  const x = allYears;
  const y = allYears.map(year => countByYear[year] || 0);

  const trace = {
    x,
    y,
    type: "bar",
    marker: { color: "#3498db" }
  };

  const layout = {
    title: {
      text: `Total Bird Counts for<br><b>"${species}"</b> Across Years`,
      font: { size: 18 },
      xanchor: "center",
      x: 0.5
    },
    xaxis: {
      title: "Years",
      tickmode: "array",
      tickvals: x,
      ticktext: x,
      tickangle: -45
    },
    yaxis: {
      title: "Bird Count"
    },
    margin: {
      t: 70,
      b: 120,
      l: 50,
      r: 30
    },
    bargap: 0.3
  };  

  const config = {
    displayModeBar: true,
    modeBarButtons: [['toImage']],
    displaylogo: false,
    responsive: true
  };

  Plotly.newPlot("bar-chart", [trace], layout, config);
}

document.addEventListener("DOMContentLoaded", () => {
  loadCSV("https://caplter-birds-datasets.s3.us-west-1.amazonaws.com/cleaned_observations.csv", function(data) {
    globalData = data;

    populateDropdowns(data);

    const speciesSelect = document.getElementById("species-select");

    renderBarChart(speciesSelect.value);

    speciesSelect.addEventListener("change", () => {
      renderBarChart(speciesSelect.value);
    });
  });
});