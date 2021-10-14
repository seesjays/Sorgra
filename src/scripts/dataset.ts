import { ChartData } from "chart.js";


enum HIGHLIGHT_TYPE {
    BASE,
    DISCREPANCY,
    CORRECTED,
    SEEKING,
    SELECTED,
}

type HighlightedIndex = {
    color: HIGHLIGHT_TYPE;
    indices: number[];
}

class SortingDatasetModel {
    data_set_size: number;
    step_counter: number;

    data_x: number[];

    data_original: number[]; // Returning to original dataset
    data_y: number[]; // Actual sorting
    data_y_displays: {[highlight in HIGHLIGHT_TYPE]: number[]}; // Highlight diffing

    algorithm_name: string;

    chartjsdatasetobj: ChartData;

    constructor(init_algorithm: string)
    {
        this.data_set_size = 20;
        this.step_counter = 0;

        this.data_x = Array.from({length: 10}, (_, i) => i + 1);
        this.data_y = this.generate_yvals();
        this.data_original = [...this.data_y];
        this.data_y_displays = {0: [...this.data_y], 1: [...this.data_y], 2: [...this.data_y], 3: [...this.data_y], 4: [...this.data_y]};

        this.algorithm_name = init_algorithm;

        this.chartjsdatasetobj = this.generate_base_chart_dataset();
    }

    private gen_random_int_inclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    private generate_yvals(): number[]
    {
        let outarr: number[] = [];

        for (let i = 0; i < this.data_set_size; i++) {
            outarr.push(this.gen_random_int_inclusive(1, this.data_set_size+1));       
        }

        return outarr;
    }

    private generate_base_chart_dataset(): ChartData {   
        let base_col = "76, 114, 176"
        let discrep_col = "196, 78, 82"
        let corrected_col = "85, 168, 104"
        let seeking_col = "76, 174, 255"
        let selected_col = "204, 185, 116"

        return {
            labels: this.data_x,
            datasets: [
                {
                    label: "BASE",
                    data: this.data_y_displays[HIGHLIGHT_TYPE.BASE],
                    backgroundColor: `rgba(${base_col}, 0.8)`,
                    borderColor: `rgba(${base_col}, 1)`,
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
                {
                    label: "DISCREPANCY",
                    data: this.data_y_displays[HIGHLIGHT_TYPE.DISCREPANCY],
                    backgroundColor: `rgba(${discrep_col}, 0.8)`,
                    borderColor: `rgba(${discrep_col}, 1)`,
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
                {
                    label: "CORRECTED",
                    data: this.data_y_displays[HIGHLIGHT_TYPE.CORRECTED],
                    backgroundColor: `rgba(${corrected_col}, 0.8)`,
                    borderColor: `rgba(${corrected_col}, 1)`,
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
                {
                    label: "SEEKING",
                    data: this.data_y_displays[HIGHLIGHT_TYPE.SEEKING],
                    backgroundColor: `rgba(${seeking_col}, 0.8)`,
                    borderColor: `rgba(${seeking_col}, 1)`,
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
                {
                    label: "SELECTED",
                    data: this.data_y_displays[HIGHLIGHT_TYPE.SELECTED],
                    backgroundColor: `rgba(${selected_col}, 0.8)`,
                    borderColor: `rgba(${selected_col}, 1)`,
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
            ],
        };
    };

    // append colored dataset with specific indicies actually containing values, rest are 0
    // set everything but the indices to 0 for base, opposite for highlight
    public highlight_dataset(highlights: HighlightedIndex[])
    {
        for (let highlight of highlights)
        {
            let selected_color = this.data_y_displays[highlight.color];
            selected_color = new Array(this.data_set_size).fill(0);
            for (let indice of highlight.indices)
            {
                selected_color[indice] = this.data_y[indice];
                this.data_y_displays[HIGHLIGHT_TYPE.BASE][indice] = 0;
            }
        }
    }
}

const mdl = new SortingDatasetModel("Quick Sort");