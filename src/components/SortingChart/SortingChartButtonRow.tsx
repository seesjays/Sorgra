import React from "react";
import { jsx, css } from "@emotion/react";
import { styled } from "@mui/material/styles";

import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

type SortingChartButtonRowProps = {
	next_step(): void;
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
	width: "80%",
  display: "flex",
  justifyContent: "center",
}));

export function SortingChartButtonRow(props: SortingChartButtonRowProps) {
	const [alignment, setAlignment] = React.useState("left");
	const [formats, setFormats] = React.useState(() => ["italic"]);

	const handleFormat = (
		event: React.MouseEvent<HTMLElement>,
		newFormats: string[]
	) => {
		setFormats(newFormats);
	};

	const handleAlignment = (
		event: React.MouseEvent<HTMLElement>,
		newAlignment: string
	) => {
		setAlignment(newAlignment);
	};

	return (
		<ToggleContainer>
			<Paper
				elevation={5}
				sx={{
					display: "flex",
					border: (theme) => `2px solid ${theme.palette.divider}`,
					flexWrap: "wrap",
					marginTop: "1rem",
          width: "fit-content",
          height: "fit-content",
          justifyContent: "center", 
				}}
			>
				<StyledToggleButtonGroup
					size="small"
					value={formats}
					onChange={handleFormat}
					aria-label="text formatting"
				>
					<ToggleButton value="bold" aria-label="bold">
						<SkipNextRoundedIcon />
					</ToggleButton>
				</StyledToggleButtonGroup>

				<Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />

				<StyledToggleButtonGroup
					size="small"
					value={alignment}
					exclusive
					onChange={handleAlignment}
					aria-label="text alignment"
				>
					<ToggleButton value="left" aria-label="left aligned">
						<PlayArrowRoundedIcon color="success" />
					</ToggleButton>
					<ToggleButton value="right" aria-label="right aligned">
						<PauseRoundedIcon color="info" />
					</ToggleButton>
				</StyledToggleButtonGroup>
			</Paper>
		</ToggleContainer>
	);
}

/*
const _SortingChartButtonRow = (props: SortingChartButtonRowProps) => { 
    return (
        <ButtonRow>
            <ButtonSingular onClick={props.next_step}><SkipNextRoundedIcon/></ButtonSingular>
            <ButtonSingular><PlayArrowRoundedIcon/></ButtonSingular>
        </ButtonRow>
    )
}
*/
