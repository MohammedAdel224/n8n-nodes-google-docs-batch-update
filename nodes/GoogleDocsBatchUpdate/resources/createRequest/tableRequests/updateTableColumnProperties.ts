import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ILocation, Location } from '../../../objects/location';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';
import { TableColumnProperties, ITableColumnProperties } from '../../../objects/tableColumnProperties';

const showForCreateRequestUpdateTableColumnProperties = {
    resource: ['createRequest'],
    operation: ['updateTableColumnProperties'],
};

const location = new Location(showForCreateRequestUpdateTableColumnProperties);
const tableColumnProperties = new TableColumnProperties();

export const updateTableColumnPropertiesDescription: INodeProperties[] = [
    ...location.getDescription().map((property) => { 
        return property.name === 'index'? 
        {...property, displayName: 'Table Start Index'} 
        : property;
    }),
    {
        displayName: 'Column Indices',
        name: 'columnIndices',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'e.g. 0 or [0, 2]',
        displayOptions: {
            show: showForCreateRequestUpdateTableColumnProperties,
        },
        description: 'The zero-based column indices whose properties should be updated. If no indices are specified, all columns will be updated.',
    },
    {
        displayName: 'Properties',
        name: 'properties',
        type: 'collection',
        placeholder: 'Add Property',
        default: {},
        displayOptions: {
            show: showForCreateRequestUpdateTableColumnProperties,
        },
        options: tableColumnProperties.getDescription(),
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
        options: tableColumnProperties.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestUpdateTableColumnProperties,
        },
    },
];

export const createUpdateTableColumnPropertiesRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IUpdateTableColumnPropertiesRequest => {
        const locationObj = location.getObject(input, itemIndex);
        const tableStartLocation = locationObj;

        let columnIndices = input.getNodeParameter('columnIndices', itemIndex, null) as string | number | string[]| number[];
        let columnIndicesArray: number[] = [];

        if (columnIndices !== null) {
            if (typeof columnIndices === 'string') {
                columnIndices = columnIndices.startsWith('[') ? columnIndices.slice(1, -1) : columnIndices;
                columnIndices = columnIndices.endsWith(']') ? columnIndices.slice(0, -1) : columnIndices;
                columnIndicesArray = columnIndices.split(',').map(id => parseInt(id.trim(), 10));
            }
            else if(Array.isArray(columnIndices)) {
                columnIndicesArray = columnIndices.map(index => Number(index));
            }
            else {
                columnIndicesArray = [columnIndices];
            }
        }

        const properties = tableColumnProperties.getObject(input, itemIndex, 'properties');
        const fieldsArr = input.getNodeParameter('fields', itemIndex, []) as string[];
        const fields = fieldsArr.join(',');

        return {
            updateTableColumnProperties: {
                tableStartLocation,
                columnIndices: columnIndicesArray,
                tableColumnProperties: properties,
                fields,
            }
        };
    }
);

interface IUpdateTableColumnPropertiesRequest extends IGoogleDocsRequest {
    updateTableColumnProperties: {
        tableStartLocation?: ILocation;
        columnIndices: number[];
        tableColumnProperties: ITableColumnProperties;
        fields: string;
    }
}

const updateTableColumnPropertiesRequest: RequestDefinition = {
    name: 'Update Table Column Properties',
    value: 'updateTableColumnProperties',
    category: 'Tables',
    description: updateTableColumnPropertiesDescription,
    operation: createUpdateTableColumnPropertiesRequest,
};

registerRequest(updateTableColumnPropertiesRequest);
