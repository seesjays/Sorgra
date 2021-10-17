import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

import {
	SortingDatasetModel,
	HighlightedIndex,
	HIGHLIGHT_TYPE,
} from "../scripts/dataset";

export enum StartingMode {
	Sorting,
	Pathfinding,
}

export enum Speed {
	SLOW,
	NORMAL,
	FAST,
}

type SimPlayerProps = {
	startingmode: StartingMode;
};

type SimPlayerState = {
	speed: Speed;
};

let mdl = new SortingDatasetModel("Quick Sort");

let highlights: HighlightedIndex[] = [
	{ color: HIGHLIGHT_TYPE.SELECTED, indices: [0, mdl.data_set_size - 1] },
	{ color: HIGHLIGHT_TYPE.DISCREPANCY, indices: [1, 5] },
	{ color: HIGHLIGHT_TYPE.SEEKING, indices: [7, 8, 9, 10, 11] },
	{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [15] },
];

let data_out = mdl.highlight_dataset(highlights);

const AlgoSimPlayer = (simplayerprops: SimPlayerProps) => {
	const [speed, setSpeed] = React.useState<SimPlayerState>({
		speed: Speed.NORMAL,
	});

	return (
		<>
			<SortingChartContainer chart_data={data_out} />
			<SortingChartButtonRow />
		</>
	);
};

export default AlgoSimPlayer;
