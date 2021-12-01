import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type SizeSwitchProps = {
	min: number;
	max: number;
	current_size: number;
	change_size(event: SelectChangeEvent<any>): void;
};

export function SizeSwitch({
	min,
	max,
	current_size,
	change_size,
}: SizeSwitchProps) {
	const sizes = [];

	for (let i = min; i <= max; i++) sizes.push(<MenuItem value={i} key={i}>{i}</MenuItem>);

	return (
		<FormControl variant="outlined" sx={{ minWidth: "20%" }}>
			<InputLabel id="dataset-size-select-label">Size</InputLabel>
			<Select
				labelId="dataset-size-select-label"
				id="dataset-size-select"
				value={current_size}
				onChange={change_size}
				label="Size"
			>
				{sizes}
			</Select>
		</FormControl>
	);
}
