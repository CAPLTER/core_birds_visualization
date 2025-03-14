import { useState, useEffect } from "react";
import { getPieChartData } from "../../lib/pyodide"; // ✅ Import function from pyodide.js

export default function PieChart() {
    const [imageData, setImageData] = useState("");

    useEffect(() => {
        async function fetchPieChart() {
            const result = await getPieChartData(); // ✅ Call the function
            setImageData(result);
        }

        fetchPieChart();
    }, []);

    return (
        <div>
            <h2>Bird Sightings Pie Chart</h2>
            {imageData ? <img src={`data:image/png;base64,${imageData}`} alt="Pie Chart" /> : <p>Loading...</p>}
        </div>
    );
}