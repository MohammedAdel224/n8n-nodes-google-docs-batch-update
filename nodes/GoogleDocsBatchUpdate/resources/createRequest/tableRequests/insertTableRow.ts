import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ITableCellLocation, TableCellLocation } from '../../../objects/tableCellLocation';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestInsertTableRow = {
    resource: ['createRequest'],
    operation: ['insertTableRow'],
};

const tableCellLocation = new TableCellLocation(showForCreateRequestInsertTableRow);

export const insertTableRowDescription: INodeProperties[] = [
    ...tableCellLocation.getDescription().filter(prop => prop.name !== 'columnIndex'),
    {
        displayName: 'Insert Below',
        name: 'insertBelow',
        type: 'boolean',
        default: true,
        description: 'Whether to insert new row below the reference cell location',
        displayOptions: {
            show: showForCreateRequestInsertTableRow,
        },
    },
];

export const createInsertTableRowRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IInsertTableRowRequest => {
        const location = tableCellLocation.getObject(input, itemIndex);
        const insertBelow = input.getNodeParameter('insertBelow', itemIndex, true) as boolean;

        return {
            insertTableRow: {
                tableCellLocation: location,
                insertBelow,
            }
        };
    }
);

interface IInsertTableRowRequest extends IGoogleDocsRequest {
    insertTableRow: {
        tableCellLocation?: ITableCellLocation;
        insertBelow: boolean;
    };
}

const insertTableRowRequest: RequestDefinition = {
    name: 'Insert Table Row',
    value: 'insertTableRow',
    category: 'Tables',
    description: insertTableRowDescription,
    operation: createInsertTableRowRequest,
};

registerRequest(insertTableRowRequest);
