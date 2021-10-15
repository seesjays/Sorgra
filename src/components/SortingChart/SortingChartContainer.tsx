import React, { useState } from "react";
import styled from "styled-components";
import SortingDatasetModel, { HIGHLIGHT_TYPE } from "../../scripts/dataset";
import { ChartOptions, ChartData } from "chart.js";
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

const ContainerDiv = styled.div`
	height: 95%;
	width: 95%;
    position: relative;
	border: 2px solid grey;
`;

const mdl = new SortingDatasetModel("Quick Sort");

let new_data = mdl.generate_base_chart_dataset();

new_data = mdl.highlight_dataset([{color: HIGHLIGHT_TYPE.SELECTED, indices: [0,mdl.data_set_size-1]}])

export const SortingChartContainer = () => {
	return (
		<ContainerDiv>
			<Bar data={new_data} options={options} />
		</ContainerDiv>
	);
};
