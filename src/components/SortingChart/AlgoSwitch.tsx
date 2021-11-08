import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Algorithms } from "../../scripts/dataset";

type AlgoSwitchProps = {
	current_alg: Algorithms;
	handle_change(event: SelectChangeEvent<any>): void;
};
export function AlgoSwitch({ current_alg, handle_change }: AlgoSwitchProps) {
	return (
		<FormControl variant="outlined" sx={{ minWidth: "50%" }}>
			<InputLabel id="algorithm-select-label">Algorithm</InputLabel>
			<Select
				labelId="algorithm-select-label"
				id="algorithm-select"
				value={current_alg}
				onChange={handle_change}
				label="Algorithm"
			>
				<MenuItem value={"Bubble Sort"}>Bubble Sort</MenuItem>
				<MenuItem value={"Selection Sort"}>Selection Sort</MenuItem>
				<MenuItem value={"Insertion Sort"}>Insertion Sort</MenuItem>
				<MenuItem value={"Quick Sort"}>Quick Sort</MenuItem>
			</Select>
		</FormControl>
	);
}
