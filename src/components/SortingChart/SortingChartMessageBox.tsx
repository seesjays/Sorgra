import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { styled, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Paper, Typography } from "@mui/material";
import { width } from "@mui/system";
import { HIGHLIGHT_TYPE } from "../../scripts/colormap";
import { ColorMap } from "../../scripts/colormap";
import { MessageSet } from "../../scripts/dataset";

const StyledPaper = styled(Paper)(({ theme }) => ({
	width: "90%",
	margin: "0 auto",
	padding: "1rem",
	display: "flex",
	flexDirection: "column",
	border: `2px solid ${theme.palette.primary.main}`,
}));


const highlight_colors = ColorMap;

type SortingChartMessageBoxProps = {
	messages: MessageSet;
	message_ind_history: [number[], HIGHLIGHT_TYPE[]];
};
export default function SortingChartMessageBox(
	props: SortingChartMessageBoxProps
) {
	let msgs = props.message_ind_history[0];
	let hghlghts = props.message_ind_history[1];

	let histry = msgs.map((val, index) => [props.messages[val], highlight_colors[(hghlghts[index])]]);

	const messages = histry.map((val, index) => (
		<React.Fragment key={Math.random()}>
			<ListItem
				sx={{
					fontSize: "1.25em",
					padding: "0.5rem 0.5rem",
					margin: "0.2em 0",
					borderLeft: `4px solid ${val[1]}`,
				}}
			>
				<Typography fontSize={"1.25em"}>{ (Array.isArray(val[0])) ? val[0][0] : val[0]}</Typography>
			</ListItem>
			<Divider
				sx={{
					display:
						((index < props.message_ind_history[0].length-1) && (props.message_ind_history[0].length > 1)) ? "initial" : "none",
				}}
			/>
		</React.Fragment>
	));

	return <StyledPaper variant="outlined">{messages}</StyledPaper>;
}
