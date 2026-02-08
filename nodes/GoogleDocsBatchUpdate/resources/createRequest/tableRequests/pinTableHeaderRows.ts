import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ILocation, Location } from '../../../objects/location';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestPinTableHeaderRows = {
	resource: ['createRequest'],
	operation: ['pinTableHeaderRows'],
};

const location = new Location(showForCreateRequestPinTableHeaderRows);

export const pinTableHeaderRowsDescription: INodeProperties[] = [
	{
		displayName: 'Table Header Row Count',
		name: 'tableHeaderRowCount',
		type: 'number',
		default: 1,
		required: true,
		description: 'The number of table rows to pin as header rows',
		displayOptions: {
			show: showForCreateRequestPinTableHeaderRows,
		},
	},
	...location.getDescription().map((property) => { 
        return property.name === 'index'? 
        {...property, displayName: 'Table Start Index'} 
        : property;
    }),
];

export const createPinTableHeaderRowsRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IPinTableHeaderRowsRequest => {
		const tableHeaderRowCount = input.getNodeParameter('tableHeaderRowCount', itemIndex) as number;
		const tableStartLocation = location.getObject(input, itemIndex);

		return {
			pinTableHeaderRows: {
				tableHeaderRowCount,
				tableStartLocation,
			},
		};
	},
);

interface IPinTableHeaderRowsRequest extends IGoogleDocsRequest {
	pinTableHeaderRows: {
		tableHeaderRowCount: number;
		tableStartLocation?: ILocation;
	};
}

const pinTableHeaderRowsRequest: RequestDefinition = {
	name: 'Pin Table Header Rows',
	value: 'pinTableHeaderRows',
	category: 'Tables',
	description: pinTableHeaderRowsDescription,
	operation: createPinTableHeaderRowsRequest,
};

registerRequest(pinTableHeaderRowsRequest);
