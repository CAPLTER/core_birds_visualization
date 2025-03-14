import PieChart from "./components/visualizations/PieChart";

function App() {
    return (
        <div className="container">
            <h1>Bird Survey Visualizations</h1>
            <div className="visualization-grid">
                <div className="chart-container"><PieChart /></div>
            </div>
        </div>
    );
}

export default App;