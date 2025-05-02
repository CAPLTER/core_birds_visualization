document.addEventListener('DOMContentLoaded', () => {
  const speciesSelect = document.getElementById('species-select');
  const speciesInfo = document.getElementById('species-info');

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async function fetchSpeciesInfo(speciesName) {
    try {
      const cleanedSpeciesName = speciesName.replace(/[^a-zA-Z\s-']/g, '').trim();

      // Convert to title case to match Wikipedia conventions
      const titleCaseSpeciesName = toTitleCase(cleanedSpeciesName);
      
      // Encode the species name for the URL
      const encodedSpeciesName = encodeURIComponent(titleCaseSpeciesName);
      
      // Construct the Wikipedia API URL with redirect handling
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodedSpeciesName}&redirects&origin=*`;
      
      // Log the URL for debugging
      console.log('Fetching URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      // Log the full API response for debugging
      console.log('API Response:', data);

      // Extract the page data
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (pageId === "-1" || !page.extract) {
        // Fallback: Try the lowercase version of the species name
        const lowercaseSpeciesName = cleanedSpeciesName.toLowerCase();
        const encodedLowercaseSpeciesName = encodeURIComponent(lowercaseSpeciesName);
        //american avocet
        const fallbackUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodedLowercaseSpeciesName}&redirects&origin=*`;
        
        console.log('Trying fallback URL:', fallbackUrl);
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        console.log('Fallback API Response:', fallbackData);
        
        const fallbackPages = fallbackData.query.pages;
        const fallbackPageId = Object.keys(fallbackPages)[0];
        const fallbackPage = fallbackPages[fallbackPageId];

        if (fallbackPageId === "-1" || !fallbackPage.extract) {
          speciesInfo.textContent = `No information found for ${speciesName} on Wikipedia.`;
          return;
        }

        // Display the first 800 characters of the fallback extract
        const fallbackExtract = fallbackPage.extract.length > 800 
          ? fallbackPage.extract.substring(0, 800) + '...' 
          : fallbackPage.extract;
        speciesInfo.textContent = fallbackExtract;
        return;
      }

      // Display the first 800 characters of the extract
      const extract = page.extract.length > 800
        ? page.extract.substring(0, 800) + '...' 
        : page.extract;
      speciesInfo.textContent = extract;
    } catch (error) {
      console.error('Error fetching species info:', error);
      speciesInfo.textContent = 'Error fetching information. Please try again later.';
    }
  }

  // Event listener for species selection change
  speciesSelect.addEventListener('change', (event) => {
    const selectedSpecies = event.target.value;
    if (selectedSpecies) {
      speciesInfo.textContent = 'Loading information...';
      fetchSpeciesInfo(selectedSpecies);
    } else {
      speciesInfo.textContent = 'Select a species to view its information.';
    }
  });

  // Initial fetch if a species is pre-selected
  if (speciesSelect.value) {
    fetchSpeciesInfo(speciesSelect.value);
  }
});