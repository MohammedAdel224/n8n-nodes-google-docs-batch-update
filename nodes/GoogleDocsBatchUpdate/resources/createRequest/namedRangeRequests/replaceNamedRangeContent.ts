import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { ITabsCriteria, TabsCriteria } from '../../../objects/tabsCriteria';
import { NamedRangeReference, INamedRangeReference } from '../../../objects/namedRangeReference';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestReplaceNamedRangeContent = {
	resource: ['createRequest'],
	operation: ['replaceNamedRangeContent'],
};

const namedRangeReference = new NamedRangeReference(showForCreateRequestReplaceNamedRangeContent);
const tabsCriteria = new TabsCriteria();

export const replaceNamedRangeContentDescription: INodeProperties[] = [
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		default: '',
		required: true,
		description: 'The text to replace the range content with',
		displayOptions: {
			show: showForCreateRequestReplaceNamedRangeContent,
		},
	},
	...namedRangeReference.getDescription(),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showForCreateRequestReplaceNamedRangeContent,
		},
		options: tabsCriteria.getDescription(),
	},
];

export const createReplaceNamedRangeContentRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IReplaceNamedRangeContentRequest => {
		const text = input.getNodeParameter('text', itemIndex) as string;
		const reference = namedRangeReference.getObject(input, itemIndex) as INamedRangeReference;
		const tabsCriteria_ = tabsCriteria.getObject(input, itemIndex, 'additionalFields');

		return {
			replaceNamedRangeContent: {
				text,
				...reference,
				...tabsCriteria_,
			},
		};
	},
);

export interface IReplaceNamedRangeContentRequest extends IBaseGoogleDocsRequest {
	replaceNamedRangeContent: {
		text: string;
	} & INamedRangeReference &
		ITabsCriteria;
}

const replaceNamedRangeContentRequest: RequestDefinition = {
	name: 'Replace Named Range Content',
	value: 'replaceNamedRangeContent',
	category: 'Named Ranges',
	description: replaceNamedRangeContentDescription,
	operation: createReplaceNamedRangeContentRequest,
};

registerRequest(replaceNamedRangeContentRequest);
