import { ChartData } from "chart.js";


export enum HIGHLIGHT_TYPE {
    BASE,
    DISCREPANCY,
    CORRECTED,
    SEEKING,
    SELECTED,
}

export type HighlightedIndex = {
    color: HIGHLIGHT_TYPE;
    indices: number[];
}

export class SortingDatasetModel {
    data_set_size: number;
    step_counter: number;


    private data_x: number[];

    private data_original: number[]; // Returning to original dataset
    private data_y: number[]; // Actual sorting

    private highlight_cols: string[] = ["rgb(76, 114, 176)", "rgb(196, 78, 82)", "rgb(85, 168, 104)", "rgb(76, 174, 255)", "rgb(204, 185, 116)"];
    private data_highlights: string[]; // Highlight diffing


    algorithm_name: string;


    constructor(init_algorithm: string) {
        this.data_set_size = 20;
        this.step_counter = 0;

        this.data_x = Array.from({ length: this.data_set_size }, (_, i) => i + 1);
        this.data_y = this.generate_yvals();
        this.data_original = [...this.data_y];

        this.data_highlights = new Array(this.data_set_size).fill(this.highlight_cols[0]);

        this.algorithm_name = init_algorithm;
    }

    private gen_random_int_inclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    private generate_yvals(): number[] {
        let outarr: number[] = [];

        for (let i = 0; i < this.data_set_size; i++) {
            outarr.push(this.gen_random_int_inclusive(1, this.data_set_size + 1));
        }

        return outarr;
    }

    public get_chart_dataset(): ChartData {
        return {
            labels: this.data_x,
            datasets: [
                {
                    label: "BASE",
                    data: this.data_y,
                    backgroundColor: this.data_highlights,
                    borderWidth: 2,
                    barPercentage: 0.9,
                },
            ],
        };
    };


    public highlight_dataset(highlights: HighlightedIndex[]): ChartData {
        for (let highlight of highlights) {
            let selected_color = this.highlight_cols[highlight.color];
            for (let indice of highlight.indices) {
                this.data_highlights[indice] = selected_color;
            }
        }

        return this.get_chart_dataset();
    }
}