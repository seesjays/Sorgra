import React from "react";
import "./App.css";
import AlgoSimPlayer from "./components/AlgoSimPlayer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline, styled } from "@mui/material";
import { Algorithms, SortingOperationFactory } from "./scripts/dataset";

const theme = createTheme({
	palette: {
		mode: "dark",
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
	let factory = new SortingOperationFactory();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AlgoSimPlayer sorting_operation_factory={factory} />
		</ThemeProvider>
	);
}

export default App;
