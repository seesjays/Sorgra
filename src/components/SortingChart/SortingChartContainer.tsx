import React, { useState } from 'react'
import styled from 'styled-components'
import SortingChart from './SortingChart'

const ContainerDiv = styled.div`
margin:5%;
position: relative;
height:90%;
width:90%;
  padding: 5%;
  border: 2px solid grey;
`;

export const SortingChartContainer = () => {
    return (
        <ContainerDiv>
            <SortingChart/>
        </ContainerDiv>
    )
};
