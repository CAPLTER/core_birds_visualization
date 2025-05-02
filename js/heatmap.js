import { loadCSV } from "./fetchData.js";

let observationData = [];
let locationMap = new Map();
let map, heatLayer;

function createMap() {
  map = L.map("heatmap-map").setView([33.4484, -112.0740], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: false
  }).addTo(map);
}

function populateHeatmapDropdowns(data) {
  const speciesSet = new Set();
  const yearSet = new Set();

  data.forEach(row => {
    if (row.common_name) speciesSet.add(row.common_name);
    if (row.survey_date) {
      const year = new Date(row.survey_date).getFullYear();
      yearSet.add(year);
    }
  });

  const speciesSelect = document.getElementById("heatmap-species-select");
  const yearSelect = document.getElementById("heatmap-year-select");

  [...speciesSet].sort().forEach(species => {
    const opt = document.createElement("option");
    opt.value = species;
    opt.textContent = species;
    speciesSelect.appendChild(opt);
  });

  const allYearsOption = document.createElement("option");
  allYearsOption.value = "all";
  allYearsOption.textContent = "All Years (2000–2024)";
  yearSelect.appendChild(allYearsOption);

  [...yearSet].sort().forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearSelect.appendChild(opt);
  });
}

function getGradientColor(value, min, max) {
  const percent = (value - min) / (max - min);

  if (percent <= 0.4) {
    const ratio = percent / 0.4;
    return interpolateColor("#ffffcc", "#a1d99b", ratio);
  } else {
    const ratio = (percent - 0.4) / 0.4;
    return interpolateColor("#a1d99b", "#006837", ratio);
  }
}

function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  const stripped = hex.replace("#", "");
  return {
    r: parseInt(stripped.substring(0, 2), 16),
    g: parseInt(stripped.substring(2, 4), 16),
    b: parseInt(stripped.substring(4, 6), 16),
  };
}

function renderHeatmap(species, year) {
  if (heatLayer) map.removeLayer(heatLayer);

  const filtered = observationData.filter(row => {
    let rowYear = NaN;
    if (row.survey_date) {
      const parsed = new Date(row.survey_date);
      if (!isNaN(parsed)) rowYear = parsed.getFullYear();
    }

    const isMatchingSpecies = row.common_name?.trim() === species.trim();
    const isMatchingYear = year === "all" || rowYear === parseInt(year);
    const hasSiteCode = !!row.site_code;

    return isMatchingSpecies && isMatchingYear && hasSiteCode;
  });

  const countMap = new Map();

  filtered.forEach(row => {
    const site = row.site_code.trim();
    const count = parseInt(row.bird_count) || 0;
    countMap.set(site, (countMap.get(site) || 0) + count);
  });

  heatLayer = L.layerGroup();

  const counts = Array.from(countMap.values());
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  for (let [siteCode, totalCount] of countMap.entries()) {
    const loc = locationMap.get(siteCode);
    if (loc && !isNaN(loc.lat) && !isNaN(loc.long)) {
      const circle = L.circleMarker([loc.lat, loc.long], {
        radius: Math.sqrt(totalCount) * 2,
        fillColor: getGradientColor(totalCount, minCount, maxCount),
        color: "#444",
        weight: 1,
        fillOpacity: 0.7
      }).bindTooltip(`Bird Count: ${totalCount}`, { direction: "top" });

      heatLayer.addLayer(circle);
    }
  }

  heatLayer.addTo(map);
  console.log("Circle-based heatmap rendered with points:", heatLayer.getLayers().length);
}

function initHeatmap() {
  createMap();

  loadCSV("https://caplter-birds-datasets.s3.us-west-1.amazonaws.com/cleaned_survey_locations.csv", locData => {
    locData.forEach(row => {
      locationMap.set(row.site_code.trim(), {
        lat: parseFloat(row.lat),
        long: parseFloat(row.long)
      });
    });

    loadCSV("https://caplter-birds-datasets.s3.us-west-1.amazonaws.com/cleaned_observations.csv", obsData => {
      observationData = obsData;

      populateHeatmapDropdowns(obsData);

      const speciesSelect = document.getElementById("heatmap-species-select");
      const yearSelect = document.getElementById("heatmap-year-select");

      renderHeatmap(speciesSelect.value, yearSelect.value);

      speciesSelect.addEventListener("change", () => {
        renderHeatmap(speciesSelect.value, yearSelect.value);
      });

      yearSelect.addEventListener("change", () => {
        renderHeatmap(speciesSelect.value, yearSelect.value);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", initHeatmap);