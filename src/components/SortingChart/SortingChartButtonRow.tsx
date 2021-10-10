import React from 'react'
import styled from "styled-components"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';

const ButtonSingular = styled.button`
    width: 45%;
    height: 80%;
	border: 2px solid grey;
    border-radius: 5px;
    background: transparent;
    color: white;
    padding: 1%;
    font-size: 30px;
    margin: 3%;
`;

const ButtonRow = styled.div`
    width: 100%;
    height: 75%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: stretch;
`;

export const SortingChartButtonRow = () => { 
    return (
        <ButtonRow>
            <ButtonSingular><SkipNextRoundedIcon/></ButtonSingular>
            <ButtonSingular><PlayArrowRoundedIcon/></ButtonSingular>
        </ButtonRow>
    )
}
