import React, { useCallback } from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingDatasetModel,
	SortingOperationController,
} from "../scripts/dataset";
import { ChartData } from "chart.js";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";

enum Speed {
	SLOW = 2000,
	NORMAL = 1000,
	FAST = 500,
	FASTER = 250,
	FASTEST = 100,
}

type SimPlayerProps = {
	starting_alg: string;
};

const TallGrid = styled(Grid)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.background.default,
}));

const AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	// refactor to use fewer stae hooks, i feel as though a couple of these are unnecessary
	const dataset_model = React.useRef(new SortingDatasetModel(starting_alg));
	const timer_instance = React.useRef<number | undefined>(undefined);

	const [running, toggle_run] = React.useState(false);
	const [complete, toggle_complete] = React.useState(false);

	const [steps_model, set_steps_model] =
		React.useState<SortingOperationController>(
			new SortingOperationController(
				dataset_model.current.generate_bubblesort_steps()
			)
		);

	const [step, setStep] = React.useState<ChartData>({
		labels: [0, 1, 2, 3],
		datasets: [
			{
				label: "BASE",
				data: [0, 1, 2, 3],
				backgroundColor: ["rgb(76, 114, 176)"],
				borderWidth: 2,
				barPercentage: 0.9,
			},
		],
	});

	const [speed, set_speed] = React.useState<Speed>(Speed.FASTEST);

	const next_step = useCallback(
		(user_invoked: boolean): void => {
			if (complete) {
				console.log(`${dataset_model.current.algorithm_name} Complete`);

				toggle_run(false);
				return;
			}

			setStep(steps_model?.next_step());
			if (steps_model.complete) {
				console.log(`${dataset_model.current.algorithm_name} Complete`);

				toggle_complete(true);
			}
		},
		[complete, steps_model]
	);

	const timeordealone = React.useCallback(() => {
		let ivl = speed; // ms
		let exd = Date.now() + ivl;
		timer_instance.current = setTimeout(step, ivl, ivl, exd);
		function step(interval: number, initexpect: number) {
			if (complete || steps_model.complete) {
				console.log(`${dataset_model.current.algorithm_name} Complete`);

				toggle_complete(true);
				toggle_run(false);
				return;
			} else if (!running) {
				console.log(`${dataset_model.current.algorithm_name} Paused`);

				clearTimeout(timer_instance.current);
				toggle_run(false);
				return;
			}

			let dt = Date.now() - initexpect; // the drift (positive for overshooting)
			if (dt > interval) {
				// pause
				console.log("timer miss");
				//clearInterval(timer_instance.current);
				//toggle_run(false);
				next_step(false);

				///return;
			} else {
				//console.log("timer ping");
				next_step(false);
			}
			//console.log("delta: " + dt);
			//console.log("diff: " + Math.max(0, interval - dt));

			initexpect += interval;
			timer_instance.current = setTimeout(
				step,
				Math.max(0, interval - dt),
				interval,
				initexpect
			);
		}
	}, [complete, next_step, running, speed, steps_model.complete]);

	const handle_toggle_run = useCallback(
		(event: React.MouseEvent<HTMLElement>, run_state: boolean): void => {
			// enforce one selected
			if (run_state !== null) {
				if (run_state === running) {
					return;
				}

				toggle_run(run_state);

				if (run_state) {
					timeordealone();
				} else {
					clearTimeout(timer_instance.current);
				}
			}
		},
		[running, timeordealone]
	);

	React.useEffect(() => {
		let initial_set = steps_model?.get_chart_dataset();

		if (initial_set) {
			setStep(initial_set);
		}

		return;
	}, [steps_model]);

	return (
		<TallGrid
			container
			alignItems="center"
			alignContent="flex-start"
			spacing={{ xs: 0, md: 0 }}
			columns={12}
		>
			<Grid container justifyContent="center" item xs={12} md={8} key={0}>
				<SortingChartContainer chart_data={step} />
			</Grid>
			<Grid container justifyContent="center" item xs={12} md={4} key={1}>
				<SortingChartButtonRow
					next_step={next_step}
					handle_toggle_run={handle_toggle_run}
					runstate={running}
				/>
			</Grid>
		</TallGrid>
	);
};

export default AlgoSimPlayer;
