import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

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

interface IDeleteTabRequest extends IGoogleDocsRequest {
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
