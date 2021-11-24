import { HIGHLIGHT_TYPE } from "./colormap";

type BlockHighlightInfo = {
    color: HIGHLIGHT_TYPE;
    list: number;
    items: number[];
    excl_items?: number[];
}

type BlockList = number[];

type BlockLayer = {
    highlights: BlockHighlightInfo[];
    list_one?: BlockList; 
    list_two?: BlockList;
};

export type BlockTree = BlockLayer[];
