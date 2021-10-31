import React from "react";
import { jsx, css } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";

import CasinoIcon from "@mui/icons-material/Casino";
import ReplayIcon from "@mui/icons-material/Replay";

import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type SortingChartButtonRowProps = {
	run_state: boolean;            
	complete_state: boolean;

	retry(): void;
	randomize(): void;
	next_step(user_invoked: boolean): void;
	toggle_run(
		event: React.MouseEvent<HTMLElement>,
		newAlignment: boolean
	): void;
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	"& .MuiToggleButtonGroup-grouped": {
		margin: theme.spacing(0.5),
		border: 0,
		"&.Mui-disabled": {
			border: 0,
		},
		"&:not(:first-of-type)": {
			borderRadius: theme.shape.borderRadius,
		},
		"&:first-of-type": {
			borderRadius: theme.shape.borderRadius,
		},
	},
}));

const ToggleContainer = styled("div")(({ theme }) => ({
	width: "fit-content",
	display: "flex",
	justifyContent: "center",
}));

export function SortingChartButtonRow(props: SortingChartButtonRowProps) {
	return (
		<ToggleContainer>
			<Paper
				elevation={3}
				sx={{
					display: "flex",
					border: (theme) => `2px solid ${theme.palette.primary.light}`,
					flexWrap: "wrap",
					marginTop: "0.5rem",
					width: "100%",
					height: "fit-content",
					justifyContent: "center",
				}}
			>
				<StyledToggleButtonGroup
					size="medium"
					aria-label="dataset new/retry"
					disabled={props.run_state}					
				>
					<ToggleButton value={false} onClick={() => {
							props.randomize();
						}} aria-label="new dataset">
						<CasinoIcon color="error" sx={{color: props.run_state ? {color: "rgba(255, 255, 255, 0.3)"}: {}}} />
					</ToggleButton>
					<ToggleButton value={false} onClick={() => {
							props.retry();
						}} aria-label="retry dataset">
						<ReplayIcon color="warning" sx={{color: props.run_state ? {color: "rgba(255, 255, 255, 0.3)"}: {}}} />
					</ToggleButton>
				</StyledToggleButtonGroup>

				<Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

				<StyledToggleButtonGroup size="medium" aria-label="next step">
					<ToggleButton
						value="next step"
						selected={false}
						onClick={() => {
							props.next_step(true);
						}}
						disabled={props.complete_state}
						aria-label="next step"
					>
						<SkipNextRoundedIcon />
					</ToggleButton>
				</StyledToggleButtonGroup>

				<StyledToggleButtonGroup
					size="medium"
					value={props.run_state}
					exclusive
					onChange={props.toggle_run}
					aria-label="simulation play/pause"
				>
					<ToggleButton value={true} disabled={props.complete_state} aria-label="play simulation">
						<PlayArrowRoundedIcon color="success" sx={props.complete_state ? {color: "rgba(255, 255, 255, 0.3)"}: {}} />
					</ToggleButton>
					<ToggleButton value={false} disabled={props.complete_state}  aria-label="pause simulation">
						<PauseRoundedIcon color="info" sx={props.complete_state ? {color: "rgba(255, 255, 255, 0.3)"}: {}} />
					</ToggleButton>
				</StyledToggleButtonGroup>
			</Paper>
		</ToggleContainer>
	);
}
