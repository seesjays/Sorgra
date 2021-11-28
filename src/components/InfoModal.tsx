import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Link, Typography } from "@mui/material";

export type SorgraInfoProps = {
	open: boolean;
	lud_speeds: boolean;
	close(): void;
	change_lud_speeds(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function SorgraInfo({
	open,
	close,
	lud_speeds,
	change_lud_speeds,
}: SorgraInfoProps) {
	const desc_a = `
        Sorgra is a sorting algorithm demonstration tool designed around understandability, not reason.
    `;

	const desc_b = `As such, you might've been perplexed to find that oftentimes the simplest yet slowest algorithms
        would outpace the more complex and efficient ones, at least in terms of step count. (merge sort has more steps than bubble sort for instance)
    `;

	const desc_c = `
        This is normal! The simplest algorithms have the least amount of complexity in their steps, so there would naturally be fewer steps involved.
        Similarly, the most complex algorithms are the most involved in their execution, thus they would take more steps, thus taking up more time.
    `;

	const desc_d = `
        As such, the idea that bubblesort outpaces merge sort or quick sort must be disregarded. Sorgra uses as many steps as needed to show users
        exactly how an algorithm functions, even if the cost of doing so is the user's perception of execution time. 
    `;

	const desc_e = `
        Algorithm demonstrations are done all-naturally by utilizing a unique system that executes the actual sorting algorithm, encoding steps to a playable history.
        The algorithms are based upon pseudocode from various sources, including:
    `;

	const desc_f_a = `
        Sorgra is built happily as open-source software, with a repo over
    `;

	const desc_f_b = `
        There's also
    `;

	const desc_f_c = `
        a predecessor project built with Python and DearPyGUI, which
        includes pathfinding algorithms along with sorting ones (Sorgra heavily improves upon the sorting demonstrations, but doesn't include pathfinding)
    `;

	const desc_g = `
        Feel free to poke around the code or open a pull request with any improvements, or use Sorgra as a tool for education. 
        The demonstrations really helped me get a solid grasp of how the algorithms function, particularly Quicksort and Merge Sort.
    `;

	return (
		<div>
			<Dialog
				open={open}
				onClose={() => {
					close();
				}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Sorgra v2.4"}</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						<Typography gutterBottom>{desc_a}</Typography>
						<Typography gutterBottom mt={2}>
							{desc_b}
						</Typography>
						<Typography gutterBottom mt={2}>
							{desc_c}
						</Typography>
						<Typography gutterBottom mt={2}>
							{desc_d}
						</Typography>

						<Typography gutterBottom mt={4}>
							{desc_e}
						</Typography>
						<Typography>
							Bubble Sort — Memories; it's a pretty simple algorithm!
						</Typography>
						<Typography>
							Selection Sort —
							<Link href="https://en.wikipedia.org/wiki/Selection_sort#Implementations">
								Wikipedia
							</Link>
						</Typography>
						<Typography>
							Insertion Sort —
							<Link href="https://en.wikipedia.org/wiki/Insertion_sort#Algorithm">
								Wikipedia
							</Link>
						</Typography>
						<Typography>
							Quick Sort —
							<Link href="https://simplesnippets.tech/quick-sort-algorithm-with-example-with-cpp-code-data-structures-algorithms/">
								SimpleSnippets
							</Link>
						</Typography>
						<Typography>
							Merge Sort —
							<Link href="https://en.wikipedia.org/wiki/Merge_sort#Top-down_implementation">
								Wikipedia
							</Link>
						</Typography>

						<Typography gutterBottom mt={4}>
							{desc_f_a}
							<Link href="https://github.com/ChrisOh431/Sorgra">here.</Link>
						</Typography>

						<Typography gutterBottom mt={2}>
							{desc_f_b}
							<Link href="https://github.com/ChrisOh431/ELPath">ELPath,</Link>
							{desc_f_c}
						</Typography>

						<Typography gutterBottom mt={2}>
							{desc_g}
						</Typography>
					</DialogContentText>

					<FormControlLabel
						sx={{ marginTop: "2%" }}
						control={
							<Switch checked={lud_speeds} onChange={change_lud_speeds} />
						}
						label="Enable ludicrous speeds (buggy if device specs aren't up to the task) (avoid if seizure-prone)"
					/>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => {
							close();
						}}
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
