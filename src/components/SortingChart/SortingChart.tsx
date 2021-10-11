import * as React from "react";
import { ChartOptions, ChartData, Chart } from "chart.js";
import { Bar } from "react-chartjs-2";

const options: ChartOptions = {
	maintainAspectRatio: true,
	aspectRatio: 1,
	animation: false,
	responsive: true,
	layout: {
		padding: 5,
	},
	plugins: {
		tooltip: {
			enabled: false,
		},
		legend: { display: false },
	},
	scales: {
		yAxes: {
			display: false,
		},
		xAxes: {
			display: false,
		},
	},
};

type HighlightedSortChart = {
	name: string;
	chartdata: ChartData;
	indices?: number[];
}

interface SortingChartProps {
	chartdatasets: HighlightedSortChart[]
}

type DatasetCollection = {
	[key: number]: HighlightedSortChart
}
export const SortingChart = ({ chartdatasets }: SortingChartProps) => {
	let datasets: DatasetCollection = {}

	let ind = 0;
	for (let set of chartdatasets) {
		datasets[ind] = set;
		ind++;
	}

	return <Bar data={datasets} options={options} />;
}