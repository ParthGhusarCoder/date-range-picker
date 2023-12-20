import "./App.css";
import DatePicker from "./DatePicker";

function App() {
  return (
    <div className="App">
      <div style={{ width: "200px" }}>
        <DatePicker days={["SU", "MO", "TU", "WE", "TH", "FR", "SA"]}  onDateClicks={(date) => console.log(date)} />
      </div>
    </div>
  );
}

export default App;
