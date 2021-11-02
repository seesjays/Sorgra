import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingOperationGenerator,
	SortingOperationController,
	Algorithms,
} from "../scripts/dataset";
import { ChartData } from "chart.js";
import { SelectChangeEvent, Stack } from "@mui/material";

import { styled } from "@mui/material/styles";
import SortingChartMessageBox from "./SortingChart/SortingChartMessageBox";
import SortingSpeedBar from "./SortingChart/SortingSpeedBar";
import { Box } from "@mui/system";
import { AlgoSwitch } from "./SortingChart/AlgoSwitch";
import { SortingChartController } from "./SortingChart/SortingChartController";

export enum Speed {
	SLOW = 2,
	NORMAL = 1,
	FAST = 0.5,
	FASTER = 0.25,
	FASTERER = 0.1,
	FASTEST = 0.05,
}

type SimPlayerProps = {
	starting_alg: Algorithms;
};

const TallStack = styled(Stack)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.background.default,
}));

const _AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	// try to update the timer system to be more stateful/actually follow React paradigms in the future
	const default_dataset_size = 15;
	const dataset_model = React.useRef(
		new SortingOperationGenerator(starting_alg, default_dataset_size)
	);

	const timer_instance = React.useRef<number | undefined>(undefined);

	const [running, set_run_state] = React.useState(false);
	const [complete, toggle_complete] = React.useState(false);

	const [steps_model, set_steps_model] =
		React.useState<SortingOperationController>(
			new SortingOperationController(
				dataset_model.current.generate_new_operation()
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
	const [step_message_history, set_step_message_history] = React.useState([0]);

	const [speed, set_speed] = React.useState<Speed>(Speed.NORMAL);

	const [algorithm, set_algorithm] = React.useState(starting_alg);

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

	const handle_toggle_run = (
		_: React.MouseEvent<HTMLElement>,
		run_state: boolean
	): void => {
		toggle_run(run_state);
	};

	const speed_change = React.useCallback((n_spd) => {
		let new_speed: Speed = n_spd;
		set_speed(new_speed);
	}, []);

	const handle_speed_change = (_: Event, value: number | number[]): void => {
		speed_change(value);
	};

	const timeordealone = React.useCallback(() => {
		if (complete || steps_model.complete) {
			console.log(`${dataset_model.current.current_algorithm} Complete`);

			clearTimeout(timer_instance.current);
			toggle_complete(true);
			set_run_state(false);
			return;
		} else if (!running) {
			console.log(`${dataset_model.current.current_algorithm} Paused`);

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

		let new_step_model = dataset_model.current.generate_new_operation();

		let new_step_controller = new SortingOperationController(new_step_model);
		set_steps_model(new_step_controller);

		let new_set = new_step_controller?.get_chart_dataset();

		if (new_set) {
			setStep(new_set);
		}
	}, []);

	const handle_alg_change = (event: SelectChangeEvent) => {
		let val = event.target.value;
		let alg: Algorithms = val as Algorithms;
		set_algorithm(alg);

		set_run_state(false);
		toggle_complete(false);

		dataset_model.current.current_algorithm = alg;

		let new_step_model = dataset_model.current.regenerate_operation();

		let new_step_controller = new SortingOperationController(new_step_model);
		set_steps_model(new_step_controller);

		let new_set = new_step_controller?.get_chart_dataset();
		if (new_set) {
			setStep(new_set);
		}
	};

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
			<Box
				display="flex"
				justifyContent="center"
				alignItems={"center"}
				padding={{ xs: "0.5em", md: "5%" }}
				width={{ xs: "100%", md: "60%" }}
			>
				<SortingChartContainer chart_data={steps_model?.get_chart_dataset()} />
			</Box>

			<Stack
				justifyContent={{ xs: "center", md: "flex-end" }}
				alignItems={"center"}
				width={{ xs: "100%", md: "40%" }}
				spacing={{ xs: 2, md: 2 }}
			>
				<AlgoSwitch current_alg={algorithm} handle_change={handle_alg_change} />
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
				<Box width={"100%"} height="50%">
					<SortingChartMessageBox
						messages={steps_model.messages}
						message_ind_history={step_message_history}
					/>
				</Box>
			</Stack>
		</TallStack>
	);
};

type AlgoSimProps = {
	sorting_operation_factory: SortingOperationGenerator;
};
type AlgoSimState = {
	timer_instance?: number;
	
	running: boolean;
	complete: boolean;

	data_set_size: number;
	steps_controller: SortingOperationController;
	step_message_history: number[];
	algorithm: Algorithms;

	speed: Speed;	
};
class AlgoSimPlayer extends React.Component<AlgoSimProps, AlgoSimState> {
	constructor(props: AlgoSimProps)
	{
		super(props);
		let start_alg: Algorithms = "Bubble Sort"; 
		this.props.sorting_operation_factory.current_algorithm = start_alg;

		this.state = {
			// optional second annotation for better type inference
			running: false,
			complete: false,
	
			data_set_size: 15,
			step_message_history: [0],
	
			steps_controller: new SortingOperationController(this.props.sorting_operation_factory.generate_new_operation()),
			algorithm: start_alg,
			
			speed: Speed.FAST,
		};
	}

	retry_sim(){
				
	}

	render() {
		return (
			<TallStack
			direction={{ xs: "column", md: "row" }}
			alignContent="flex-start"
			spacing={{ xs: 0, md: 0 }}
		>
			<Box
				display="flex"
				justifyContent="center"
				alignItems={"center"}
				padding={{ xs: "0.5em", md: "5%" }}
				width={{ xs: "100%", md: "60%" }}
			>
				<SortingChartController step_controller={this.state.steps_controller} step={0} />
			</Box>

			<Stack
				justifyContent={{ xs: "center", md: "flex-end" }}
				alignItems={"center"}
				width={{ xs: "100%", md: "40%" }}
				spacing={{ xs: 2, md: 2 }}
			>
				<AlgoSwitch current_alg={this.state.algorithm} handle_change={this.handle_alg_change} />
				<SortingChartButtonRow
					retry={this.retry_sim}
					randomize={this.randomize_sim}
					next_step={this.next_step}
					toggle_run={this.handle_toggle_run}
					run_state={this.state.running}
					complete_state={this.state.complete}
				/>
				<SortingSpeedBar
					handle_speed_change={this.handle_speed_change}
					run_state={this.state.running}
				/>
				<Box width={"100%"} height="50%">
					<SortingChartMessageBox
						messages={this.state.steps_model.messages}
						message_ind_history={this.state.step_message_history}
					/>
				</Box>
			</Stack>
		</TallStack>
		);
	}
}

export default AlgoSimPlayer;
