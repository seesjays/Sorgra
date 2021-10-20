import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingDatasetModel,
	HighlightedIndex,
	HIGHLIGHT_TYPE,
	SortingOperation,
	SortingOperationController,
} from "../scripts/dataset";
import { ChartData } from "chart.js";

export enum Speed {
	SLOW = 6000,
	NORMAL = 3000,
	FAST = 200,
}

type SimPlayerProps = {
	starting_alg: string;
};


const AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	const dataset_model = React.useRef(new SortingDatasetModel(starting_alg)); 

	const [speed, set_speed] = React.useState<Speed>(Speed.FAST);
	
	const [steps_model, set_steps_model] = React.useState<SortingOperationController>(
		new SortingOperationController(dataset_model.current.generate_bubblesort_steps())
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

	React.useEffect(() => { 
		let initial_set = steps_model?.get_chart_dataset();

		if (initial_set) {
			setStep(initial_set);
		}

		let bubbleSort = setInterval(() => {
			if (steps_model.complete)
			{
				console.log("Bubblesort Complete");
				
				clearInterval(bubbleSort);
			}

			setStep(steps_model?.next_step());
		}, speed)

		return;
	}, [steps_model]);

	return (
		<>
			<SortingChartContainer chart_data={step} />
			<SortingChartButtonRow />
		</>
	);
};

export default AlgoSimPlayer;
