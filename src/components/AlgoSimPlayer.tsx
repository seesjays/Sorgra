import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingOperationGenerator,
	SortingOperationController,
} from "../scripts/dataset";
import { ChartData } from "chart.js";
import { Stack } from "@mui/material";

import { styled } from "@mui/material/styles";
import SortingChartMessageBox from "./SortingChart/SortingChartMessageBox";
import SortingSpeedBar from "./SortingChart/SortingSpeedBar";
import { Box } from "@mui/system";

export enum Speed {
	SLOW = 2,
	NORMAL = 1,
	FAST = 0.5,
	FASTER = 0.25,
	FASTERER = 0.1,
	FASTEST = 0.05,
}

type SimPlayerProps = {
	starting_alg: string;
};

const TallStack = styled(Stack)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.background.default,
}));

const AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	// try to update the timer system to be more stateful/actually follow React paradigms in the future

	const dataset_model = React.useRef(new SortingOperationGenerator("BUBBLE"));
	const timer_instance = React.useRef<number | undefined>(undefined);

	const [running, set_run_state] = React.useState(false);
	const [complete, toggle_complete] = React.useState(false);

	const [steps_model, set_steps_model] =
		React.useState<SortingOperationController>(
			new SortingOperationController(
				dataset_model.current.generate_selectionsort_steps()
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

	const [speed, set_speed] = React.useState<Speed>(Speed.NORMAL);

	const [step_message_history, set_step_message_history] = React.useState([0]);

	// initial chart step
	React.useEffect(() => {
		let initial_set = steps_model?.get_chart_dataset();

		if (initial_set) {
			setStep(initial_set);
		}
	}, [steps_model]);

	const next_step = React.useCallback(
		(user_invoked: boolean): void => {
			if (complete) {
				set_run_state(false);
				return;
			}

			setStep(steps_model?.next_step());

			if (steps_model.complete) {
				toggle_complete(true);
			}
		},
		[complete, steps_model]
	);

	const toggle_run = React.useCallback(
		(run_state: boolean): void => {
			if (run_state !== null) {
				if (run_state === running) {
					return;
				}

				set_run_state(run_state);
			}
		},
		[running]
	);

	const speed_change = React.useCallback((n_spd) => {
		let new_speed: Speed = n_spd;
		set_speed(new_speed);
	}, []);

	const handle_speed_change = (
		event: Event,
		value: number | number[]
	): void => {
		speed_change(value);
	};

	const handle_toggle_run = (
		event: React.MouseEvent<HTMLElement>,
		run_state: boolean
	): void => {
		toggle_run(run_state);
	};

	const timeordealone = React.useCallback(() => {
		if (complete || steps_model.complete) {
			console.log(`${dataset_model.current.current_algorithm.name} Complete`);

			clearTimeout(timer_instance.current);
			toggle_complete(true);
			set_run_state(false);
			return;
		} else if (!running) {
			console.log(`${dataset_model.current.current_algorithm.name} Paused`);

			clearTimeout(timer_instance.current);
			set_run_state(false);
			return;
		}

		let ivl = speed * 1000; // ms
		let exd = Date.now() + ivl;
		timer_instance.current = setTimeout(time_step, ivl, ivl, exd);
		function time_step(interval: number, initexpect: number) {
			let dt = Date.now() - initexpect; // the drift (positive for overshooting)
			if (dt > interval) {
				// pause
				// console.log("timer miss");

				clearInterval(timer_instance.current);
				toggle_run(false);
				next_step(false);

				return;
			} else {
				//console.log("timer ping");
				next_step(false);
			}
			//console.log("delta: " + dt);
			//console.log("diff: " + Math.max(0, interval - dt));

			initexpect += interval;
			timer_instance.current = setTimeout(
				time_step,
				Math.max(0, interval - dt),
				interval,
				initexpect
			);
		}
	}, [complete, next_step, running, speed, steps_model.complete, toggle_run]);

	const retry_sim = React.useCallback((): void => {
		set_run_state(false);
		toggle_complete(false);

		setStep(steps_model.retry());
	}, [steps_model]);

	const randomize_sim = React.useCallback((): void => {
		set_run_state(false);
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

	// update message history
	React.useEffect(() => {
		set_step_message_history(steps_model?.message_history);
	}, [step, steps_model]);


	// start/clear timer when run toggled
	React.useEffect(() => {
		if (running) {
			timeordealone();
		} else {
			clearTimeout(timer_instance.current);
		}
	}, [running, timeordealone]);

	return (
		<TallStack
			direction={{ xs: "column", md: "row" }}
			alignContent="flex-start"
			spacing={{ xs: 0, md: 0 }}
		>
			<Box display="flex" justifyContent="center" alignItems={"center"} padding={{ xs: "0.5em", md: "5%" }} width={{ xs: "100%", md: "60%" }}>
				<SortingChartContainer chart_data={step} />
			</Box>

			<Stack
				justifyContent={"center"}
				alignItems={"center"}
				width={{ xs: "100%", md: "40%" }}
				spacing={{ xs: 2, md: 4 }}
			>
				<SortingChartButtonRow
					retry={retry_sim}
					randomize={randomize_sim}
					next_step={next_step}
					toggle_run={handle_toggle_run}
					run_state={running}
					complete_state={complete}
				/>
				<SortingSpeedBar
					handle_speed_change={handle_speed_change}
					run_state={running}
				/>
				<SortingChartMessageBox
					messages={steps_model.messages}
					message_ind_history={step_message_history}
				/>
			</Stack>
		</TallStack>
	);
};

export default AlgoSimPlayer;
