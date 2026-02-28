import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { IOperation } from '../createRequest/types';
import { WriteControl } from '../../objects/writeControle';
import { sendRequestDescription } from './description';
import {
	collectRequestsForIndexes,
	collectRequestsFromDefineIndexes,
	parseRequestsFromDefine,
} from './helpers';

export { sendRequestDescription };

const writeControl = new WriteControl();

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
			const autoUpdateRevisionId = context.getNodeParameter('autoUpdateRevisionId', itemIndex, true) as boolean;
			const splitRequests = context.getNodeParameter('splitRequests', itemIndex, false) as boolean;
			const resolveDocumentId = (idx: number) => context.getNodeParameter('documentId', idx) as string;

			// Initialize only on first item execution
			if (itemIndex === 0) {
				documentRevisions.clear();
			}

			let requests: IDataObject[] = [];

			const allItems = context.getInputData() as Array<{ json: unknown }>;

			// Per-item mode: one HTTP request per item
			if (runForEachInput) {
				const documentId = resolveDocumentId(itemIndex);
				requests =
					requestsSource === 'input'
						? collectRequestsForIndexes(context, allItems, [itemIndex], itemIndex)
						: parseRequestsFromDefine(context, itemIndex);

				const writeControlObj = writeControl.getObject(context, itemIndex, 'options') as IDataObject;

				// If we have a tracked revision ID for this document, use it
				if (autoUpdateRevisionId && documentRevisions.has(documentId)) {
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
				if (
					autoUpdateRevisionId &&
					responseData.writeControl &&
					(responseData.writeControl as IDataObject).requiredRevisionId
				) {
					documentRevisions.set(
						documentId,
						(responseData.writeControl as IDataObject).requiredRevisionId as string,
					);
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

				requests =
					requestsSource === 'input'
						? collectRequestsForIndexes(context, allItems, indexes, indexes[0] ?? itemIndex)
						: collectRequestsFromDefineIndexes(context, indexes);

				if (requests.length === 0) {
					throw new NodeOperationError(
						context.getNode(),
						'No valid requests found in requests field. Provide a request object or an array of request objects.',
						{ itemIndex: indexes[0] ?? itemIndex },
					);
				}

				const writeControlObj = writeControl.getObject(
					context,
					indexes[0] ?? itemIndex,
					'options',
				);
				if (splitRequests) {
					const individualResponses = [];
					for (const req of requests) {
						const options: IHttpRequestOptions = {
							method: 'POST' as IHttpRequestMethods,
							url: `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
							body: { requests: [req], writeControl: writeControlObj },
							json: true,
						};

						const response = await context.helpers.httpRequestWithAuthentication.call(
							context,
							'googleDocsOAuth2Api',
							options,
						);
						individualResponses.push(response);
					}
					documentResponses.push({
						documentId: docId,
						response: { replies: individualResponses } as IDataObject,
					});
				} else {
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
