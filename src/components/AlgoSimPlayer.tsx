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
	FAST = 200,
}

type SimPlayerProps = {
	starting_alg: string;
};

const TallGrid = styled(Grid)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.background.default
}));

const AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	// refactor to use fewer stae hooks, i feel as though a couple of these are unnecessary
	const dataset_model = React.useRef(new SortingDatasetModel(starting_alg));

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

	const [speed, set_speed] = React.useState<Speed>(Speed.NORMAL);

	const [timer_instance, set_timer_instance] = React.useState<number | undefined>(undefined);

	const [running, toggle_run] = React.useState(false);

	const [timer_date, set_timer_ms] = React.useState<number | null>(null);
	const [time_tracker, set_time_tracker] = React.useState<number>(0);

	let next_step = useCallback((): void => {
		setStep(steps_model?.next_step());
	}, [steps_model]);

	let instance = useCallback(() => {
		if (timer_instance !== undefined || timer_date === null)
		{
			clearTimeout(timer_instance);
			set_timer_instance(undefined);
			return;
		}
		else if (steps_model.complete && timer_instance !== null) {
			console.log(`${dataset_model.current.algorithm_name} Complete`);

			clearTimeout(timer_instance);
			set_timer_instance(undefined);
			return;
		}

		let t = time_tracker;
		set_time_tracker(t + speed);
		next_step();

		let diff = (new Date().getTime() - timer_date) - time_tracker;
		set_timer_instance(window.setTimeout(instance, (speed - diff)));


	}, [timer_instance, timer_date, time_tracker, speed, steps_model.complete, next_step]);

	const init_run_sim = useCallback((): void => {
		set_timer_ms(new Date().getTime());
		set_time_tracker(0);

		set_timer_instance(window.setTimeout(instance, speed));
	}, [instance, speed]);

		

	let handle_toggle_run = useCallback((
		event: React.MouseEvent<HTMLElement>,
		run_state: boolean
	): void => {
		init_run_sim();
		toggle_run(run_state);
	}, [init_run_sim]);



	React.useEffect(() => {
		let initial_set = steps_model?.get_chart_dataset();

		if (initial_set) {
			setStep(initial_set);
		}

		return;
	}, [speed, next_step, steps_model, timer_instance]);

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
				<SortingChartButtonRow next_step={next_step} handle_toggle_run={handle_toggle_run} runstate={running} />
			</Grid>
		</TallGrid>
	);
};

export default AlgoSimPlayer;
