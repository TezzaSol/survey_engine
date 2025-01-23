interface TableOptions {
    startX?: number;
    startY?: number;
    rowHeight?: number;
    headerFontSize?: number;
    cellPadding?: number;
    columnWidths?: number[];
}
export declare function generateTable(doc: any, data: any, columns: any, options?: TableOptions): void;
export {};
