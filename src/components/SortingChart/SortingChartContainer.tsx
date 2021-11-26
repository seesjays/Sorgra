import React, { useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions,
	ChartData,
	CoreChartOptions,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

type SortingChartContainerProps = {
	chart_data: ChartData[];
	true_max: number;
};

const ContainerPaper = styled(Paper)(({ theme }) => ({
	height: "fit-content",
	width: "100%",
	position: "relative",
	border: `2px solid ${theme.palette.primary.light}`,
	margin: "0.1rem 0",
}));

export const SortingChartContainer = ({
	chart_data,
	true_max,
}: SortingChartContainerProps) => {
	const chart_options: ChartOptions = {
		maintainAspectRatio: true,
		aspectRatio: 2,
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
	
	if (chart_options.scales?.yAxes) {
		chart_options.scales.yAxes.max = true_max;
	}

	let chartsze = chart_data.length;

	chart_options.aspectRatio = chartsze;

	// aux should always be below actual
	const charts = chart_data.map((chart_data) => {
		return (
			<Bar
				options={chart_options as CoreChartOptions<"bar">}
				data={chart_data as ChartData<"bar", number[]>}
			/>
		);
	});

	return (
		<ContainerPaper elevation={2} sx={{}}>
			{charts}
		</ContainerPaper>
	);
};
