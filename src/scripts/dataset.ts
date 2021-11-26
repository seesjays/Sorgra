import { ChartData } from "chart.js";
import { ColorMapping, ColorMap, HIGHLIGHT_TYPE } from "./colormap";

type HighlightedIndex = {
    color: HIGHLIGHT_TYPE;
    indices: number[];
    excl_indices?: number[];
}

type HighlightedBlockLayer = {
    color: HIGHLIGHT_TYPE;
    list: number;
    indices: number[];
    excl_indices?: number[];
}

type ColoredMessage = [string, HIGHLIGHT_TYPE];
export type MessageSet = ColoredMessage[];

type StepChange = [number, number];

type BlockModification = {
    layer: number;
    new_child?: [number, number[]];
    replace_child?: [number, number, number[]];
    add_list?: number;
    remove_list?: number;
}

type SortStep = {
    highlights: HighlightedIndex[];
    aux_highlights?: HighlightedIndex[];
    keep_prev_highlight?: boolean;

    message: number;
    step_message_color?: HIGHLIGHT_TYPE;

    changes?: StepChange[];
    aux_changes?: StepChange[];
}

interface SortingOperation {
    name: string;
    steps: SortStep[];
    data_y: number[];
    data_y_aux?: number[];
    messages?: ColoredMessage[];
}

interface algorithm {
    generate(): SortingOperation;
}

export type Algorithms = "Bubble Sort" | "Selection Sort" | "Insertion Sort" | "Quick Sort" | "Merge Sort";

type AlgorithmData = Record<Algorithms, algorithm>;

export class SortingOperationFactory {
    private data_set_size: number = 15;

    private data_x: number[];
    private data_original: number[]; // Returning to original dataset
    private data_y: number[]; // Actual sorting
    private aux_data_y: number[]; // Secondary array for Merge Sort (convoluted, I know.)

    private readonly algorithms: AlgorithmData;

    constructor(dataset_size?: number) {
        if (dataset_size) this.data_set_size = dataset_size;

        this.data_x = [];
        this.data_y = [];
        this.aux_data_y = [];
        this.data_original = [];
        this.populate_datasets();

        this.algorithms = {
            "Bubble Sort": { generate: () => this.generate_bubblesort_steps() },
            "Selection Sort": { generate: () => this.generate_selectionsort_steps() },
            "Insertion Sort": { generate: () => this.generate_insertionsort_steps() },
            "Quick Sort": { generate: () => this.generate_quicksort_steps() },
            "Merge Sort": { generate: () => this.generate_mergesort_steps() }
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

    private populate_datasets(): void {
        this.data_x = Array.from({ length: this.data_set_size }, (_, i) => i);
        this.data_y = this.generate_yvals();
        this.aux_data_y = [...this.data_y];
        this.data_original = [...this.data_y];
    }

    private return_to_original(): void {
        this.data_y = [...this.data_original];
    }

    private swap(x: number, y: number): [StepChange, StepChange] {
        let temp = this.data_y[x];

        this.data_y[x] = this.data_y[y];
        const replace_x_with_y: StepChange = [x, this.data_y[x]];

        this.data_y[y] = temp;
        const replace_y_with_x_from_temp: StepChange = [y, temp];

        return [replace_x_with_y, replace_y_with_x_from_temp];
    }

    private create_range(low: number, high: number, not_inclusive?: boolean): number[] {
        if (low === high) return [low];

        let inds: number[] = [];

        if (not_inclusive) {
            for (let ind = low; ind < high; ind++) {
                inds.push(ind)
            }

            return inds;
        }

        for (let ind = low; ind <= high; ind++) {
            inds.push(ind)
        }

        return inds;
    }

    private generate_bubblesort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        let step: SortStep;
        const messages: MessageSet = [
            ["Bubble Sort", HIGHLIGHT_TYPE.BASE],
            ["Searching for a pair where left > right.", HIGHLIGHT_TYPE.SEEKING],
            ["Detected a pair of misordered values.", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Swapped the misordered values.", HIGHLIGHT_TYPE.CORRECTED],
            ["Bubble Sort: Complete", HIGHLIGHT_TYPE.CORRECTED],
        ];

        let clear = false;

        sort_steps.push({ highlights: [], message: 0 });

        while (!clear) {
            clear = true;
            for (let i = 0; i < this.data_set_size - 1; i++) {
                if (this.data_y[i] > this.data_y[i + 1]) {
                    clear = false;

                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: [i, i + 1]
                            }
                        ],
                        message: 2
                    };
                    sort_steps.push(step);

                    let swapped = this.swap(i, i + 1);

                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.CORRECTED,
                                indices: [i, i + 1]
                            }
                        ],
                        changes: swapped,
                        message: 3,
                    }

