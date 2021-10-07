import React, { useState } from 'react'
import styled from 'styled-components'
import SortingChart from './SortingChart'

const ContainerDiv = styled.div`
  padding: 50%;
`;

export const SortingChartContainer = () => {
    return (
        <ContainerDiv>
            <SortingChart/>
        </ContainerDiv>
    )
};
