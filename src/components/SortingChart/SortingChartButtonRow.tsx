import React from "react";
import { jsx, css } from "@emotion/react";
import { styled, useTheme } from "@mui/material/styles";

import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type SortingChartButtonRowProps = {
	runstate: boolean;
	next_step(): void;
	handle_toggle_run(
		event: React.MouseEvent<HTMLElement>,
		newAlignment: boolean,
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
	const [selected_nextstep, deselect_nextstep] = React.useState(false);

	const handle_next_step = (
		event: React.MouseEvent<HTMLElement>,
	) => {
		props.next_step();
		deselect_nextstep(false);
	};

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
					value={false}
					onChange={handle_next_step}
					aria-label="text formatting"
				>
					<ToggleButton value="next" selected={selected_nextstep} aria-label="next step">
						<SkipNextRoundedIcon />
					</ToggleButton>
				</StyledToggleButtonGroup>

				<Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

				<StyledToggleButtonGroup
					size="medium"
					value={props.runstate}
					exclusive
					onChange={props.handle_toggle_run}
					aria-label="text alignment"
				>
					<ToggleButton value={true} aria-label="play simulation">
						<PlayArrowRoundedIcon color="success" />
					</ToggleButton>
					<ToggleButton value={false} aria-label="pause simulation">
						<PauseRoundedIcon color="info" />
					</ToggleButton>
				</StyledToggleButtonGroup>
			</Paper>
		</ToggleContainer>
	);
}
