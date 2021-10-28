import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingDatasetModel,
	SortingOperationController,
} from "../scripts/dataset";
import { ChartData } from "chart.js";
import { Grid } from "@mui/material";

import { styled } from "@mui/material/styles";
import SortingChartMessageBox from "./SortingChart/SortingChartMessageBox";

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
	// try to update the timer system to be more stateful/actually follow React paradigms in the future

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

	const next_step = React.useCallback(
		(user_invoked: boolean): void => {
			if (complete) {
				toggle_run(false);
				return;
			}

			setStep(steps_model?.next_step());
			if (steps_model.complete) {
				toggle_complete(true);
			}
		},
		[complete, steps_model]
	);

	const timeordealone = React.useCallback(() => {
		if (complete || steps_model.complete) {
			console.log(`${dataset_model.current.algorithm_name} Complete`);

			clearTimeout(timer_instance.current);
			toggle_complete(true);
			toggle_run(false);
			return;
		} else if (!running) {
			console.log(`${dataset_model.current.algorithm_name} Paused`);

			clearTimeout(timer_instance.current);
			toggle_run(false);
			return;
		}

		let ivl = speed; // ms
		let exd = Date.now() + ivl;
		timer_instance.current = setTimeout(step, ivl, ivl, exd);
		function step(interval: number, initexpect: number) {
			let dt = Date.now() - initexpect; // the drift (positive for overshooting)
			if (dt > interval) {
				// pause
				// console.log("timer miss");
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

	const handle_toggle_run = React.useCallback(
		(event: React.MouseEvent<HTMLElement>, run_state: boolean): void => {
			// enforce one selected
			if (run_state !== null) {
				if (run_state === running) {
					return;
				}

				toggle_run(run_state);
			}
		},
		[running]
	);

	const retry_sim = React.useCallback((): void => {
		setStep(steps_model.retry());
		toggle_run(false);
		toggle_complete(false);
		
	}, [steps_model]);

	const randomize_sim = React.useCallback((): void => {
		toggle_run(false);
		toggle_complete(false);
		
		dataset_model.current.randomize_y();
		let new_step_model = dataset_model.current.generate_bubblesort_steps();

		let new_step_controller = new SortingOperationController(new_step_model); 
		set_steps_model(new_step_controller);

		let new_set = new_step_controller?.get_chart_dataset();

		if (new_set) {
			setStep(new_set);
		}

		
	}, []);

	React.useEffect(() => {
		let initial_set = steps_model?.get_chart_dataset();

		if (initial_set) {
			setStep(initial_set);
		}
	}, [steps_model]);

	React.useEffect(() => {
		if (running) {
			timeordealone();
		} else {
			clearTimeout(timer_instance.current);
		}
	}, [running, timeordealone]);

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
					retry={retry_sim}
					randomize={randomize_sim}
					next_step={next_step}
					toggle_run={handle_toggle_run}
					runstate={running}
				/>
				<SortingChartMessageBox messages={steps_model.messages}>
			</Grid>
		</TallGrid>
	);
};

export default AlgoSimPlayer;