                    sort_steps.push(step);
                }
                else {
                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.SEEKING,
                                indices: [i, i + 1]
                            }
                        ],
                        message: 1,
                    }

                    sort_steps.push(step);
                }
            }
        }

        sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: this.data_x }], message: messages.length - 1, });

        this.return_to_original();

        return { name: "Bubble Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }

    private generate_selectionsort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        const messages: MessageSet = [
            ["Selection Sort", HIGHLIGHT_TYPE.BASE],
            ["Incremented swap index.", HIGHLIGHT_TYPE.SELECTED],
            ["Searching for a value lower than the last low.", HIGHLIGHT_TYPE.SEEKING],
            ["Found a lower value. Will continue searching for an even lower one.", HIGHLIGHT_TYPE.SEEKING_ALT],
            ["Swapping the swap index value with the lowest value.", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Swap complete.", HIGHLIGHT_TYPE.CORRECTED],
            ["Didn't find any lower values, incrementing swap index.", HIGHLIGHT_TYPE.CORRECTED],
            ["Selection Sort: Complete", HIGHLIGHT_TYPE.CORRECTED]
        ];

        sort_steps.push({ highlights: [], message: 0 });

        let data_length = this.data_x.length;
        let step: SortStep;
        for (let i = 0; i < data_length; i++) {
            let j_min = i;
            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.SELECTED,
                        indices: [i]
                    }
                ],
                message: 1
            };
            sort_steps.push(step);

            for (let j = i + 1; j < data_length; j++) {
                if (this.data_y[j] < this.data_y[j_min]) {
                    j_min = j;

                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                indices: [j]
                            },
                            {
                                color: HIGHLIGHT_TYPE.SELECTED,
                                indices: [i]
                            }
                        ],
                        message: 3
                    };
                    sort_steps.push(step);
                }
                else {
                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.SEEKING,
                                indices: [j]
                            },
                            {
                                color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                indices: [j_min]
                            },
                            {
                                color: HIGHLIGHT_TYPE.SELECTED,
                                indices: [i]
                            }
                        ],
                        message: 2
                    };
                    sort_steps.push(step);
                }
            }

            if (j_min !== i) {
                step = {
                    highlights: [
                        {
                            color: HIGHLIGHT_TYPE.DISCREPANCY,
                            indices: [i, j_min]
                        }
                    ],
                    message: 4
                }
                sort_steps.push(step);

                let swapped = this.swap(j_min, i);

                step = {
                    highlights: [
                        {
                            color: HIGHLIGHT_TYPE.CORRECTED,
                            indices: [i, j_min]
                        }
                    ],
                    changes: swapped,
                    message: 5
                }
                sort_steps.push(step);
            }
            else {
                step = {
                    highlights: [
                        {
                            color: HIGHLIGHT_TYPE.CORRECTED,
                            indices: [i]
                        }
                    ],
                    message: 6
                }
                sort_steps.push(step);
            }
        }

        step = {
            highlights: [
                {
                    color: HIGHLIGHT_TYPE.CORRECTED,
                    indices: [],
                    excl_indices: []
                }
            ],
            message: messages.length - 1
        }
        sort_steps.push(step);

        this.return_to_original();

        return { name: "Selection Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }

    private generate_insertionsort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        let step: SortStep;
        const messages: MessageSet = [
            ["Insertion Sort", HIGHLIGHT_TYPE.BASE],
            ["Incremented selection index.", HIGHLIGHT_TYPE.SELECTED],
            ["Searching for a pair where the selection is lower than what's before it.", HIGHLIGHT_TYPE.SEEKING],
            ["Selection < left, swapping until selection >= left.", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Swap complete.", HIGHLIGHT_TYPE.CORRECTED],
            ["Done moving selection, jumping to selection index pre-swapping(purple).", HIGHLIGHT_TYPE.SEEKING_ALT],
            ["Insertion Sort: Complete", HIGHLIGHT_TYPE.CORRECTED]
        ];

        sort_steps.push({ highlights: [], message: 0 });

        step = {
            highlights: [
                {
                    color: HIGHLIGHT_TYPE.SELECTED,
                    indices: [1]
                },
            ],
            message: 1
        };
        sort_steps.push(step);

        for (let i = 1; i < this.data_y.length; i++) {
            let j = i;

            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.SEEKING,
                        indices: [j - 1]
                    },
                    {
                        color: HIGHLIGHT_TYPE.SELECTED,
                        indices: [j]
                    }
                ],
                message: 2
            };
            sort_steps.push(step);

            while (j > 0 && this.data_y[j - 1] > this.data_y[j]) {
                step = {
                    highlights: [
                        {
                            color: HIGHLIGHT_TYPE.DISCREPANCY,
                            indices: [j - 1]
                        },
                        {
                            color: HIGHLIGHT_TYPE.SELECTED,
                            indices: [j]
                        },
                        {
                            color: HIGHLIGHT_TYPE.SEEKING_ALT,
                            indices: [i + 1]
                        }
                    ],
                    message: 3
                };
                sort_steps.push(step);

                let swapped = this.swap(j, j - 1);

                step = {
                    highlights:
                        [
                            {
                                color: HIGHLIGHT_TYPE.CORRECTED,
                                indices: [j]
                            },
                            {
                                color: HIGHLIGHT_TYPE.SELECTED,
                                indices: [j - 1]
                            },
                            {
                                color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                indices: [i + 1]
                            }
                        ],
                    changes: swapped,
                    message: 4
                };
                sort_steps.push(step);

                j -= 1;
            }

            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.CORRECTED,
                        indices: [j]
                    },
                    {
                        color: HIGHLIGHT_TYPE.SEEKING_ALT,
                        indices: [i + 1]
                    }
                ],
                message: 5
            }
            sort_steps.push(step);
        }

        step = {
            highlights: [
                {
                    color: HIGHLIGHT_TYPE.CORRECTED,
                    indices: [],
                    excl_indices: []
                }
            ],
            message: 6
        }
        sort_steps.push(step);
        this.return_to_original();

        return { name: "Insertion Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }

    private generate_quicksort_steps(): SortingOperation {
        let sort_steps: SortStep[] = [];
        let step: SortStep;

        const messages: MessageSet = [
            ["Quick Sort", HIGHLIGHT_TYPE.BASE],
            ["Attempting quicksort on subarray left of the pivot index at this level of recursion.", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Attempting quicksort on subarray right of the pivot index at this level of recursion.", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Didn't quicksort subarray; it's either too small or doesn't exist. Moving to the previous level of recursion.", HIGHLIGHT_TYPE.DIM_BASE],
            ["Partitioning: Searching for values > or <= pivot. (depending on what hasn't been found).", HIGHLIGHT_TYPE.SEEKING],
            ["Partitioning: Found value > pivot, marking index for a swap later.", HIGHLIGHT_TYPE.SEEKING_ALT],
            ["Partitioning: Found value <= pivot, swapping marked values (itself, if a > value hasn't been found first).", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Partitioning: Swapped values (could've swapped with itself), now incrementing both indices.", HIGHLIGHT_TYPE.CORRECTED],
            ["Partitioning: Small index reached pivot index, swapping with large index (large ind might == small ind).", HIGHLIGHT_TYPE.DISCREPANCY],
            ["Partitioning: Pivot swapped, it's between lower and higher values now.", HIGHLIGHT_TYPE.CORRECTED],
            ["Partitioning complete, will use new pivot index to create next subarrays.", HIGHLIGHT_TYPE.SELECTED],
            ["Created new subarrays.", HIGHLIGHT_TYPE.DIM_DISCREPANCY],
            ["Quick Sort: Complete.", HIGHLIGHT_TYPE.CORRECTED],
        ];

        sort_steps.push({ highlights: [], message: 0 });

        const partition = (start: number, end: number): number => {
            // highlight
            let curr_part = this.create_range(start, end);

            let pivot_value = this.data_y[end];
            let partition_index = start;

            let highfound = false;

            for (let right_ind = start; right_ind < end; right_ind++) {
                if (this.data_y[right_ind] <= pivot_value) {
                    // found value < pivot, increment both left and right ind

                    step = {
                        highlights:
                            [
                                {
                                    color: HIGHLIGHT_TYPE.DIM_BASE,
                                    indices: [],
                                    excl_indices: curr_part
                                },
                                {
                                    color: HIGHLIGHT_TYPE.BASE,
                                    indices: curr_part
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                    indices: [partition_index]
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SEEKING,
                                    indices: [right_ind]
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SELECTED,
                                    indices: [end]
                                },
                            ],
                        message: 4
                    };
                    sort_steps.push(step);

                    step = {
                        highlights:
                            [
                                {
                                    color: HIGHLIGHT_TYPE.DIM_BASE,
                                    indices: [],
                                    excl_indices: curr_part
                                },
                                {
                                    color: HIGHLIGHT_TYPE.BASE,
                                    indices: curr_part
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SELECTED,
                                    indices: [partition_index]
                                },
                                {
                                    color: HIGHLIGHT_TYPE.DISCREPANCY,
                                    indices: [right_ind, partition_index]
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SELECTED,
                                    indices: [end]
                                },
                            ],
                        message: 6
                    };
                    sort_steps.push(step);

                    let step_changes = this.swap(right_ind, partition_index);

                    step = {
                        highlights:
                            [
                                {
                                    color: HIGHLIGHT_TYPE.DIM_BASE,
                                    indices: [],
                                    excl_indices: curr_part
                                },
                                {
                                    color: HIGHLIGHT_TYPE.BASE,
                                    indices: curr_part
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SELECTED,
                                    indices: [partition_index]
                                },
                                {
                                    color: HIGHLIGHT_TYPE.CORRECTED,
                                    indices: [right_ind, partition_index]
                                },
                                {
                                    color: HIGHLIGHT_TYPE.SELECTED,
                                    indices: [end]
                                },
                            ],
                        changes: step_changes,
                        message: 7
                    };
                    sort_steps.push(step);
                    partition_index++;
                    highfound = false;
                }
                else {
                    // found value > pivot, leave left ind(partition ind)
                    if (highfound) {
                        if (partition_index !== right_ind) {
                            step = {
                                highlights:
                                    [
                                        {
                                            color: HIGHLIGHT_TYPE.DIM_BASE,
                                            indices: [],
                                            excl_indices: curr_part
                                        },
                                        {
                                            color: HIGHLIGHT_TYPE.BASE,
                                            indices: curr_part
                                        },
                                        {
                                            color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                            indices: [partition_index]
                                        },
                                        {
                                            color: HIGHLIGHT_TYPE.SEEKING,
                                            indices: [right_ind]
                                        },
                                        {
                                            color: HIGHLIGHT_TYPE.SELECTED,
                                            indices: [end]
                                        },
                                    ],
                                message: 4
                            };
                            sort_steps.push(step);
                        }
                    }
                    else {
                        highfound = true;

                        step = {
                            highlights:
                                [
                                    {
                                        color: HIGHLIGHT_TYPE.DIM_BASE,
                                        indices: [],
                                        excl_indices: curr_part
                                    },
                                    {
                                        color: HIGHLIGHT_TYPE.BASE,
                                        indices: curr_part
                                    },
                                    {
                                        color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                        indices: [partition_index]
                                    },
                                    {
                                        color: HIGHLIGHT_TYPE.SEEKING,
                                        indices: [right_ind]
                                    },
                                    {
                                        color: HIGHLIGHT_TYPE.SELECTED,
                                        indices: [end]
                                    },
                                ],
                            message: 5
                        };
                        sort_steps.push(step);
                    }
                }
            }

            // swap end with element at partition index
            step = {
                highlights:
                    [
                        {
                            color: HIGHLIGHT_TYPE.DIM_BASE,
                            indices: [],
                            excl_indices: curr_part
                        },
                        {
                            color: HIGHLIGHT_TYPE.BASE,
                            indices: curr_part
                        },
                        {
                            color: HIGHLIGHT_TYPE.SELECTED,
                            indices: [partition_index]
                        },
                        {
                            color: HIGHLIGHT_TYPE.DISCREPANCY,
                            indices: [partition_index, end]
                        },
                        {
                            color: HIGHLIGHT_TYPE.SEEKING,
                            indices: [end]
                        },
                    ],
                message: 8
            };
            sort_steps.push(step);

            let step_changes = this.swap(partition_index, end);

            step = {
                highlights:
                    [
                        {
                            color: HIGHLIGHT_TYPE.DIM_BASE,
                            indices: [],
                            excl_indices: curr_part
                        },
                        {
                            color: HIGHLIGHT_TYPE.BASE,
                            indices: curr_part
                        },
                        {
                            color: HIGHLIGHT_TYPE.SELECTED,
                            indices: [partition_index]
                        },
                        {
                            color: HIGHLIGHT_TYPE.CORRECTED,
                            indices: [partition_index, end]
                        },
                        {
                            color: HIGHLIGHT_TYPE.SELECTED,
                            indices: [partition_index]
                        },
                    ],
                changes: step_changes,
                message: 9
            };
            sort_steps.push(step);

            step = {
                highlights:
                    [
                        {
                            color: HIGHLIGHT_TYPE.DIM_BASE,
                            indices: [],
                            excl_indices: curr_part
                        },
                        {
                            color: HIGHLIGHT_TYPE.BASE,
                            indices: curr_part
                        },
                        {
                            color: HIGHLIGHT_TYPE.SELECTED,
                            indices: [partition_index]
                        },
                    ],
                changes: step_changes,
                message: 10
            };
            sort_steps.push(step);

            return partition_index;
        }

        const quicksort = (start: number, end: number, prevpiv: number): void => {
            if (start < end) {
                const partition_index: number = partition(start, end);

                let left = this.create_range(start, partition_index - 1);
                let right = this.create_range(partition_index + 1, end);

                step = {
                    highlights:
                        [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: []
                            },
                            {
                                color: HIGHLIGHT_TYPE.DIM_DISCREPANCY,
                                indices: left
                            },
                            {
                                color: HIGHLIGHT_TYPE.DIM_DISCREPANCY,
                                indices: right
                            },
                            {
                                color: HIGHLIGHT_TYPE.SELECTED,
                                indices: [partition_index]
                            },
                        ],
                    message: 11
                };
                sort_steps.push(step);

                step = {
                    highlights:
                        [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: []
                            },
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: left
                            },
                            {
                                color: HIGHLIGHT_TYPE.DIM_DISCREPANCY,
                                indices: right
                            },
                            {
                                color: HIGHLIGHT_TYPE.SELECTED,
                                indices: [partition_index]
                            },
                        ],
                    message: 1
                };
                sort_steps.push(step);

                quicksort(start, partition_index - 1, partition_index);

                step = {
                    highlights:
                        [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: []
                            },
                            {
                                color: HIGHLIGHT_TYPE.DIM_DISCREPANCY,
                                indices: left
                            },
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: right
                            },
                            {
                                color: HIGHLIGHT_TYPE.SELECTED,
                                indices: [partition_index]
                            },
                        ],
                    message: 2
                };
                sort_steps.push(step);

                quicksort(partition_index + 1, end, partition_index);
            }
            else {
                step = {
                    highlights:
                        [
                            { color: HIGHLIGHT_TYPE.DIM_BASE, indices: [], excl_indices: [] },
                            { color: HIGHLIGHT_TYPE.SELECTED, indices: [prevpiv] }
                        ],
                    message: 3
                };
                sort_steps.push(step);
            }
        }

        quicksort(0, this.data_y.length - 1, this.data_y.length - 1);

        step = { highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: [], excl_indices: [] }], message: messages.length - 1 }
        sort_steps.push(step);
        this.return_to_original();

        return { name: "Quick Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y] };
    }

    private generate_mergesort_steps(): SortingOperation {
        // A clear benefit over ELPath, I've learned from the quicksort implementation,
        // is that recursivity is much easier to use (still hard to explain, without a second chart...)
        // What a convenience from not using generators! I can make things truly "recursive" because
        // the steps are already done, there's no "stopping point" as there is in a generator.
        // Hopefully with this newfound knowledge of the potential for recursion, I can implement this alg quicker.

        let sort_steps: SortStep[] = [];
        let step: SortStep;

        const messages: MessageSet =
            [
                ["Merge Sort", HIGHLIGHT_TYPE.BASE],
                ["Splitting: Divided subarray into halves.", HIGHLIGHT_TYPE.SELECTED],

                ["Splitting: Recursively splitting left subarray.", HIGHLIGHT_TYPE.SEEKING],
                ["Splitting: Recursively splitting right subarray.", HIGHLIGHT_TYPE.SEEKING],

                ["Splitting: Reached base case of 1 or fewer elements, moving up a recursion level.", HIGHLIGHT_TYPE.CORRECTED],

                ["Splitting: Finished splitting both subarrays at this level of recursion, now merging subarrays.", HIGHLIGHT_TYPE.DISCREPANCY],

                ["Merging: Incremented element replacement index.", HIGHLIGHT_TYPE.DISCREPANCY],
                
                ["Merging: Left marked element < right marked element, taking the left.", HIGHLIGHT_TYPE.DISCREPANCY],
                ["Merging: Right marked element is outside subarray, taking the left.", HIGHLIGHT_TYPE.DISCREPANCY],
                
                ["Merging: Left marked element >= right marked element, taking the right.", HIGHLIGHT_TYPE.DISCREPANCY],
                ["Merging: Left marked element is past subarray midpoint, taking the right.", HIGHLIGHT_TYPE.DISCREPANCY],

                ["Merging: Replaced selected element with left marked element from work array, incremented left mark.", HIGHLIGHT_TYPE.DISCREPANCY],
                ["Merging: Replaced selected element with right marked element from work array, incremented right mark.", HIGHLIGHT_TYPE.DISCREPANCY],

                ["Merging: Incremented element replacement index.", HIGHLIGHT_TYPE.DISCREPANCY],
                ["Merging: Incremented element replacement index.", HIGHLIGHT_TYPE.DISCREPANCY],

                ["Finished merging elements, moving up a level of recursion.", HIGHLIGHT_TYPE.BASE],
                ["Merge Sort: Complete.", HIGHLIGHT_TYPE.CORRECTED],
            ];

        const merge_elements = (arrayone: number[], arraytwo: number[], start_ind: number, middle_ind: number, end_ind: number, call_layer: number): void => {
            call_layer++;

            let i = start_ind;
            let j = middle_ind;

            for (let current_el = start_ind; current_el < end_ind; current_el++) {
                step = {
                    highlights: [
                        {
                            color: HIGHLIGHT_TYPE.DIM_BASE,
                            indices: [],
                            excl_indices: [],
                        },
                        {
                            color: HIGHLIGHT_TYPE.BASE,
                            indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                        },
                        {
                            color: HIGHLIGHT_TYPE.SELECTED,
                            indices: [current_el],
                        },
                    ],
                    aux_highlights: [
                        {
                            color: HIGHLIGHT_TYPE.DIM_BASE,
                            indices: [],
                            excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                        },
                        {
                            color: HIGHLIGHT_TYPE.SEEKING,
                            indices: [i],
                        },
                        {
                            color: HIGHLIGHT_TYPE.SEEKING_ALT,
                            indices: [j],
                        },
                    ],
                    message: 6
                }
                sort_steps.push(step);

                if (i < middle_ind && (j >= end_ind || arrayone[i] <= arrayone[j])) {
                    let sel_msg = 7;
                    if (j >= end_ind) sel_msg = 8;

                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: [],
                            },
                            {
                                color: HIGHLIGHT_TYPE.BASE,
                                indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: [current_el],
                            },
                        ],
                        aux_highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: [i],
                            },
                            {
                                color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                indices: [j],
                            },
                        ],
                        message: sel_msg
                    }
                    sort_steps.push(step);

                    arraytwo[current_el] = arrayone[i];

                    const set_real_from_work_arr: StepChange = [current_el, arraytwo[current_el]];
                    i += 1;

                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: [],
                            },
                            {
                                color: HIGHLIGHT_TYPE.BASE,
                                indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.CORRECTED,
                                indices: [current_el],
                            },
                        ],
                        aux_highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.CORRECTED,
                                indices: [i],
                            },
                            {
                                color: HIGHLIGHT_TYPE.SEEKING_ALT,
                                indices: [j],
                            },
                        ],
                        changes: [set_real_from_work_arr],
                        message: 11
                    }
                    sort_steps.push(step);
                }
                else {
                    let sel_msg = 9;
                    if (i >= middle_ind) sel_msg = 10;
                    
                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: [],
                            },
                            {
                                color: HIGHLIGHT_TYPE.BASE,
                                indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: [current_el],
                            },
                        ],
                        aux_highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.SEEKING,
                                indices: [i],
                            },
                            {
                                color: HIGHLIGHT_TYPE.DISCREPANCY,
                                indices: [j],
                            },
                        ],
                        message: sel_msg
                    }
                    sort_steps.push(step);

                    arraytwo[current_el] = arrayone[j];

                    const set_real_from_work_arr: StepChange = [current_el, arraytwo[current_el]];
                    j += 1;

                    step = {
                        highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: [],
                            },
                            {
                                color: HIGHLIGHT_TYPE.BASE,
                                indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.CORRECTED,
                                indices: [current_el],
                            },
                        ],
                        aux_highlights: [
                            {
                                color: HIGHLIGHT_TYPE.DIM_BASE,
                                indices: [],
                                excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true),
                            },
                            {
                                color: HIGHLIGHT_TYPE.SEEKING,
                                indices: [i],
                            },
                            {
                                color: HIGHLIGHT_TYPE.CORRECTED,
                                indices: [j],
                            },
                        ],
                        changes: [set_real_from_work_arr],
                        message: 12
                    }
                    sort_steps.push(step);
                }
            }
        }

        const split_elements = (arrayone: number[], arraytwo: number[], start_ind: number, end_ind: number, call_layer: number): void => {
            call_layer++;
            console.log(`${call_layer}: ${Math.floor(start_ind)} - ${Math.floor(end_ind)}`);

            if (end_ind - start_ind <= 1) {
                // base case
                step = {
                    highlights: [
                        {
                            color: HIGHLIGHT_TYPE.DIM_BASE,
                            indices: [],
                            excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                        },
                        {
                            color: HIGHLIGHT_TYPE.CORRECTED,
                            indices: [Math.floor((start_ind + end_ind) / 2)],
                        },
                    ],
                    message: 4
                }

                sort_steps.push(step);
                return;
            }

            let middle_ind = Math.floor((end_ind + start_ind) / 2);

            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.DIM_BASE,
                        indices: [],
                        excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                    },
                    {
                        color: HIGHLIGHT_TYPE.SEEKING,
                        indices: this.create_range(Math.floor(start_ind), Math.floor(middle_ind), true)
                    },
                    {
                        color: HIGHLIGHT_TYPE.DIM_SEEKING,
                        indices: this.create_range(Math.floor(middle_ind), Math.floor(end_ind), true)
                    },
                ],
                message: 2
            }
            sort_steps.push(step);

            split_elements(arraytwo, arrayone, start_ind, middle_ind, call_layer);

            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.DIM_BASE,
                        indices: [],
                        excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                    },
                    {
                        color: HIGHLIGHT_TYPE.DIM_SEEKING,
                        indices: this.create_range(Math.floor(start_ind), Math.floor(middle_ind), true)
                    },
                    {
                        color: HIGHLIGHT_TYPE.SEEKING,
                        indices: this.create_range(Math.floor(middle_ind), Math.floor(end_ind), true)
                    },
                ],
                message: 3
            }
            sort_steps.push(step);

            split_elements(arraytwo, arrayone, middle_ind, end_ind, call_layer);

            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.DIM_BASE,
                        indices: [],
                        excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                    },
                    {
                        color: HIGHLIGHT_TYPE.DISCREPANCY,
                        indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                    },
                ],
                message: 5
            }
            sort_steps.push(step);

            merge_elements(arrayone, arraytwo, start_ind, middle_ind, end_ind, call_layer);

            step = {
                highlights: [
                    {
                        color: HIGHLIGHT_TYPE.DIM_BASE,
                        indices: [],
                        excl_indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                    },
                    {
                        color: HIGHLIGHT_TYPE.CORRECTED,
                        indices: this.create_range(Math.floor(start_ind), Math.floor(end_ind), true)
                    },
                ],
                message: 15
            }
            sort_steps.push(step);
        }

        const mergesort_topdown = (itemarray: number[]): void => {
            let work_array = this.aux_data_y;
            split_elements(itemarray, work_array, 0, work_array.length, 0);
            console.log(work_array);
        }

        sort_steps.push({ highlights: [], message: 0 });

        mergesort_topdown(this.data_y);

        sort_steps.push({ highlights: [{ color: HIGHLIGHT_TYPE.CORRECTED, indices: this.data_x }], message: messages.length - 1, });

        this.return_to_original();

        return { name: "Merge Sort", steps: sort_steps, messages: messages, data_y: [...this.data_y], data_y_aux: [...this.data_y] };
    }

    private randomize_y(): void {
        this.data_y = this.generate_yvals();
        this.aux_data_y = [...this.data_y];
        this.data_original = [...this.data_y];
    }

    public generate_new_operation(alg: Algorithms): SortingOperation {
        this.randomize_y();

        return this.algorithms[alg].generate();
    }

    public regenerate_operation(alg: Algorithms): SortingOperation {
        this.return_to_original();

        return this.algorithms[alg].generate();
    }

    public set_dataset_size(size: number): void {
        if (size < 5 || size > 20) {
            return;
        }

        this.data_set_size = size;
        this.populate_datasets();
    }
}

