import { ChartData } from "chart.js";


enum HIGHLIGHT_TYPE {
    BASE,
    DISCREPANCY,
    CORRECTED,
    SEEKING,
    SEEKING_ALT,
    SELECTED,
}

type HighlightedIndex = {
    color: HIGHLIGHT_TYPE;
    indices: number[];
    excl_indices?: number[];
}

type SortStep = {
    highlights: HighlightedIndex[];
    keep_prev_highlight?: boolean;
    message: number;
    changes?: [number, number][];
}

interface SortingOperation {
    name: string;
    steps: SortStep[];
    data_y: number[];
    messages?: string[];
}

interface algorithm {
    generate(): SortingOperation;
}

export type Algorithms = "Bubble Sort" | "Selection Sort";

type AlgorithmData = Record<Algorithms, algorithm>;

export class SortingOperationGenerator {
    data_set_size: number = 20;

    private data_x: number[];
    private data_original: number[]; // Returning to original dataset
    private data_y: number[]; // Actual sorting

    private readonly algorithms: AlgorithmData;
    public current_algorithm: Algorithms = "Bubble Sort";

    constructor(init_algorithm?: Algorithms, dataset_size?: number) {
        if (dataset_size) this.data_set_size = dataset_size;

        this.data_x = Array.from({ length: this.data_set_size }, (_, i) => i);
        this.data_y = this.generate_yvals();
        this.data_original = [...this.data_y];

        this.algorithms = {
            "Bubble Sort": { generate: () => this.generate_bubblesort_steps() },
            "Selection Sort": { generate: () => this.generate_selectionsort_steps() },
        }

        if (init_algorithm)
        {
            this.current_algorithm = init_algorithm;
        }
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
        this.data_y = [...this.data_original];
    }

    private generate_bubblesort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        const messages = ["Bubble Sort", "Searching for a pair in which left > right.", "Detected a pair of misplaced values.", "Swapped the misordered values.", "Bubble Sort: Complete"];

        let clear = false;

        sort_steps.push({ highlights: [], message: 0 });

        while (!clear) {
            clear = true;
            for (let i = 0; i < this.data_set_size - 1; i++) {
                if (this.data_y[i] > this.data_y[i + 1]) {
                    sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.BASE, indices: [], excl_indices: [] }, { color: HIGHLIGHT_TYPE.DISCREPANCY, indices: [i, i + 1] }], message: 2 });

                    let temp = this.data_y[i + 1];
                    this.data_y[i + 1] = this.data_y[i];
                    let replace_higher_with_lower: [number, number] = [i + 1, this.data_y[i]];

                    this.data_y[i] = temp;
                    let restore_higher_from_temp: [number, number] = [i, temp];

                    clear = false;

                    sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.BASE, indices: [], excl_indices: [] }, { color: HIGHLIGHT_TYPE.CORRECTED, indices: [i, i + 1] }], message: 3, changes: [replace_higher_with_lower, restore_higher_from_temp] });
                }
                else {
                    sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.BASE, indices: [], excl_indices: [] }, { color: HIGHLIGHT_TYPE.SEEKING, indices: [i, i + 1] }], message: 1 });
                }
            }
        }

        sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: this.data_x }], message: 4, });

        this.return_to_original();

        return { name: "Bubble Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }

    private generate_selectionsort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        const messages = [
            "Selection Sort",
            "Incremented swap index.",
            "Searching for a value lower than the last low.",
            "Found a lower value. Will continue searching for an even lower one.",
            "Swapping the swap index for the lowest value.",
            "Swap complete.",
            "Didn't find any lower values, incrementing swap index.",
            "Selection Sort: Complete"
        ];

        sort_steps.push({ highlights: [], message: 0 });

        let data_length = this.data_x.length;
        let step: SortStep;
        for (let i = 0; i < data_length; i++) {
            let j_min = i;
            step = { highlights: [{ color: HIGHLIGHT_TYPE.SELECTED, indices: [i] }], message: 1 };
            sort_steps.push(step);

            for (let j = i + 1; j < data_length; j++) {
                if (this.data_y[j] < this.data_y[j_min]) {
                    j_min = j;
                    step = { highlights: [{ color: HIGHLIGHT_TYPE.SEEKING, indices: [j] }, { color: HIGHLIGHT_TYPE.SEEKING_ALT, indices: [j_min] }, { color: HIGHLIGHT_TYPE.SELECTED, indices: [i] }], message: 3 };
                    sort_steps.push(step);
                }
                else {
                    step = { highlights: [{ color: HIGHLIGHT_TYPE.SEEKING, indices: [j] }, { color: HIGHLIGHT_TYPE.SEEKING_ALT, indices: [j_min] }, { color: HIGHLIGHT_TYPE.SELECTED, indices: [i] }], message: 2 };
                    sort_steps.push(step);
                }
            }

            if (j_min !== i) {
                step = { highlights: [{ color: HIGHLIGHT_TYPE.DISCREPANCY, indices: [i, j_min] }], message: 4 }
                sort_steps.push(step);

                let tmp = this.data_y[j_min];

                this.data_y[j_min] = this.data_y[i];
                const replace_new_low_index_with_minimum: [number, number] = [j_min, this.data_y[i]];

                this.data_y[i] = tmp;
                const replace_last_minimum_with_temp: [number, number] = [i, tmp];

                step = { highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [i, j_min] }], changes: [replace_new_low_index_with_minimum, replace_last_minimum_with_temp], message: 5 }
                sort_steps.push(step);
            }
            else {
                step = { highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [i] }], message: 6 }
                sort_steps.push(step);
            }
        }

        step = { highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [], excl_indices: [] }], message: 7 }
        sort_steps.push(step);

        this.return_to_original();

        return { name: "Selection Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }

    private randomize_y(): void {
        this.data_y = this.generate_yvals();
        this.data_original = [...this.data_y];
    }

    get name(): string {
        return this.current_algorithm;
    }

    public generate_new_operation(): SortingOperation {
        this.randomize_y();
        return this.algorithms[this.current_algorithm].generate();
    }

    public regenerate_operation(): SortingOperation {
        this.return_to_original();
        let out = this.algorithms[this.current_algorithm].generate(); 
        
        return out; 
    }

    public change_dataset_size(size: number): void {
        if (size < 5 || size > 20) {
            return;
        }

        this.data_set_size = size;
    }
}

