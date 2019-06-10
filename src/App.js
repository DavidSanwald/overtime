import React from "react";
import Chart from "./Chart";
import { tap } from "ramda";
import data from "./data.json";
import "./App.css";

const peek = tap(x => console.log(x));
peek(data);

function App() {
  return (
    <div style={{ position: "relative" }} className="App">
      <Chart data={data} />
    </div>
  );
}

export default App;
