export enum HIGHLIGHT_TYPE {
    BASE,
    DISCREPANCY,
    CORRECTED,
    SEEKING,
    SEEKING_ALT,
    SELECTED,
    DIM_BASE,
    DIM_DISCREPANCY,
    DIM_CORRECTED,
    DIM_SEEKING,
    DIM_SEEKING_ALT,
    DIM_SELECTED,
}

export type ColorMapping = {
    [s in HIGHLIGHT_TYPE]: string;
};

export const ColorMap: ColorMapping = {
    0: "rgb(76, 114, 176)",
    1: "rgb(196, 78, 82)",
    2: "rgb(85, 168, 104)",
    3: "rgb(76, 174, 255)",
    4: "rgb(194, 147, 233)",
    5: "rgb(204, 185, 116)",

    // dims
    6: "rgba(76, 114, 176, 0.5)",
    7: "rgba(196, 78, 82, 0.5)",
    8: "rgba(85, 168, 104, 0.5)",
    9: "rgba(76, 174, 255, 0.5)",
    10: "rgba(194, 147, 233, 0.5)",
    11: "rgba(204, 185, 116, 0.5)",
}