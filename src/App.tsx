import React from "react";

import logo from "./logo.svg";
import "./App.css";

import AlgoSimPlayer from "./components/AlgoSimPlayer";

function App() {
	return (
		<div className="App">
			<div className="background-container">
				<AlgoSimPlayer starting_alg="Bubble Sort"/>
			</div>
		</div>
	);
}

export default App;
