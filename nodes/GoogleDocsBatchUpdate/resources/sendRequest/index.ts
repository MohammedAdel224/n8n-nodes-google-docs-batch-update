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
				description: 'Get requests from input data (single request, array of requests, or multiple input items)',
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

			let requests: IDataObject[] = [];

			if (requestsSource === 'input') {
				// Get requests from input data - handle multiple items
				const items = context.getInputData();
				
				// Collect requests from all input items
				for (const item of items) {
					const inputData = item.json;
					
					// Handle array of requests
					if (Array.isArray(inputData)) {
						requests.push(...inputData);
					}
					// Handle object with requests property
					else if (inputData.requests && Array.isArray(inputData.requests)) {
						requests.push(...(inputData.requests as IDataObject[]));
					}
					// Handle single request object
					else if (typeof inputData === 'object' && inputData !== null) {
						requests.push(inputData);
					}
				}
				
				if (requests.length === 0) {
					throw new NodeOperationError(
						context.getNode(),
						'No valid requests found in input data. Input must be request object(s) or array(s) of requests.',
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
