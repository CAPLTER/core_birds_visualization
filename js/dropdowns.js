export function populateDropdowns(data) {
    const speciesSet = new Set();
  
    data.forEach(row => {
      if (row.common_name && row.survey_date) {
        speciesSet.add(row.common_name);
      }
    });
  
    const speciesSelect = document.getElementById("species-select");
  
    [...speciesSet].sort().forEach(species => {
      const option = document.createElement("option");
      option.value = species;
      option.textContent = species;
      speciesSelect.appendChild(option);
    });
}