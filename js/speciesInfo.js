// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const speciesSelect = document.getElementById('species-select');
  const speciesInfo = document.getElementById('species-info');

  function toTitleCase(str) {
    // Convert string to title case for Wikipedia API compatibility
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async function fetchSpeciesInfo(speciesName) {
    try {
      // Clean species name by removing invalid characters
      const cleanedSpeciesName = speciesName.replace(/[^a-zA-Z\s-']/g, '').trim();

      // Convert to title case to match Wikipedia conventions
      const titleCaseSpeciesName = toTitleCase(cleanedSpeciesName);
      
      // Encode species name for URL
      const encodedSpeciesName = encodeURIComponent(titleCaseSpeciesName);
      
      // Construct Wikipedia API URL with redirect handling
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodedSpeciesName}&redirects&origin=*`;
      
      console.log('Fetching URL:', url);

      const response = await fetch(url);
      const data = await response.json();

      console.log('API Response:', data);

      // Extract page data from response
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      if (pageId === "-1" || !page.extract) {
        // Fallback: Try lowercase species name if initial fetch fails
        const lowercaseSpeciesName = cleanedSpeciesName.toLowerCase();
        const encodedLowercaseSpeciesName = encodeURIComponent(lowercaseSpeciesName);
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

        // Truncate fallback extract to 800 characters for display
        const fallbackExtract = fallbackPage.extract.length > 800 
          ? fallbackPage.extract.substring(0, 800) + '...' 
          : fallbackPage.extract;
        speciesInfo.textContent = fallbackExtract;
        return;
      }

      // Truncate extract to 800 characters for display
      const extract = page.extract.length > 800
        ? page.extract.substring(0, 800) + '...' 
        : page.extract;
      speciesInfo.textContent = extract;
    } catch (error) {
      // Handle fetch errors
      console.error('Error fetching species info:', error);
      speciesInfo.textContent = 'Error fetching information. Please try again later.';
    }
  }

  // Update species info on dropdown change
  speciesSelect.addEventListener('change', (event) => {
    const selectedSpecies = event.target.value;
    if (selectedSpecies) {
      speciesInfo.textContent = 'Loading information...';
      fetchSpeciesInfo(selectedSpecies);
    } else {
      speciesInfo.textContent = 'Select a species to view its information.';
    }
  });

  // Fetch info for pre-selected species on load
  if (speciesSelect.value) {
    fetchSpeciesInfo(speciesSelect.value);
  }
});