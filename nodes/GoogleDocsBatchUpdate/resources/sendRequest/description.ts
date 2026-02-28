import type { INodeProperties } from 'n8n-workflow';
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
		displayName: 'Auto Update Revision ID',
		name: 'autoUpdateRevisionId',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
				runForEachInput: [true],
			},
		},
		description: 'Whether to automatically capture and use the latest revision ID for subsequent requests to the same document. Useful when making multiple sequential updates to the same document.',
	},
	{
		displayName: 'Split Requests',
		name: 'splitRequests',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['sendRequest'],
				operation: ['send'],
				runForEachInput: [false],
			},
		},
		description: 'Whether to send each collected request as a separate API call instead of batching them together',
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
