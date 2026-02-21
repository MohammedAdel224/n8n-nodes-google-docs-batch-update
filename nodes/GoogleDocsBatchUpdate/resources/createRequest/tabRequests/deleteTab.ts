import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeleteTab = {
	resource: ['createRequest'],
	operation: ['deleteTab'],
};

export const deleteTabDescription: INodeProperties[] = [
	{
		displayName: 'Tab ID',
		name: 'tabId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the tab to delete',
		displayOptions: {
			show: showForCreateRequestDeleteTab,
		},
	},
];

export const createDeleteTabRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IDeleteTabRequest => {
		const tabId = input.getNodeParameter('tabId', itemIndex) as string;

		return {
			deleteTab: {
				tabId,
			},
		};
	},
);

export interface IDeleteTabRequest extends IBaseGoogleDocsRequest {
	deleteTab: {
		tabId: string;
	};
}

const deleteTabRequest: RequestDefinition = {
	name: 'Delete Tab',
	value: 'deleteTab',
	category: 'Tabs',
	description: deleteTabDescription,
	operation: createDeleteTabRequest,
};

registerRequest(deleteTabRequest);
