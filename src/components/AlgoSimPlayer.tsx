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
	SLOW,
	NORMAL,
	FAST,
}

type SimPlayerProps = {
	starting_alg: string;
};


/*
let highlights: HighlightedIndex[] = [
	{ color: HIGHLIGHT_TYPE.SELECTED, indices: [0, mdl.data_set_size - 1] },
	{ color: HIGHLIGHT_TYPE.DISCREPANCY, indices: [1, 5] },
	{ color: HIGHLIGHT_TYPE.SEEKING, indices: [7, 8, 9, 10, 11] },
	{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [15] },
];

let mdl = new SortingDatasetModel("Bubble Sort");
let data_out = mdl.highlight_dataset(highlights);
*/


const AlgoSimPlayer = ({ starting_alg }: SimPlayerProps) => {
	const dataset_model = React.useRef(new SortingDatasetModel(starting_alg)); 

	const [speed, set_speed] = React.useState<Speed>(Speed.NORMAL);

	let bubble = dataset_model.current.generate_bubblesort_steps();
	
	const [steps_model, set_steps_model] = React.useState<SortingOperationController>(
		new SortingOperationController(bubble)
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

		const runtime = initial_set.datasets.length;






		return;
	});

	return (
		<>
			<SortingChartContainer chart_data={step} />
			<SortingChartButtonRow />
		</>
	);
};

export default AlgoSimPlayer;
