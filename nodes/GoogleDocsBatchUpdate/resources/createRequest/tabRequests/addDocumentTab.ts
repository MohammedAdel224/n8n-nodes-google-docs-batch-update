import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { ITabProperties, TabProperties } from '../../../objects/tabProperties';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestAddDocumentTab = {
	resource: ['createRequest'],
	operation: ['addDocumentTab'],
};

const tabProperties = new TabProperties(showForCreateRequestAddDocumentTab);

export const addDocumentTabDescription: INodeProperties[] = [
	...tabProperties.getDescription(),
];

export const createAddDocumentTabRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IAddDocumentTabRequest => {
		const properties = tabProperties.getObject(input, itemIndex);

		return {
			addDocumentTab: {
				tabProperties: properties,
			},
		};
	},
);

export interface IAddDocumentTabRequest extends IBaseGoogleDocsRequest {
	addDocumentTab: {
		tabProperties?: ITabProperties;
	};
}

const addDocumentTabRequest: RequestDefinition = {
	name: 'Add Document Tab',
	value: 'addDocumentTab',
	category: 'Tabs',
	description: addDocumentTabDescription,
	operation: createAddDocumentTabRequest,
};

registerRequest(addDocumentTabRequest);
