import { ChartOptions, ChartData } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";


function getRandomIntInclusive(min:number, max:number):number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
interface DatasetConfig {
	size: number;
	color?: [number, number, number];
}

const generate_dataset = (datasetparams: DatasetConfig): ChartData => {
	let data_x: number[] = [];
	let data_y: number[] = [];

	for (let i = 0; i < datasetparams.size; i++) {
		data_x[i] = i;
		data_y[i] = getRandomIntInclusive(1, datasetparams.size);
	}

	let color: string;
	if (datasetparams.color) {
		color = `${datasetparams.color[0]}, ${datasetparams.color[1]}, ${datasetparams.color[2]}`;
	} else {
		color = `76, 114, 176`;
	}

	console.dir(data_y);


	return {
		labels: data_x,
		datasets: [
			{
				label: "Datapoints",
				data: data_y,
				backgroundColor: [`rgba(${color}, 0.8)`],
				borderColor: [`rgba(${color}, 1)`],
				borderWidth: 2,
				barPercentage: 0.6,
			},
		],
	};
};

let data = generate_dataset({ size: 20 });

const options: ChartOptions = {
	maintainAspectRatio: true,
	aspectRatio: 1,
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

const VerticalBar = () => {
	return <Bar data={data}  options={options} />;
};

export default VerticalBar;