export class SortingOperationController {
    private operation: SortingOperation;
    private highlight_cols: string[] = ["rgb(76, 114, 176)", "rgb(196, 78, 82)", "rgb(85, 168, 104)", "rgb(76, 174, 255)", "rgb(194, 147, 233)", "rgb(204, 185, 116)"];
    private data_highlights: string[]; // Highlight diffing

    private data_x: number[];
    private data_y_original: number[];

    public name: string;

    public step_counter: number;

    public messages: string[];
    public message_history: number[];

    public complete: boolean = false;


    constructor(operation: SortingOperation) {
        this.operation = operation;
        this.name = operation.name;

        this.step_counter = 0;

        if (operation.messages) {
            this.messages = operation.messages;
        }
        else {
            this.messages = ["Undocumented Step"];
        }
        this.message_history = [0];

        this.data_highlights = new Array(this.operation.data_y.length).fill(this.highlight_cols[0]);
        this.data_x = Array.from({ length: this.operation.data_y.length }, (_, i) => i + 1);
        this.data_y_original = [...operation.data_y];
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

    private highlight_step(sortingstep: SortStep): ChartData {
        let step_highlights = sortingstep.highlights;

        if (!sortingstep.keep_prev_highlight) {
            this.data_highlights.fill(this.highlight_cols[HIGHLIGHT_TYPE.BASE]);
        }

        for (let highlight of step_highlights) {
            if (highlight.excl_indices) {
                let selected_color = this.highlight_cols[highlight.color];

                for (let i = 0; i < this.data_x.length; i++) {
                    if (!highlight.excl_indices.includes(i)) {
                        this.data_highlights[i] = selected_color;
                    }
                }
            }
            else {
                let selected_color = this.highlight_cols[highlight.color];
                for (let indice of highlight.indices) {
                    this.data_highlights[indice] = selected_color;
                }
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
        if (!this.complete) {
            this.step_counter += 1;
            this.highlight_step(this.operation.steps[this.step_counter]);
            this.enact_step_changes(this.operation.steps[this.step_counter]);
            this.message_history.push(this.operation.steps[this.step_counter].message);

            if (this.message_history.length > 3) {
                this.message_history.shift();
            }
        }

        if (this.step_counter === this.operation.steps.length - 1) {
            this.complete = true;
            return this.get_chart_dataset();
        }

        return this.get_chart_dataset();
    }

    public retry(): ChartData {
        this.complete = false;
        this.data_highlights = new Array(this.operation.data_y.length).fill(this.highlight_cols[0]);
        this.step_counter = 0;
        this.operation.data_y = [...this.data_y_original];
        this.message_history = [0];


        return this.get_chart_dataset();
    }
}