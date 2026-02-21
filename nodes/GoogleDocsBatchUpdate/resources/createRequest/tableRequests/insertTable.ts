import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IInsertionLocation, InsertionLocation } from '../../../objects/insertionLocation';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestInsertTable = {
    resource: ['createRequest'],
    operation: ['insertTable'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestInsertTable);

export const insertTableDescription: INodeProperties[] = [
    {
        displayName: 'Rows',
        name: 'rows',
        type: 'number',
        default: 1,
        description: 'The number of rows in the table',
        displayOptions: {
            show: showForCreateRequestInsertTable,
        },
    },
    {
        displayName: 'Columns',
        name: 'columns',
        type: 'number',
        default: 1,
        description: 'The number of columns in the table',
        displayOptions: {
            show: showForCreateRequestInsertTable,
        },
    },
    ...insertionLocation.getDescription()
];

export const createInsertTableRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IInsertTableRequest => {
        const rows = input.getNodeParameter('rows', itemIndex) as number;
        const columns = input.getNodeParameter('columns', itemIndex) as number;
        const location = insertionLocation.getObject(input, itemIndex);

        return {
            insertTable: {
                rows,
                columns,
                ...location
            }
        };
    }
);

export interface IInsertTableRequest extends IBaseGoogleDocsRequest {
    insertTable: {
        rows: number;
        columns: number;
    } & IInsertionLocation;
}

const insertTableRequest: RequestDefinition = {
    name: 'Insert Table',
    value: 'insertTable',
    category: 'Tables',
    description: insertTableDescription,
    operation: createInsertTableRequest,
};

registerRequest(insertTableRequest);
