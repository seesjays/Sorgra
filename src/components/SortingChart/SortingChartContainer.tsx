import React, { useState } from "react";
import { ChartOptions, ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

type SortingChartContainerProps = {
	chart_data: ChartData;
};

const chart_options: ChartOptions = {
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

const ContainerPaper = styled(Paper)(({ theme }) => ({
	height: "fit-content",
	width: "100%",
	position: "relative",
	border: `2px solid ${theme.palette.primary.light}`,
	margin: "0.1rem 0",
}));

export const SortingChartContainer = (
	chartdata: SortingChartContainerProps
) => {
	return (
		<ContainerPaper
			elevation={2}
			sx={{
			}}
		>
			<Bar data={chartdata.chart_data} options={chart_options} />
		</ContainerPaper>
	);
};
