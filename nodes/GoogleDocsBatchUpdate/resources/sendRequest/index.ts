import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IOperation } from '../createRequest/types';
import { WriteControl } from '../../objects/writeControle';

const writeControl = new WriteControl();

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
		description: 'Whether to execute one API call per input item. If disabled, executes one API call per Document ID with requests collected from all input items in order.',
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
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
			},
		},
		options: [
			...writeControl.getDescription(),
		],
	},
];

// Special marker interface for API operations
export interface IApiOperation {
	_isApiOperation: true;
	execute: (context: IExecuteFunctions, itemIndex: number) => Promise<IDataObject>;
}

// Map to track latest revision IDs for documents during execution
const documentRevisions = new Map<string, string>();

export const sendRequestOperations: { [key: string]: IOperation | IApiOperation } = {
	send: {
		_isApiOperation: true,
		execute: async (context: IExecuteFunctions, itemIndex: number) => {
			const requestsSource = context.getNodeParameter('requestsSource', itemIndex) as string;
			const runForEachInput = context.getNodeParameter('runForEachInput', itemIndex) as boolean;
			const resolveDocumentId = (idx: number) => context.getNodeParameter('documentId', idx) as string;

			// Initialize only on first item execution
			if (itemIndex === 0) {
				documentRevisions.clear();
			}

			let requests: IDataObject[] = [];
			const unwrap = (obj: unknown): IDataObject | null => {
				if (typeof obj !== 'object' || obj === null) return null;
				const asDataObject = obj as IDataObject;
				if (asDataObject.request && typeof asDataObject.request === 'object' && asDataObject.request !== null) {
					return asDataObject.request as IDataObject;
				}
				return asDataObject;
			};

			const collectRequestsFromItems = (inputItems: Array<{ json: unknown }>) => {
				const collected: IDataObject[] = [];
				const asRecord = (value: unknown): Record<string, unknown> | null =>
					typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
				for (const item of inputItems) {
					const inputData = item.json as unknown;

					if (Array.isArray(inputData)) {
						for (const element of inputData) {
							const unwrapped = unwrap(element);
							if (unwrapped) collected.push(unwrapped);
						}
					}
					else if (asRecord(inputData)?.requests && Array.isArray(asRecord(inputData)?.requests)) {
						const requestsValue = asRecord(inputData)!.requests as unknown[];
						for (const element of requestsValue) {
							const unwrapped = unwrap(element);
							if (unwrapped) collected.push(unwrapped);
						}
					}
					else if (asRecord(inputData)?.request && typeof asRecord(inputData)?.request === 'object' && asRecord(inputData)?.request !== null) {
						collected.push(asRecord(inputData)!.request as IDataObject);
					}
					else if (typeof inputData === 'object' && inputData !== null) {
						const unwrapped = unwrap(inputData);
						if (unwrapped) collected.push(unwrapped);
					}
				}

				return collected;
			};

			const parseRequestsFromDefine = (idx: number): IDataObject[] => {
				const requestsParam = context.getNodeParameter('requests', idx);

				if (typeof requestsParam === 'object' && requestsParam !== null) {
					return Array.isArray(requestsParam) ? (requestsParam as IDataObject[]) : [requestsParam as IDataObject];
				}
				if (typeof requestsParam === 'string') {
					try {
						const parsedRequests = JSON.parse(requestsParam);
						return Array.isArray(parsedRequests) ? (parsedRequests as IDataObject[]) : [parsedRequests as IDataObject];
					} catch (error) {
						throw new NodeOperationError(
							context.getNode(),
							`Invalid JSON in requests field: ${(error as Error).message}`,
							{ itemIndex: idx },
						);
					}
				}
				throw new NodeOperationError(
					context.getNode(),
					'Requests parameter must be a JSON string, object, or array',
					{ itemIndex: idx },
				);
			};

			const collectRequestsFromDefineIndexes = (indexes: number[]): IDataObject[] => {
				const collected: IDataObject[] = [];
				for (const idx of indexes) {
					const parsed = parseRequestsFromDefine(idx);
					for (const req of parsed) {
						collected.push(req);
					}
				}
				return collected;
			};

			const collectRequestsForIndexes = (items: Array<{ json: unknown }>, indexes: number[]) => {
				const scopedItems = indexes
					.map(i => items[i])
					.filter((item): item is { json: unknown } => !!item);

				const collected = collectRequestsFromItems(scopedItems);
				if (collected.length === 0) {
					throw new NodeOperationError(
						context.getNode(),
						'No valid requests found in input data. Input must contain request object(s), arrays of request objects, or {request:{...}} items from Create Request builders.',
						{ itemIndex: indexes[0] ?? itemIndex },
					);
				}
				return collected;
			};

			const allItems = context.getInputData() as Array<{ json: unknown }>;

			// Per-item mode: one HTTP request per item
			if (runForEachInput) {
				const documentId = resolveDocumentId(itemIndex);
				requests = requestsSource === 'input'
					? collectRequestsForIndexes(allItems, [itemIndex])
					: parseRequestsFromDefine(itemIndex);

				const writeControlObj = writeControl.getObject(context, itemIndex, 'options') as IDataObject;

				// If we have a tracked revision ID for this document, use it
				if (documentRevisions.has(documentId)) {
					writeControlObj.requiredRevisionId = documentRevisions.get(documentId);
				}

				const options: IHttpRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
					body: { requests, writeControl: writeControlObj },
					json: true,
				};

				const response = await context.helpers.httpRequestWithAuthentication.call(
					context,
					'googleDocsOAuth2Api',
					options,
				);

				// Update tracked revision ID if present in response
				const responseData = response as IDataObject;
				if (responseData.writeControl && (responseData.writeControl as IDataObject).requiredRevisionId) {
					documentRevisions.set(documentId, (responseData.writeControl as IDataObject).requiredRevisionId as string);
				}

				return response as IDataObject;
			}

			// Aggregate mode: group items by resolved Document ID, send one HTTP request per document
			const documentIdToIndexes = new Map<string, number[]>();
			const documentIdOrder: string[] = [];
			for (let i = 0; i < allItems.length; i++) {
				const docId = resolveDocumentId(i);
				if (!documentIdToIndexes.has(docId)) {
					documentIdToIndexes.set(docId, []);
					documentIdOrder.push(docId);
				}
				documentIdToIndexes.get(docId)!.push(i);
			}

			const documentResponses: Array<{ documentId: string; response: IDataObject }> = [];
			for (const docId of documentIdOrder) {
				const indexes = documentIdToIndexes.get(docId) ?? [];
				if (indexes.length === 0) continue;

				requests = requestsSource === 'input'
					? collectRequestsForIndexes(allItems, indexes)
					: collectRequestsFromDefineIndexes(indexes);

				if (requests.length === 0) {
					throw new NodeOperationError(
						context.getNode(),
						'No valid requests found in requests field. Provide a request object or an array of request objects.',
						{ itemIndex: indexes[0] ?? itemIndex },
					);
				}

				const writeControlObj = writeControl.getObject(context, indexes[0] ?? itemIndex, 'options');

				const options: IHttpRequestOptions = {
					method: 'POST' as IHttpRequestMethods,
					url: `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
					body: { requests, writeControl: writeControlObj },
					json: true,
				};

				const response = await context.helpers.httpRequestWithAuthentication.call(
					context,
					'googleDocsOAuth2Api',
					options,
				);

				documentResponses.push({ documentId: docId, response: response as IDataObject });
			}

			if (documentResponses.length === 1) {
				return documentResponses[0].response;
			}

			return { documentResponses } as IDataObject;
		},
	} as IApiOperation,
};

export const sendRequestMetadata = {
	name: 'Send Request',
	value: 'sendRequest',
};
