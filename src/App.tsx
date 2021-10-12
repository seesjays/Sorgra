import React from "react";

import logo from "./logo.svg";
import "./App.css";

import AlgoSimPlayer, { StartingMode } from "./components/AlgoSimPlayer";

function App() {
	return (
		<div className="App">
			<div className="background-container">
				<AlgoSimPlayer startingmode={StartingMode.Sorting}/>
			</div>
		</div>
	);
}

export default App;
