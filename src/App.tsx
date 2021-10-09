import React from "react";

import logo from "./logo.svg";
import "./App.css";

import SimPlayer from "./components/SimPlayer";

function App() {
	return (
		<div className="App">
			<div className="background-container">
				<SimPlayer/>
			</div>
		</div>
	);
}

export default App;
