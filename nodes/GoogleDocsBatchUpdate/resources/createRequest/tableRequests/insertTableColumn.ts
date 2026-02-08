import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ITableCellLocation, TableCellLocation } from '../../../objects/tableCellLocation';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestInsertTableColumn = {
    resource: ['createRequest'],
    operation: ['insertTableColumn'],
};

const tableCellLocation = new TableCellLocation(showForCreateRequestInsertTableColumn);

export const insertTableColumnDescription: INodeProperties[] = [
    ...tableCellLocation.getDescription().filter(prop => prop.name !== 'rowIndex'),
    {
        displayName: 'Insert Right',
        name: 'insertRight',
        type: 'boolean',
        default: true,
        description: 'Whether to insert new column to the right of the reference cell location',
        displayOptions: {
            show: showForCreateRequestInsertTableColumn,
        },
    },
];

export const createInsertTableColumnRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IInsertTableColumnRequest => {
        const location = tableCellLocation.getObject(input, itemIndex, '');
        const insertRight = input.getNodeParameter('insertRight', itemIndex, true) as boolean;

        return {
            insertTableColumn: {
                tableCellLocation: location,
                insertRight,
            }
        };
    }
);

interface IInsertTableColumnRequest extends IGoogleDocsRequest {
    insertTableColumn: {
        tableCellLocation?: ITableCellLocation;
        insertRight: boolean;
    };
}

const insertTableColumnRequest: RequestDefinition = {
    name: 'Insert Table Column',
    value: 'insertTableColumn',
    category: 'Tables',
    description: insertTableColumnDescription,
    operation: createInsertTableColumnRequest,
};

registerRequest(insertTableColumnRequest);
