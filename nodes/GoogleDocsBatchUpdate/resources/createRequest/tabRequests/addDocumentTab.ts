import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ITabProperties, TabProperties } from '../../../objects/tabProperties';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

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

interface IAddDocumentTabRequest extends IGoogleDocsRequest {
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
