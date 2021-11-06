import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingOperationFactory,
	SortingOperationController,
	Algorithms,
	HIGHLIGHT_TYPE,
} from "../scripts/dataset";
import { ChartData } from "chart.js";
import { SelectChangeEvent, Stack } from "@mui/material";

import { styled } from "@mui/material/styles";
import SortingChartMessageBox from "./SortingChart/SortingChartMessageBox";
import SortingSpeedBar from "./SortingChart/SortingSpeedBar";
import { Box } from "@mui/system";
import { AlgoSwitch } from "./SortingChart/AlgoSwitch";
import { Oldtimey } from "../scripts/oldtimey";

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

/*
const _AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	// try to update the timer system to be more stateful/actually follow React paradigms in the future
	const default_dataset_size = 15;
	const dataset_model = React.useRef(new SortingOperationFactory(15));

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
*/

type AlgoSimProps = {
	sorting_operation_factory: SortingOperationFactory;
};
type AlgoSimState = {
	running: boolean;
	complete: boolean;

	data_set_size: number;
	steps_controller: SortingOperationController;
	step: ChartData;
	step_message_history: [number[], HIGHLIGHT_TYPE[]];
	algorithm: Algorithms;

	speed: Speed;
};
class AlgoSimPlayer extends React.Component<AlgoSimProps, AlgoSimState> {
	timer_instance: number;

	constructor(props: AlgoSimProps) {
		super(props);
		const start_alg: Algorithms = "Bubble Sort";
		const set_len = 8;

		this.props.sorting_operation_factory.set_dataset_size(set_len);
		let operation =
			this.props.sorting_operation_factory.generate_new_operation(start_alg);
		let controller = new SortingOperationController(operation);

		this.timer_instance = -1;

		this.state = {
			running: false,
			complete: false,

			data_set_size: set_len,
			step_message_history: [[0], [HIGHLIGHT_TYPE.BASE]],

			steps_controller: controller,
			step: controller.get_chart_dataset(),

			algorithm: start_alg,

			speed: Speed.FAST,
		};

		this.randomize_sim = this.randomize_sim.bind(this);
		this.retry_sim = this.retry_sim.bind(this);
		this.next_step = this.next_step.bind(this);
		this.check_completion = this.check_completion.bind(this);

		this.alg_change = this.alg_change.bind(this);
		this.speed_change = this.speed_change.bind(this);

		this.toggle_run = this.toggle_run.bind(this);
		this.toggle_run_timer = this.toggle_run_timer.bind(this);
		this.timeordeal = this.timeordeal.bind(this);
	}

	retry_sim(): void {
		let initstep = this.state.steps_controller.retry();
		this.setState({ step: initstep, complete: false, running: false, step_message_history: this.state.steps_controller.message_history });
	}

	// Creates new ChartData based off of the next step in the steps_controller.
	// If the sim is already complete, does nothing.
	next_step(invoker: "button" | "timer"): void {
		// small error prevention
		if (invoker === "timer") {
			if (!this.state.running) {
				this.setState({ complete: false });
				return;
			}
		}

		if (!this.state.complete) {
			const new_step = this.state.steps_controller.next_step();
			const new_history = this.state.steps_controller.message_history;
			const still_run = invoker === "button" ? this.state.running : !this.state.steps_controller.complete;

			this.setState({
				step: new_step,
				step_message_history: new_history,
				complete: this.state.steps_controller.complete,
				running: still_run,
			});
		}
	}

	check_completion(): void {
		if (this.state.complete || this.state.steps_controller.complete) {
			console.log(`${this.state.algorithm} Complete`);

			clearTimeout(this.timer_instance);

			this.setState({ complete: true, running: false });
			return;
		} else if (!this.state.running) {
			console.log(`${this.state.algorithm} Paused`);

			clearTimeout(this.timer_instance);

			this.setState({ running: false });
			return;
		}
	}

	randomize_sim(): void {
		const new_operation =
			this.props.sorting_operation_factory.generate_new_operation(
				this.state.algorithm
			);
		let new_controller = new SortingOperationController(new_operation);

		this.setState({
			steps_controller: new_controller,
		}, this.retry_sim);
	}

	alg_change(event: SelectChangeEvent): void {
		let val = event.target.value;
		let alg: Algorithms = val as Algorithms;

		const new_operation =
			this.props.sorting_operation_factory.regenerate_operation(alg);

		let new_controller = new SortingOperationController(new_operation);

		this.setState({
			steps_controller: new_controller,
			algorithm: alg,
		}, this.retry_sim);
	}

	speed_change(_: Event, value: number): void {
		this.setState({ speed: value as Speed });
	}

	// Simlpy swaps run_state, then toggles the simulation timer
	toggle_run(_: React.MouseEvent<HTMLElement>, run_state: boolean): void {
		if (run_state !== null) {
			if (run_state === this.state.running) {
				return;
			}

			this.setState({ running: run_state }, this.toggle_run_timer);
		}
	}

	// Responsible for actually initiating/ending the
	// simulation timer based off of run_state
	toggle_run_timer(): void {
		if (this.state.running) {
			this.timeordeal();
		} else {
			clearTimeout(this.timer_instance);
		}
	}

	// Why is this called 'timeordeal'? Because I am a solo dev,
	// and thus, I shalt create cool names if I so desire.
	// And developing this was a tedious ordeal.

	// Ad essentium, not even I am entirely sure about the mechanism by which this functions.
	// I understand the prnciples and function of a self-adjusting timer, which is essentially what this class component
	// becomes after executing timeordeal. Either way, this is the most 'Reactive' way I could derive of to create
	// a simulation timer. the Oldtimey class attempted to solve the issue of a timer in React, but I couldn't derivate a solution
	// to the 'this' problem in a self-calling timer.
	timeordeal(): void {
		let ivl = this.state.speed * 1000; // ms
		let expected = Date.now() + ivl;

		let time_step = (interval: number, initexpect: number) => {
			let dt = Date.now() - initexpect; // the drift (positive for overshooting)
			if (dt > interval) {
				// pause
				// console.log("timer miss");

				clearInterval(this.timer_instance);
				this.setState({ complete: false, running: false });

				return;
			} else {
				//console.log("timer ping");
				this.next_step("timer");
			}
			//console.log("delta: " + dt);
			//console.log("diff: " + Math.max(0, interval - dt));

			initexpect += interval;
			this.timer_instance = setTimeout(
				time_step,
				Math.max(0, interval - dt),
				interval,
				initexpect
			);

			this.check_completion();
		};

		this.timer_instance = setTimeout(time_step, ivl, ivl, expected);
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
					<SortingChartContainer chart_data={this.state.step} />
				</Box>
				<Stack
					justifyContent={{ xs: "center", md: "flex-end" }}
					alignItems={"center"}
					width={{ xs: "100%", md: "40%" }}
					spacing={{ xs: 2, md: 2 }}
				>
					<AlgoSwitch
						current_alg={this.state.algorithm}
						handle_change={this.alg_change}
					/>
					<SortingChartButtonRow
						retry={this.retry_sim}
						randomize={this.randomize_sim}
						next_step={() => this.next_step("button")}
						toggle_run={this.toggle_run}
						run_state={this.state.running}
						complete_state={this.state.complete}
					/>
					<SortingSpeedBar
						handle_speed_change={this.speed_change}
						run_state={this.state.running}
					/>
					<Box width={"100%"} height="50%">
						<SortingChartMessageBox
							messages={this.state.steps_controller.messages}
							message_ind_history={this.state.step_message_history}
						/>
					</Box>
				</Stack>
			</TallStack>
		);
	}
}

export default AlgoSimPlayer;
