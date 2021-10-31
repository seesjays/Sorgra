import React from "react";
import "./App.css";
import AlgoSimPlayer from "./components/AlgoSimPlayer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, CssBaseline, styled } from "@mui/material";

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
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AlgoSimPlayer starting_alg="SELECTION" />
		</ThemeProvider>
	);
}

export default App;