export class SortingOperationController {
    private operation: SortingOperation;
    private highlight_cols: ColorMapping;
    private data_highlights: string[]; // Highlight diffing
    private aux_highlights: string[]; // Highlight diffing

    private data_x: number[];
    private data_y_original: number[];

    public name: string;

    public step_counter: number;

    public messages: MessageSet;
    private message_history_len: number;
    public message_history: [number[], HIGHLIGHT_TYPE[]];

    public complete: boolean = false;


    constructor(operation: SortingOperation) {
        this.operation = operation;
        this.name = operation.name;

        this.step_counter = 0;

        if (operation.messages) {
            this.messages = operation.messages;
        }
        else {
            this.messages = [["Undocumented Step", HIGHLIGHT_TYPE.DIM_BASE]];
        }

        this.message_history_len = 4;
        this.message_history = [[0], [HIGHLIGHT_TYPE.BASE]];
        this.highlight_cols = ColorMap;

        this.data_highlights = new Array(this.operation.data_y.length).fill(this.highlight_cols[HIGHLIGHT_TYPE.BASE]);
        this.aux_highlights = [...this.data_highlights];
        this.data_x = Array.from({ length: this.operation.data_y.length }, (_, i) => i + 1);
        this.data_y_original = [...operation.data_y];
    }

