import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingOperationFactory,
	SortingOperationController,
	Algorithms,
} from "../scripts/dataset";
import { ChartData } from "chart.js";
import { IconButton, SelectChangeEvent, Stack } from "@mui/material";

import { styled } from "@mui/material/styles";
import SortingChartMessageBox from "./SortingChart/SortingChartMessageBox";
import SortingSpeedBar from "./SortingChart/SortingSpeedBar";
import { Box } from "@mui/system";
import { AlgoSwitch } from "./SortingChart/AlgoSwitch";
import { HIGHLIGHT_TYPE } from "../scripts/colormap";
import { SizeSwitch } from "./SortingChart/SizeSwitch";
import SorgraInfo from "./InfoModal";
import { InfoOutlined } from "@mui/icons-material";

export enum Speed {
	SLOW = 2,
	NORMAL = 1,
	FAST = 0.5,
	FASTER = 0.25,
	FASTERER = 0.1,
	FASTEST = 0.05,
}

const TallStack = styled(Stack)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.background.default,
}));

type AlgoSimProps = {
	sorting_operation_factory: SortingOperationFactory;
};

type AlgoSimState = {
	running: boolean;
	complete: boolean;

	data_set_size: number;
	step_message_history: [number[], HIGHLIGHT_TYPE[]];

	step: ChartData[];
	steps_controller: SortingOperationController;

	algorithm: Algorithms;

	speed: Speed;

	info_modal_open: boolean;
	lud_speeds_enabled: boolean;
};
class AlgoSimPlayer extends React.Component<AlgoSimProps, AlgoSimState> {
	timer_instance: number;

	constructor(props: AlgoSimProps) {
		super(props);
		const start_alg: Algorithms = "Bubble Sort";
		const set_len = 14;

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

			lud_speeds_enabled: false,
			info_modal_open: false,
		};

		this.randomize_sim = this.randomize_sim.bind(this);
		this.retry_sim = this.retry_sim.bind(this);
		this.next_step = this.next_step.bind(this);
		this.check_completion = this.check_completion.bind(this);

		this.alg_change = this.alg_change.bind(this);
		this.size_change = this.size_change.bind(this);
		this.speed_change = this.speed_change.bind(this);

		this.toggle_run = this.toggle_run.bind(this);
		this.toggle_run_timer = this.toggle_run_timer.bind(this);
		this.timeordeal = this.timeordeal.bind(this);

		this.toggle_lud_speeds = this.toggle_lud_speeds.bind(this);
		this.toggle_info_dialog = this.toggle_info_dialog.bind(this);
	}

	retry_sim(): void {
		let initstep = this.state.steps_controller.retry();
		this.setState({
			step: initstep,
			complete: false,
			running: false,
			step_message_history: this.state.steps_controller.message_history,
		});
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
			const still_run =
				invoker === "button"
					? this.state.running
					: !this.state.steps_controller.complete;

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

		this.setState(
			{
				steps_controller: new_controller,
			},
			this.retry_sim
		);
	}

	alg_change(event: SelectChangeEvent): void {
		let val = event.target.value;
		let alg: Algorithms = val as Algorithms;

		const new_operation =
			this.props.sorting_operation_factory.regenerate_operation(alg);

		let new_controller = new SortingOperationController(new_operation);

		this.setState(
			{
				steps_controller: new_controller,
				algorithm: alg,
			},
			this.retry_sim
		);
	}

	size_change(event: SelectChangeEvent<number>): void {
		let new_size = event.target.value as number;

		this.props.sorting_operation_factory.set_dataset_size(new_size);

		this.setState({ data_set_size: new_size }, this.randomize_sim);
	}

	speed_change(_: Event, value: number): void {
		this.setState({ speed: value as Speed });
	}

	toggle_lud_speeds(event: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({ lud_speeds_enabled: event.target.checked as boolean, speed: Speed.NORMAL });
	}

	toggle_info_dialog(open: boolean): void {
		this.setState({ info_modal_open: open });
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
				<SorgraInfo
					open={this.state.info_modal_open}
					close={() => {
						this.toggle_info_dialog(false);
					}}
					lud_speeds={this.state.lud_speeds_enabled}
					change_lud_speeds={this.toggle_lud_speeds}
				/>
				<Box
					display="flex"
					justifyContent="center"
					alignItems={"center"}
					padding={{ xs: "0.5em", md: "5%" }}
					width={{ xs: "100%", md: "60%" }}
				>
					<SortingChartContainer
						chart_data={this.state.step}
						true_max={this.state.steps_controller.get_max_y()}
					/>
				</Box>
				<Stack
					justifyContent={{ xs: "flex-start", md: "flex-end" }}
					alignItems={"center"}
					width={{ xs: "100%", md: "40%" }}
					spacing={{ xs: 2, md: 2 }}
				>
					<Stack
						direction={"row"}
						justifyContent={"center"}
						alignItems={"center"}
						width={{ xs: "90%", md: "50%" }}
						marginTop={{ xs: "2%" }}
						spacing={{ xs: 2, md: 2 }}
					>
						<AlgoSwitch
							current_alg={this.state.algorithm}
							handle_change={this.alg_change}
						/>
						<SizeSwitch
							min={8}
							max={20}
							current_size={this.state.data_set_size}
							change_size={this.size_change}
						/>
						<IconButton
							aria-label="info"
							onClick={() => {
								this.toggle_info_dialog(true);
							}}
						>
							<InfoOutlined
								sx={{
									color: (theme) => theme.palette.primary.main,
								}}
							/>
						</IconButton>
					</Stack>

					<SortingChartButtonRow
						retry={this.retry_sim}
						randomize={this.randomize_sim}
						next_step={() => this.next_step("button")}
						toggle_run={this.toggle_run}
						run_state={this.state.running}
						complete_state={this.state.complete}
					/>
					<SortingSpeedBar
						speed={this.state.speed}
						lud_speeds={this.state.lud_speeds_enabled}
						handle_speed_change={this.speed_change}
						run_state={this.state.running}
					/>
					<Box width={"100%"} height="55%">
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
