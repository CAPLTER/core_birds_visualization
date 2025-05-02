export function populateDropdowns(data) {
  // Create a Set to store unique species names
  const speciesSet = new Set();

  // Populate Set with species from data, ensuring valid entries
  data.forEach(row => {
    if (row.common_name && row.survey_date) {
      speciesSet.add(row.common_name);
    }
  });

  // Get DOM element for species dropdown
  const speciesSelect = document.getElementById("species-select");

  // Sort species alphabetically and create options for dropdown
  [...speciesSet].sort().forEach(species => {
    const option = document.createElement("option");
    option.value = species;
    option.textContent = species;
    speciesSelect.appendChild(option);
  });
}