    public get_chart_dataset(): ChartData[] {
        if (this.operation.data_y_aux) {
            return [{
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
            },
            {
                labels: this.data_x,
                datasets: [
                    {
                        label: "AUX",
                        data: this.operation.data_y_aux,
                        backgroundColor: this.aux_highlights,
                        borderWidth: 2,
                        barPercentage: 0.9,
                    },
                ],
            }];
        }
        else {
            return [{
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
            }];
        }
    };

    public get_max_y(): number {
        return Math.max(...this.data_y_original);
    }

    private highlight_step(sortingstep: SortStep): ChartData[] {
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

    private highlight_aux(sortingstep: SortStep): void {
        let step_highlights = sortingstep.aux_highlights;
        if (!sortingstep.keep_prev_highlight) {
            this.aux_highlights.fill(this.highlight_cols[HIGHLIGHT_TYPE.BASE]);
        }

        if (step_highlights) {
            for (let highlight of step_highlights) {
                if (highlight.excl_indices) {
                    let selected_color = this.highlight_cols[highlight.color];

                    for (let i = 0; i < this.data_x.length; i++) {
                        if (!highlight.excl_indices.includes(i)) {
                            this.aux_highlights[i] = selected_color;
                        }
                    }
                }
                else {
                    let selected_color = this.highlight_cols[highlight.color];
                    for (let indice of highlight.indices) {
                        this.aux_highlights[indice] = selected_color;
                    }
                }
            }

            return;
        }
    }

    private enact_step_changes(sortingstep: SortStep): void {
        let changes = sortingstep.changes;
        if (changes !== undefined) {
            for (let change of changes) {
                this.operation.data_y[change[0]] = change[1];
            }
        }
    }

    private update_message_history(sortingstep: SortStep): void {
        let color: HIGHLIGHT_TYPE = this.messages[sortingstep.message][1];

        this.message_history[0].unshift(sortingstep.message);
        this.message_history[1].unshift(color);

        if (this.message_history[0].length > this.message_history_len || this.message_history[1].length > this.message_history_len) {
            this.message_history[0].pop();
            this.message_history[1].pop();
        }

        return;
    }

    private reset_message_history(): void {
        this.message_history = [[0], [HIGHLIGHT_TYPE.BASE]];
    }

    public next_step(): ChartData[] {
        if (!this.complete) {
            this.step_counter += 1;
            this.highlight_step(this.operation.steps[this.step_counter]);
            this.highlight_aux(this.operation.steps[this.step_counter]);

            this.enact_step_changes(this.operation.steps[this.step_counter]);
            this.update_message_history(this.operation.steps[this.step_counter]);
        }

        if (this.step_counter === this.operation.steps.length - 1) {
            this.complete = true;
            return this.get_chart_dataset();
        }

        return this.get_chart_dataset();
    }

    public retry(): ChartData[] {
        this.complete = false;
        this.step_counter = 0;

        this.data_highlights = new Array(this.operation.data_y.length).fill(this.highlight_cols[HIGHLIGHT_TYPE.BASE]);
        this.aux_highlights = [...this.data_highlights];

        this.operation.data_y = [...this.data_y_original];
        if (this.operation.data_y_aux) this.operation.data_y_aux = [...this.data_y_original];

        this.reset_message_history();

        return this.get_chart_dataset();
    }
}