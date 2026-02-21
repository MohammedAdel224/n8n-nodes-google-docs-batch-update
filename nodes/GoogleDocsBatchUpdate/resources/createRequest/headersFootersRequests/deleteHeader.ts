import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeleteHeader = {
	resource: ['createRequest'],
	operation: ['deleteHeader'],
};

export const deleteHeaderDescription: INodeProperties[] = [
	{
		displayName: 'Header ID',
		name: 'headerId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the header to delete',
		displayOptions: {
			show: showForCreateRequestDeleteHeader,
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showForCreateRequestDeleteHeader,
		},
		options: [
			{
				displayName: 'Tab ID',
				name: 'tabId',
				type: 'string',
				default: '',
				description: 'The tab containing the header to delete. When omitted, the request is applied to the first tab.',
			},
		],
	},
];

export const createDeleteHeaderRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IDeleteHeaderRequest => {
		const headerId = input.getNodeParameter('headerId', itemIndex) as string;
		const additionalFields = input.getNodeParameter('additionalFields', itemIndex, {}) as { tabId?: string };

		const deleteHeaderRequest: IDeleteHeaderRequest = {
			deleteHeader: {
				headerId,
			},
		};

		if (additionalFields.tabId) {
			deleteHeaderRequest.deleteHeader.tabId = additionalFields.tabId;
		}

		return deleteHeaderRequest;
	},
);

export interface IDeleteHeaderRequest extends IBaseGoogleDocsRequest {
	deleteHeader: {
		headerId: string;
		tabId?: string;
	};
}

const deleteHeaderRequest: RequestDefinition = {
	name: 'Delete Header',
	value: 'deleteHeader',
	category: 'Headers & Footers',
	description: deleteHeaderDescription,
	operation: createDeleteHeaderRequest,
};

registerRequest(deleteHeaderRequest);
