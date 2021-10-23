import React from "react";
import "./App.css";
import AlgoSimPlayer from "./components/AlgoSimPlayer";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			light: "#4c72b0",
			main: "#7ea0e2",
			dark: "#104780",
			contrastText: "#fff",
		},
		secondary: {
			light: "#b1ddd9",
			main: "#e4ffff",
			dark: "#81aba8",
			contrastText: "#000",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<div className="background-container">
					<AlgoSimPlayer starting_alg="Bubble Sort" />
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
