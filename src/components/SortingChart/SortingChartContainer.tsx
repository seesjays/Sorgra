import React, { useState } from "react";
import { ChartOptions, ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import styled from '@emotion/styled';


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

const ContainerDiv = styled.div`
	height: 95%;
	width: 95%;
	position: relative;
	border: 2px solid grey;
`;

export const SortingChartContainer = (chartdata: SortingChartContainerProps) => {
	return (
		<ContainerDiv>
			<Bar data={chartdata.chart_data} options={chart_options}/>
		</ContainerDiv>
	);
};
