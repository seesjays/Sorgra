import React from "react";
import { SortingChartContainer } from "./SortingChart/SortingChartContainer";
import { SortingChartButtonRow } from "./SortingChart/SortingChartButtonRow";

export enum StartingMode {
    Sorting,
    Pathfinding
}

export enum Speed {
    SLOW,
    NORMAL,
    FAST
}

type SimPlayerProps = {
    startingmode: StartingMode,
};

type SimPlayerState = {
    speed: Speed,
}

class AlgoSimPlayer extends React.Component<SimPlayerProps, SimPlayerState> {
    state: SimPlayerState = {
        speed: Speed.NORMAL
    }

    render() {
        return (
            <>
                <SortingChartContainer />
                <SortingChartButtonRow />
            </>
        );
    }
}

export default SimPlayer;
