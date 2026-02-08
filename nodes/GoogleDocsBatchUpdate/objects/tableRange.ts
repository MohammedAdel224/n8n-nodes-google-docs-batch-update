import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { ITableCellLocation, TableCellLocation } from './tableCellLocation';

export interface ITableRange extends IObject {
    tableCellLocation?: ITableCellLocation;
    rowSpan?: number;
    columnSpan?: number;
}

export class TableRange extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const tableCellLocation = new TableCellLocation(show);

        const description: INodeProperties[] = [
            ...tableCellLocation.getDescription(),
            {
                displayName: 'Row Span',
                name: 'rowSpan',
                type: 'number',
                default: 1,
                displayOptions: {
                    show: show,
                },
            },
            {
                displayName: 'Column Span',
                name: 'columnSpan',
                type: 'number',
                default: 1,
                displayOptions: {
                    show: show,
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITableRange | undefined {
        const rowSpan = input.getNodeParameter(path ? `${path}.rowSpan` : 'rowSpan', itemIndex, 1) as number;
        const columnSpan = input.getNodeParameter(path ? `${path}.columnSpan` : 'columnSpan', itemIndex, 1) as number;

        const tableRange: ITableRange = {};
        const tableCellLocation = new TableCellLocation();
        const tableStartLocation = tableCellLocation.getObject(input, itemIndex, path);
        
        if (tableStartLocation) tableRange.tableCellLocation = tableStartLocation;
        if (rowSpan) tableRange.rowSpan = rowSpan;
        if (columnSpan) tableRange.columnSpan = columnSpan;

        if (Object.keys(tableRange).length === 0) {
            return undefined;
        }

        return tableRange;
    }
}
