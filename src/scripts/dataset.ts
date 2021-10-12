import { ChartData } from "chart.js";


interface DatasetConfig {
    size: number;
    name: string;
    color: [number, number, number];
}

class SortingDatasetModel {
    data_set_size: number;
    step_counter: number;

    data_x: number[];

    data_original: number[];
    data_y: number[];

    algorithm_name: string;


    constructor(init_algorithm: string)
    {
        this.data_set_size = 20;
        this.step_counter = 0;

        this.data_x = Array.from({length: 10}, (_, i) => i + 1);
        this.data_original = [];
        this.data_y = [];

        this.algorithm_name = init_algorithm;
    }

    private getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }
    
    
    
    private generate_dataset(datasetparams: DatasetConfig): ChartData {
        let data_x: number[] = [];
        let data_y: number[] = [];
    
        for (let i = 0; i < datasetparams.size; i++) {
            data_x[i] = i;
            data_y[i] = this.getRandomIntInclusive(1, datasetparams.size);
        }
    
        let color = `${datasetparams.color[0]}, ${datasetparams.color[1]}, ${datasetparams.color[2]}`;
    
        return {
            labels: data_x,
            datasets: [
                {
                    label: "Datapoints",
                    data: data_y,
                    backgroundColor: [`rgba(${color}, 0.8)`],
                    borderColor: [`rgba(${color}, 1)`],
                    borderWidth: 2,
                    barPercentage: 0.6,
                },
            ],
        };
    };
    
}

const mdl = new SortingDatasetModel("Quick Sort");