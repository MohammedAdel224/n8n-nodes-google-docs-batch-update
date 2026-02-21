import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';
import { ILocation, Location } from '../../../objects/location';
import { TableRowStyle, ITableRowStyle } from '../../../objects/tableRowStyle';

const showForCreateRequestUpdateTableRowStyle = {
    resource: ['createRequest'],
    operation: ['updateTableRowStyle'],
};

const location = new Location(showForCreateRequestUpdateTableRowStyle);
const tableRowStyle = new TableRowStyle();

export const updateTableRowStyleDescription: INodeProperties[] = [
    ...location.getDescription().map((property) => { 
        return property.name === 'index'? 
        {...property, displayName: 'Table Start Index'} 
        : property;
    }),
    {
        displayName: 'Row Indices',
        name: 'rowIndices',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'e.g. 0 or [0, 2]',
        description: 'The zero-based row indices of the rows whose style to update',
        displayOptions: {
            show: showForCreateRequestUpdateTableRowStyle,
        },
    },
    {
        displayName: 'Style',
        name: 'style',
        type: 'collection',
        description: 'Style fields',
        default: {},
        placeholder: 'Add Style Field',
        displayOptions: {
            show: showForCreateRequestUpdateTableRowStyle,
        },
        options: tableRowStyle.getDescription(),
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
        options: tableRowStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestUpdateTableRowStyle,
        },
    },
];

export const createUpdateTableRowStyleRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IUpdateTableRowStyleRequest => {
        const locationObj = location.getObject(input, itemIndex);
        const tableStartLocation = locationObj;

        let rowIndices = input.getNodeParameter('rowIndices', itemIndex, null) as string | number | string[]| number[];
        let rowIndicesArray: number[] = [];

        if (rowIndices !== null) {
            if (typeof rowIndices === 'string') {
                rowIndices = rowIndices.startsWith('[') ? rowIndices.slice(1, -1) : rowIndices;
                rowIndices = rowIndices.endsWith(']') ? rowIndices.slice(0, -1) : rowIndices;
                rowIndicesArray = rowIndices.split(',').map(id => parseInt(id.trim(), 10));
            }
            else if(Array.isArray(rowIndices)) {
                rowIndicesArray = rowIndices.map(index => Number(index));
            }
            else {
                rowIndicesArray = [rowIndices];
            }
        }

        const style = tableRowStyle.getObject(input, itemIndex, 'style');
        const fields = input.getNodeParameter('fields', itemIndex, []) as string[];

        return {
            updateTableRowStyle: {
                tableStartLocation,
                rowIndices: rowIndicesArray,
                tableRowStyle: style,
                fields: fields.join(','),
            }
        };
    }
);

export interface IUpdateTableRowStyleRequest extends IBaseGoogleDocsRequest {
    updateTableRowStyle: {
        tableStartLocation?: ILocation;
        rowIndices: number[];
        tableRowStyle: ITableRowStyle;
        fields: string;
    }
}

const updateTableRowStyleRequest: RequestDefinition = {
    name: 'Update Table Row Style',
    value: 'updateTableRowStyle',
    category: 'Tables',
    description: updateTableRowStyleDescription,
    operation: createUpdateTableRowStyleRequest,
};

registerRequest(updateTableRowStyleRequest);
