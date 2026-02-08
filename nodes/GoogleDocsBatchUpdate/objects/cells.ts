import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { ITableRange, TableRange } from './tableRange';
import { ILocation, Location } from './location';

export interface ICells extends IObject {
    tableRange?: ITableRange;
    tableStartLocation?: ILocation;
}

export class Cells extends IGoogleDocsObject {
    constructor(show: Record<string, string[]> = {}) {
        const tableRange = new TableRange({
            ...show,
            selectionType: ['tableRange'],
        });
        
        const location = new Location({
            ...show,
            selectionType: ['location'],
        });

        const description: INodeProperties[] = [
            {
                displayName: 'Selection Type',
                name: 'selectionType',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Table Range',
                        value: 'tableRange',
                    },
                    {
                        name: 'Location',
                        value: 'location',
                    },
                ],
                default: 'location',
                description: 'The type of selection to make',
                displayOptions: {
                    show: show,
                },
            },
            ...tableRange.getDescription(),
            ...location.getDescription(),
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ICells | undefined {
        const selectionTypePath = path ? `${path}.selectionType` : 'selectionType';
        const selectionType = input.getNodeParameter(selectionTypePath, itemIndex) as string;
        if ( selectionType === 'tableRange' ) {
            const tableRange = new TableRange();
            return tableRange.getObject(input, itemIndex, path);
        }
        else {
            const location = new Location();
            return location.getObject(input, itemIndex, path);
        }
    }
}
