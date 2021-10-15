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

export default class SortingDatasetModel {
    data_set_size: number;
    step_counter: number;


    private data_x: number[];

    private data_original: number[]; // Returning to original dataset
    private data_y: number[]; // Actual sorting

    private highlight_cols: string[] = ["rgb(76, 114, 176)", "rgb(196, 78, 82)", "rgb(85, 168, 104)", "rgb(76, 174, 255)", "rgb(204, 185, 116)"];
    private data_highlights: string[][]; // Highlight diffing

    private chartjsdatasetobj: ChartData;


    algorithm_name: string;


    constructor(init_algorithm: string) {
        this.data_set_size = 20;
        this.step_counter = 0;

        this.data_x = Array.from({ length: this.data_set_size }, (_, i) => i + 1);
        this.data_y = this.generate_yvals();
        this.data_original = [...this.data_y];

        this.data_highlights = new Array(this.data_set_size).fill(new Array(3).fill(this.highlight_cols[0]));

        this.algorithm_name = init_algorithm;

        this.chartjsdatasetobj = this.generate_base_chart_dataset();
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

    public generate_base_chart_dataset(): ChartData {

        let highlight_list: string[] = [];
        for (let i = 0; i < this.data_set_size; i++) {
            highlight_list.push(this.highlight_cols[0]);
        }

        return {
            labels: this.data_x,
            datasets: [
                {
                    label: "BASE",
                    data: this.data_y,
                    backgroundColor: highlight_list,
                    borderWidth: 2,
                    barPercentage: 0.7,
                },
            ],
        };
    };

    private get_chart_dataset(): ChartData {
        return this.chartjsdatasetobj;
    }


    public highlight_dataset(highlights: HighlightedIndex[]) {
        let chart = this.get_chart_dataset();
        
        if (chart.datasets[0])
        {
            for (let highlight of highlights) {
                let selected_color = this.highlight_cols[highlight.color];
                for (let indice of highlight.indices) {
                    chart.datasets[0].backgroundColor[indice] = selected_color;
                }
            }
        }

        return this.chartjsdatasetobj;
    }
}