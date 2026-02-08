import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';
import { TabProperties, ITabProperties } from '../../../objects/tabProperties';

const showForCreateRequestUpdateDocumentTabProperties = {
	resource: ['createRequest'],
	operation: ['updateDocumentTabProperties'],
};

const tabProperties = new TabProperties();

export const updateDocumentTabPropertiesDescription: INodeProperties[] = [
	{
		displayName: 'Tab Properties',
		name: 'tabProperties',
		type: 'collection',
		placeholder: 'Add Property',
		default: {},
		displayOptions: {
			show: showForCreateRequestUpdateDocumentTabProperties,
		},
		options: tabProperties.getDescription(),
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'multiOptions',
		options: tabProperties.getDescriptionAsOptions(),
		default: [],
		description: 'The fields that should be updated',
		displayOptions: {
			show: showForCreateRequestUpdateDocumentTabProperties,
		},
	},
];

export const createUpdateDocumentTabPropertiesRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IUpdateDocumentTabPropertiesRequest => {
		const fields = input.getNodeParameter('fields', itemIndex, []) as string[];
		const properties = tabProperties.getObject(input, itemIndex, 'tabProperties');

		return {
			updateDocumentTabProperties: {
				tabProperties: properties,
				fields: fields.join(','),
			},
		};
	},
);

interface IUpdateDocumentTabPropertiesRequest extends IGoogleDocsRequest {
	updateDocumentTabProperties: {
		tabProperties?: ITabProperties;
		fields: string;
	};
}

const updateDocumentTabPropertiesRequest: RequestDefinition = {
	name: 'Update Document Tab Properties',
	value: 'updateDocumentTabProperties',
	category: 'Tabs',
	description: updateDocumentTabPropertiesDescription,
	operation: createUpdateDocumentTabPropertiesRequest,
};

registerRequest(updateDocumentTabPropertiesRequest);
