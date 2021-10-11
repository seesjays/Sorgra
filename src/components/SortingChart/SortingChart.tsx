import { ChartOptions, ChartData, Chart } from "chart.js";
import React, { useState, useRef, MutableRefObject, ForwardRefExoticComponent, RefObject } from "react";
import { Bar } from "react-chartjs-2";
import { generate_dataset } from "../../scripts/dataset";

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
interface HighlightedSortChart {
	name: string;
	chartdata: ChartData;
	indices: number[];
}

export const SortingChart: React.FC = () => {
	const chartref = useRef<Chart>(null);

	return <Bar ref={chartref} options={options} />;
}