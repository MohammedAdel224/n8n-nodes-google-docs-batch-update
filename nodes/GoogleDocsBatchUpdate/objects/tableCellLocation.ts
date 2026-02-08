import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { ILocation, Location } from './location';

export interface ITableCellLocation extends IObject {
    tableStartLocation?: ILocation;
    rowIndex?: number;
    columnIndex?: number;
}

export class TableCellLocation extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const location = new Location(show);

        const description: INodeProperties[] = [
            ...location.getDescription().map((property) => {
                return property.name === 'index' ?
                    { ...property, displayName: 'Table Start Index' }
                    : property;
            }),
            {
                displayName: 'Row Index',
                name: 'rowIndex',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: show,
                },
            },
            {
                displayName: 'Column Index',
                name: 'columnIndex',
                type: 'number',
                default: 0,
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITableCellLocation | undefined {
        const location = new Location();
        const locationObj = location.getObject(input, itemIndex, path);
        const tableStartLocation = locationObj;

        const rowIndexPath = path ? `${path}.rowIndex` : 'rowIndex';
        const columnIndexPath = path ? `${path}.columnIndex` : 'columnIndex';

        const tableCellLocation = {} as ITableCellLocation;

        const rowIndex = input.getNodeParameter(rowIndexPath, itemIndex, 0) as number;
        const columnIndex = input.getNodeParameter(columnIndexPath, itemIndex, 0) as number;

        if (tableStartLocation) tableCellLocation.tableStartLocation = tableStartLocation;
        if (rowIndex !== undefined) tableCellLocation.rowIndex = rowIndex;
        if (columnIndex !== undefined) tableCellLocation.columnIndex = columnIndex;

        if (Object.keys(tableCellLocation).length !== 0) {
            return tableCellLocation;
        }

        return tableCellLocation;
    }
}
