export async function loadPyodideInstance() {
    if (window.pyodide) return window.pyodide; // Prevent reloading

    console.log("Loading Pyodide...");
    
    // Dynamically import Pyodide
    const { loadPyodide } = await import("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs");

    window.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });

    console.log("Pyodide Loaded Successfully!");
    
    // Load required Python packages
    await window.pyodide.loadPackage(["numpy", "pandas", "matplotlib"]);

    return window.pyodide;
}

// Function to fetch CSV data and load into Pyodide
export async function loadCSVtoPyodide(url, filename) {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    const data = await response.text();
    window.pyodide.FS.writeFile(filename, data);

    console.log(`${filename} loaded into Pyodide.`);
    return filename;
}

export async function loadAllCSVs() {
    await loadCSVtoPyodide("/cleaned_bird_observations.csv", "observations.csv");
    await loadCSVtoPyodide("/cleaned_bird_survey_locations.csv", "locations.csv");
    await loadCSVtoPyodide("/cleaned_bird_surveys.csv", "surveys.csv");
}

export async function getPieChartData() {
    const pyodide = await loadPyodideInstance();
    await loadAllCSVs();

    const pythonCode = `
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

# Load observations data
df = pd.read_csv("observations.csv")

# Calculate Seen vs Heard proportions
seen_count = df[df["seen"] == True]["bird_count"].sum()
heard_count = df[df["heard"] == True]["bird_count"].sum()

# Create Pie Chart
fig, ax = plt.subplots()
ax.pie([seen_count, heard_count], labels=["Seen", "Heard"], autopct="%1.1f%%", colors=["green", "blue"])
ax.set_title("Proportion of Birds Seen vs Heard")

# Save Plot as Image
buf = io.BytesIO()
plt.savefig(buf, format="png")
buf.seek(0)
img_str = base64.b64encode(buf.getvalue()).decode("utf-8")
img_str
    `;

    const result = await pyodide.runPythonAsync(pythonCode);
    return result; // Return base64 image
}