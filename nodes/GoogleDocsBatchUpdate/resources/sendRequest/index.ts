import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IOperation } from '../../utils/iOperation';

export const sendRequestDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
			},
		},
		options: [
			{
				name: 'Send to Google Docs API',
				value: 'send',
				description: 'Send batch update requests to Google Docs API',
				action: 'Send requests to google docs',
			},
		],
		default: 'send',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
			},
		},
		placeholder: '1A2B3C4D5E6F7G8H9I0J',
		description: 'The ID of the Google Doc to update',
	},
	{
		displayName: 'Requests Source',
		name: 'requestsSource',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
			},
		},
		options: [
			{
				name: 'From Input',
				value: 'input',
				description: 'Get requests from input data (supports {request:{...}}, single request, array of requests, or multiple input items)',
			},
			{
				name: 'Define Below',
				value: 'define',
				description: 'Define requests as JSON',
			},
		],
		default: 'input',
		description: 'Where to get the requests from',
	},
	{
		displayName: 'Run For Each Input Item',
		name: 'runForEachInput',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
			},
		},
		description: 'Whether to execute one API call per input item. If disabled, executes one API call with requests collected from all input items in order.',
	},
	{
		displayName: 'Requests',
		name: 'requests',
		type: 'json',
		default: '[]',
		required: true,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
				requestsSource: ['define'],
			},
		},
		description: 'JSON array of request objects to send to Google Docs API',
		placeholder: '[{"insertText": {"text": "Hello", "location": {"index": 1}}}]',
	},
];

// Special marker interface for API operations
export interface IApiOperation {
	_isApiOperation: true;
	execute: (context: IExecuteFunctions, itemIndex: number) => Promise<IDataObject>;
}

export const sendRequestOperations: { [key: string]: IOperation | IApiOperation } = {
	send: {
		_isApiOperation: true,
		execute: async (context: IExecuteFunctions, itemIndex: number) => {
			const documentId = context.getNodeParameter('documentId', itemIndex) as string;
			const requestsSource = context.getNodeParameter('requestsSource', itemIndex) as string;
			const runForEachInput = context.getNodeParameter('runForEachInput', itemIndex) as boolean;

			let requests: IDataObject[] = [];
			const unwrap = (obj: unknown): IDataObject | null => {
				if (typeof obj !== 'object' || obj === null) return null;
				const asDataObject = obj as IDataObject;
				if (asDataObject.request && typeof asDataObject.request === 'object' && asDataObject.request !== null) {
					return asDataObject.request as IDataObject;
				}
				return asDataObject;
			};

			const collectRequestsFromItems = (inputItems: Array<{ json: IDataObject }>) => {
				const collected: IDataObject[] = [];
				for (const item of inputItems) {
					const inputData = item.json;

					if (Array.isArray(inputData)) {
						for (const element of inputData) {
							const unwrapped = unwrap(element);
							if (unwrapped) collected.push(unwrapped);
						}
					}
					else if (inputData.requests && Array.isArray(inputData.requests)) {
						for (const element of inputData.requests as IDataObject[]) {
							const unwrapped = unwrap(element);
							if (unwrapped) collected.push(unwrapped);
						}
					}
					else if (inputData.request && typeof inputData.request === 'object' && inputData.request !== null) {
						collected.push(inputData.request as IDataObject);
					}
					else if (typeof inputData === 'object' && inputData !== null) {
						const unwrapped = unwrap(inputData);
						if (unwrapped) collected.push(unwrapped);
					}
				}

				return collected;
			};

			if (requestsSource === 'input') {
				const items = context.getInputData();
				const scopedItems = runForEachInput ? [items[itemIndex]].filter((item): item is { json: IDataObject } => !!item) : items as Array<{ json: IDataObject }>;
				requests = collectRequestsFromItems(scopedItems);
				
				if (requests.length === 0) {
					throw new NodeOperationError(
						context.getNode(),
						'No valid requests found in input data. Input must contain request object(s), arrays of request objects, or {request:{...}} items from Create Request builders.',
						{ itemIndex }
					);
				}
			} else {
				// Get requests from JSON parameter
				const requestsParam = context.getNodeParameter('requests', itemIndex);
				
				// Check if it's already parsed (object or array)
				if (typeof requestsParam === 'object' && requestsParam !== null) {
					requests = Array.isArray(requestsParam) ? requestsParam : [requestsParam];
				} else if (typeof requestsParam === 'string') {
					// Parse JSON string
					try {
						const parsedRequests = JSON.parse(requestsParam);
						requests = Array.isArray(parsedRequests) ? parsedRequests : [parsedRequests];
					} catch (error) {
						throw new NodeOperationError(
							context.getNode(),
							`Invalid JSON in requests field: ${(error as Error).message}`,
							{ itemIndex }
						);
					}
				} else {
					throw new NodeOperationError(
						context.getNode(),
						'Requests parameter must be a JSON string, object, or array',
						{ itemIndex }
					);
				}
			}

			// Make API call to Google Docs
			const options: IHttpRequestOptions = {
				method: 'POST' as IHttpRequestMethods,
				url: `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
				body: {
					requests,
				},
				json: true,
			};

			const response = await context.helpers.httpRequestWithAuthentication.call(
				context,
				'googleDocsOAuth2Api',
				options,
			);

			return response as IDataObject;
		},
	} as IApiOperation,
};

export const sendRequestMetadata = {
	name: 'Send Request',
	value: 'sendRequest',
};
