import React, { useState } from "react";
import styled from "styled-components";
import { SortingChart } from "./SortingChart";
import { generate_dataset } from "../../scripts/dataset";



const ContainerDiv = styled.div`
	height: 95%;
	width: 95%;
    position: relative;
	border: 2px solid grey;
`;

let data = generate_dataset({size:20});

export const SortingChartContainer = () => {
	return (
		<ContainerDiv>
			<SortingChart data={[{chartdata:data, name:"Default"}]}/>
		</ContainerDiv>
	);
};
