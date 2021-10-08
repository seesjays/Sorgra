import React, { useState } from "react";
import styled from "styled-components";
import SortingChart from "./SortingChart";

const ContainerDiv = styled.div`
	height: 95%;
	width: 95%;
    position: relative;
	border: 2px solid grey;
`;

export const SortingChartContainer = () => {
	return (
		<ContainerDiv>
			<SortingChart />
		</ContainerDiv>
	);
};
