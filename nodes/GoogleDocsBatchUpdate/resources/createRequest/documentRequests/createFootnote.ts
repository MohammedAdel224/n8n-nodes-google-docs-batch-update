import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { InsertionLocation, IInsertionLocation } from '../../../objects/insertionLocation';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestCreateFootnote = {
	resource: ['createRequest'],
	operation: ['createFootnote'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestCreateFootnote);

export const createFootnoteDescription: INodeProperties[] = [
	...insertionLocation.getDescription(),
];

export const createFootnoteRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): ICreateFootnoteRequest => {
		const location = insertionLocation.getObject(input, itemIndex);

		return {
			createFootnote: {
				...location,
			},
		};
	},
);

export interface ICreateFootnoteRequest extends IBaseGoogleDocsRequest {
	createFootnote: IInsertionLocation;
}

const request: RequestDefinition = {
	name: 'Create Footnote',
	value: 'createFootnote',
	category: 'Document',
	description: createFootnoteDescription,
	operation: createFootnoteRequest,
};

registerRequest(request);
