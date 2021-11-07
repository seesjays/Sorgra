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
import { HIGHLIGHT_TYPE } from "../../scripts/dataset";

const StyledMessageBox = styled(Stack)(({ theme }) => ({
	width: "100%",
	padding: "1rem",
	display: "flex",
	border: `2px solid ${theme.palette.primary}`,
}));

const cols = [
	"rgb(76, 114, 176)",
	"rgb(196, 78, 82)",
	"rgb(85, 168, 104)",
	"rgb(76, 174, 255)",
	"rgb(194, 147, 233)",
	"rgb(204, 185, 116)",
];

type SortingChartMessageBoxProps = {
	messages: string[];
	message_ind_history: [number[], HIGHLIGHT_TYPE[]];
};
export default function SortingChartMessageBox(
	props: SortingChartMessageBoxProps
) {
	let hist = props.message_ind_history[0];

	const messages = hist.map((ind, index) => (
		<React.Fragment>
			<ListItem>
				<Typography
					sx={{
						fontSize: "1.25em",
						borderLeft: `4px solid ${
							cols[props.message_ind_history[1][index]]
						}`,
					}}
				>
					{props.messages?.[ind]}
				</Typography>
			</ListItem>
			<Divider sx={{ display: {(index < props.message_ind_history.length) ? "initial" : "none"} }}/>
		</React.Fragment>
	));

	return (
		<StyledMessageBox
			spacing={0}
			flexDirection={"column-reverse"}
			width={"100%"}
			bgcolor={"background.paper"}
		>
			<Paper variant="outlined" sx={{ width: "100%", padding: "0.75em" }}>
				{messages}
			</Paper>
		</StyledMessageBox>
	);
}
