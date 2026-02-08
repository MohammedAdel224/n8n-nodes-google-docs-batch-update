import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ITableCellLocation, TableCellLocation } from '../../../objects/tableCellLocation';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestDeleteTableColumn = {
    resource: ['createRequest'],
    operation: ['deleteTableColumn'],
};

const tableCellLocation = new TableCellLocation(showForCreateRequestDeleteTableColumn);

export const deleteTableColumnDescription: INodeProperties[] = [
    ...tableCellLocation.getDescription().filter(prop => prop.name !== 'rowIndex'),
];

export const createDeleteTableColumnRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IDeleteTableColumnRequest => {
        const location = tableCellLocation.getObject(input, itemIndex, '');

        return {
            deleteTableColumn: {
                tableCellLocation: location,
            }
        };
    }
);

interface IDeleteTableColumnRequest extends IGoogleDocsRequest {
    deleteTableColumn: {
        tableCellLocation?: ITableCellLocation
    }
}

const deleteTableColumnRequest: RequestDefinition = {
    name: 'Delete Table Column',
    value: 'deleteTableColumn',
    category: 'Tables',
    description: deleteTableColumnDescription,
    operation: createDeleteTableColumnRequest,
};

registerRequest(deleteTableColumnRequest);
