import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

type SortingChartMessageBoxProps = {
	messages: string[];
	message_ind_history: number[];
};

export default function SortingChartMessageBox(
	props: SortingChartMessageBoxProps
) {
	const messages = props.message_ind_history.map((ind, index) => (
		<React.Fragment key={props.messages[index]}>
			<Divider />
			<ListItem>
				<ListItemText primary={props.messages?.[ind]} />
			</ListItem>
		</React.Fragment>
	));

	return (
		<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
			<List sx={{ display: "flex", flexDirection: "column-reverse" }}>{messages}</List>
		</Box>
	);
}
