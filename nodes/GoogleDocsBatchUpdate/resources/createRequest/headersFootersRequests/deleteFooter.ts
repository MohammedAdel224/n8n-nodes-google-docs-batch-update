import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeleteFooter = {
	resource: ['createRequest'],
	operation: ['deleteFooter'],
};

export const deleteFooterDescription: INodeProperties[] = [
	{
		displayName: 'Footer ID',
		name: 'footerId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the footer to delete',
		displayOptions: {
			show: showForCreateRequestDeleteFooter,
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showForCreateRequestDeleteFooter,
		},
		options: [
			{
				displayName: 'Tab ID',
				name: 'tabId',
				type: 'string',
				default: '',
				description: 'The tab containing the footer to delete. When omitted, the request is applied to the first tab.',
			},
		],
	},
];

export const createDeleteFooterRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IDeleteFooterRequest => {
		const footerId = input.getNodeParameter('footerId', itemIndex) as string;
		const additionalFields = input.getNodeParameter('additionalFields', itemIndex, {}) as { tabId?: string };

		const deleteFooterRequest: IDeleteFooterRequest = {
			deleteFooter: {
				footerId,
			},
		};

		if (additionalFields.tabId) {
			deleteFooterRequest.deleteFooter.tabId = additionalFields.tabId;
		}

		return deleteFooterRequest;
	},
);

export interface IDeleteFooterRequest extends IBaseGoogleDocsRequest {
	deleteFooter: {
		footerId: string;
		tabId?: string;
	};
}

const deleteFooterRequest: RequestDefinition = {
	name: 'Delete Footer',
	value: 'deleteFooter',
	category: 'Headers & Footers',
	description: deleteFooterDescription,
	operation: createDeleteFooterRequest,
};

registerRequest(deleteFooterRequest);
