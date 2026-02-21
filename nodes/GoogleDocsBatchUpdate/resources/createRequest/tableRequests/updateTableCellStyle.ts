import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { Cells, ICells } from '../../../objects/cells';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';
import { TableCellStyle, ITableCellStyle } from '../../../objects/tableCellStyle';

const showForCreateRequestUpdateTableCellStyle = {
    resource: ['createRequest'],
    operation: ['updateTableCellStyle'],
};

const cells = new Cells(showForCreateRequestUpdateTableCellStyle);
const tableCellStyle = new TableCellStyle();

export const updateTableCellStyleDescription: INodeProperties[] = [
    ...cells.getDescription(),
    {
        displayName: 'Style',
        name: 'style',
        type: 'collection',
        description: 'Style fields',
        default: {},
        placeholder: 'Add Style Field',
        displayOptions: {
            show: showForCreateRequestUpdateTableCellStyle,
        },
        options: tableCellStyle.getDescription(),
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
            options: tableCellStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestUpdateTableCellStyle,
        },
    },
];

export const createUpdateTableCellStyleRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IUpdateTableCellStyleRequest => {
        const cellsObj = cells.getObject(input, itemIndex);
        const style = tableCellStyle.getObject(input, itemIndex, 'style');
        const fields = input.getNodeParameter('fields', itemIndex, []) as string[];

        return {
            updateTableCellStyle: {
                ...cellsObj,
                tableCellStyle: style,
                fields: fields.join(','),
            }
        };
    }
);

export interface IUpdateTableCellStyleRequest extends IBaseGoogleDocsRequest {
    updateTableCellStyle: {
        tableCellStyle: ITableCellStyle;
        fields: string;
    } & ICells;
}

const updateTableCellStyleRequest: RequestDefinition = {
    name: 'Update Table Cell Style',
    value: 'updateTableCellStyle',
    category: 'Tables',
    description: updateTableCellStyleDescription,
    operation: createUpdateTableCellStyleRequest,
};

registerRequest(updateTableCellStyleRequest);
