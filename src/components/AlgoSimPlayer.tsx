import React, { useCallback } from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingDatasetModel,
	SortingOperationController,
} from "../scripts/dataset";
import { ChartData } from "chart.js";

enum Speed {
	SLOW = 2000,
	NORMAL = 1000,
	FAST = 200,
}

type SimPlayerProps = {
	starting_alg: string;
};

const AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
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

	let next_step = useCallback((): void => {
		setStep(steps_model?.next_step());
	}, [steps_model]);

	React.useEffect(() => {
		let initial_set = steps_model?.get_chart_dataset();

		if (initial_set) {
			setStep(initial_set);
		}

		var start = new Date().getTime(),
			time = 0;

		function instance() {
			time += speed;

			var diff = new Date().getTime() - start - time;
			timer_instance = setTimeout(instance, speed - diff);

			if (steps_model.complete) {
				console.log(`${dataset_model.current.algorithm_name} Complete`);

				clearTimeout(timer_instance);
			}

			next_step();
		}

		let timer_instance: NodeJS.Timeout; 
		// timer_instance = setTimeout(instance, speed);

		return;
	}, [speed, next_step, steps_model]);

	
	return (
		<>
			<SortingChartContainer chart_data={step} />
			<SortingChartButtonRow next_step={next_step}/>
		</>
	);
};

export default AlgoSimPlayer;
