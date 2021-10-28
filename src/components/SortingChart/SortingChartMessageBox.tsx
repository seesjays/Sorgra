import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

type SortingChartMessageBoxProps = {
	messages?: string[];
	message_ind?: number;
};

export default function SortingChartMessageBox(
	props: SortingChartMessageBoxProps
) {
	const [message_ind, set_message_ind] = React.useState(0);

	let prev = message_ind - 1;
	let curr = message_ind;
	let next = message_ind + 1;

	if (prev < 0) {
		prev = props.messages?.length - 1;
	}

	if (next >= props.messages?.length) {
		next = 0;
	}

	const inds = [prev, curr, next];
	const keys = ["prev", "curr", "next"];

	const messages = inds.map((ind, index) => (
		<ListItem key={keys[index]} disablePadding>
			<ListItemText primary={props.messages?.[ind]} />
		</ListItem>
	));

	return (
		<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
			<List>{messages}</List>
			<Divider />
		</Box>
	);
}
