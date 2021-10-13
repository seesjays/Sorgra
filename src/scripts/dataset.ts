import { ChartData } from "chart.js";

class SortingDatasetModel {
    data_set_size: number;
    step_counter: number;

    data_x: number[];

    data_original: number[];
    data_y: number[];

    algorithm_name: string;

    chartjsdatasetobj: ChartData;

    constructor(init_algorithm: string)
    {
        this.data_set_size = 20;
        this.step_counter = 0;

        this.data_x = Array.from({length: 10}, (_, i) => i + 1);
        this.data_original = [];
        this.data_y = this.generate_yvals();

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
        return {
            labels: this.data_x,
            datasets: [
                {
                    label: "Base",
                    data: this.data_y,
                    backgroundColor: `rgba(76, 114, 176, 0.8)`,
                    borderColor: `rgba(76, 114, 176, 1)`,
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
            ],
        };
    };

    // append colored dataset with specific indicies actually containing values, rest are 0
    // TODO

}

const mdl = new SortingDatasetModel("Quick Sort");