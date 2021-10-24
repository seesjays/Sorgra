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

type SortStep = {
    highlights: HighlightedIndex[];
    message: number;
    changes?: [number, number][];
}

interface SortingOperation {
    name: string;
    steps: SortStep[];
    data_y: number[];
    messages?: string[];
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
        this.data_set_size = 15;
        this.step_counter = 0;

        this.data_x = Array.from({ length: this.data_set_size }, (_, i) => i);
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

    private return_to_original(): void {
        this.data_y = this.data_original;
    }

    public generate_bubblesort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        const messages = ["Searching for a pair in which left > right.", "Detected a pair of misplaced values.", "Swapped the misordered values.", "Complete"];

        let clear = false;

        sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.SEEKING, indices: [0, 1] }], message: 0 });

        while (!clear) {
            clear = true;
            for (let i = 0; i < this.data_set_size - 1; i++) {
                if (this.data_y[i] > this.data_y[i + 1]) {
                    sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.DISCREPANCY, indices: [i, i + 1] }, { color: HIGHLIGHT_TYPE.BASE, indices: Array.from(this.data_x.keys()).filter(x => (x !== i) && (x !== i + 1)) }], message: 1 });

                    let temp = this.data_y[i + 1];
                    this.data_y[i + 1] = this.data_y[i];
                    let replace_higher_with_lower: [number, number] = [i + 1, this.data_y[i]];

                    this.data_y[i] = temp;
                    let restore_higher_from_temp: [number, number] = [i, temp];


                    clear = false;

                    sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [i, i + 1] }, { color: HIGHLIGHT_TYPE.BASE, indices: Array.from(this.data_x.keys()).filter(x => (x !== i) && (x !== i + 1)) }], message: 2, changes: [replace_higher_with_lower, restore_higher_from_temp] });
                }
                else {
                    sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.SEEKING, indices: [i, i + 1] }, { color: HIGHLIGHT_TYPE.BASE, indices: Array.from(this.data_x.keys()).filter(x => (x !== i) && (x !== i + 1)) }], message: 0 });
                }
            }
        }

        sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: this.data_x }], message: 3, });

        this.return_to_original();
        return { name: "Bubble Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }


}

export class SortingOperationController {
    private operation: SortingOperation;
    private highlight_cols: string[] = ["rgb(76, 114, 176)", "rgb(196, 78, 82)", "rgb(85, 168, 104)", "rgb(76, 174, 255)", "rgb(204, 185, 116)"];
    private data_highlights: string[]; // Highlight diffing
    public step_counter: number;

    private data_x: number[];

    public complete: boolean = false;


    constructor(operation: SortingOperation) {
        this.operation = operation;

        this.step_counter = 0;

        this.data_highlights = new Array(this.operation.data_y.length).fill(this.highlight_cols[0]);
        this.data_x = Array.from({ length: this.operation.data_y.length }, (_, i) => i + 1);
    }

    public get_chart_dataset(): ChartData {
        return {
            labels: this.data_x,
            datasets: [
                {
                    label: "BASE",
                    data: this.operation.data_y,
                    backgroundColor: this.data_highlights,
                    borderWidth: 2,
                    barPercentage: 0.9,
                },
            ],
        };
    };

    private highlight_dataset_step(sortingstep: SortStep): ChartData {
        for (let highlight of sortingstep.highlights) {
            let selected_color = this.highlight_cols[highlight.color];
            for (let indice of highlight.indices) {
                this.data_highlights[indice] = selected_color;
            }
        }

        return this.get_chart_dataset();
    }

    private enact_step_changes(sortingstep: SortStep): void {
        let changes = sortingstep.changes;
        if (changes !== undefined) {
            for (let change of changes) {
                this.operation.data_y[change[0]] = change[1];
            }
        }
    }

    public next_step(): ChartData {
        if (this.step_counter === this.operation.steps.length - 1) {
            this.complete = true;
            return this.get_chart_dataset();
        }

        if (!this.complete) {
            this.step_counter += 1;
            this.highlight_dataset_step(this.operation.steps[this.step_counter]);
            this.enact_step_changes(this.operation.steps[this.step_counter]);
        }

        return this.get_chart_dataset();
    }
}