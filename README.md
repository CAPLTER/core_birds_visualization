## core_birds_visualization

An interactive dashboard of CAP LTER core bird observation [data](https://portal.edirepository.org/nis/mapbrowse?scope=knb-lter-cap&identifier=46). Input data are [pre-processed](https://github.com/CAPLTER/core_birds_visualization_data) to minimize data size for deploying on a static website.

# Bird Survey Dashboard

A dynamic web-based dashboard for visualizing bird survey data, including species counts over time, species information, and geographic survey locations. Built using HTML, CSS, and JavaScript, this project leverages libraries like Plotly for charts, Leaflet for maps, and Papa Parse for CSV data handling.

## Overview

The Bird Survey Dashboard provides an interactive interface to explore bird observation data. Users can:
- View total bird counts for selected species across years using a bar chart.
- Access detailed species information fetched from Wikipedia.
- Explore survey locations on an interactive heatmap.

This project is designed for researchers, bird enthusiasts, and data analysts interested in visualizing and analyzing bird population trends.

## Features
- **Species Count Visualization**: Displays a bar chart of total bird counts per year for a selected species.
- **Species Information**: Shows detailed descriptions and facts about selected species, dynamically fetched from Wikipedia.
- **Interactive Heatmap**: Visualizes bird survey locations on a map, filterable by species and year.
- **Responsive Design**: Adapts to various screen sizes, ensuring usability on desktops, tablets, and mobiles.
- **Data-Driven**: Utilizes CSV data from the Central Arizona-Phoenix Long-Term Ecological Research (CAP LTER) dataset.

## Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari, Edge)
- Internet connection (for fetching map tiles and Wikipedia data)
- Basic understanding of Git for cloning the repository

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/bird-survey-dashboard.git
   cd bird-survey-dashboard
   ```

2. **Open the Project**:
   - No server setup is required. Simply open `index.html` in a web browser by double-clicking the file or using a local server (e.g., `live-server` or `python -m http.server` for local development).

3. **Dependencies**:
   - The project uses CDN-hosted libraries (Leaflet, Plotly, Papa Parse), which are automatically loaded when `index.html` is opened.
   - Ensure your internet connection is active to load these resources.

## Usage

1. **Launch the Dashboard**:
   - Open `index.html` in your web browser.

2. **Explore Species Counts**:
   - Use the dropdown in the "Bird Species Count" section to select a species (e.g., "Abert's Towhee", "Anna's Hummingbird").
   - The bar chart will update to show the total bird counts across years for the selected species.

3. **View Species Info**:
   - Select a species to automatically display its information (e.g., habitat, behavior) in the "Species Info" section.

4. **Check Survey Locations**:
   - Navigate to the "Bird Survey Locations" section.
   - Use the species and year dropdowns to filter the heatmap, which displays survey locations with intensity based on bird counts.
