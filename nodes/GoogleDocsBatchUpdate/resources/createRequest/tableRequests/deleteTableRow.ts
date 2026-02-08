import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ITableCellLocation, TableCellLocation } from '../../../objects/tableCellLocation';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestDeleteTableRow = {
    resource: ['createRequest'],
    operation: ['deleteTableRow'],
};

const tableCellLocation = new TableCellLocation(showForCreateRequestDeleteTableRow);

export const deleteTableRowDescription: INodeProperties[] = [
    ...tableCellLocation.getDescription().filter(prop => prop.name !== 'columnIndex'),
];

export const createDeleteTableRowRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IDeleteTableRowRequest => {
        const location = tableCellLocation.getObject(input, itemIndex, '');

        return {
            deleteTableRow: {
                tableCellLocation: location,
            }
        };
    }
);

interface IDeleteTableRowRequest extends IGoogleDocsRequest {
    deleteTableRow: {
        tableCellLocation?: ITableCellLocation
    };
}

const deleteTableRowRequest: RequestDefinition = {
    name: 'Delete Table Row',
    value: 'deleteTableRow',
    category: 'Tables',
    description: deleteTableRowDescription,
    operation: createDeleteTableRowRequest,
};

registerRequest(deleteTableRowRequest);
