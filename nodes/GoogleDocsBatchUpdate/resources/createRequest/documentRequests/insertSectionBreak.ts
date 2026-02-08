import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { IInsertionLocation, InsertionLocation } from '../../../objects/insertionLocation';
import { sectionType } from '../../../enums/sectionType';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestInsertSectionBreak = {
	resource: ['createRequest'],
	operation: ['insertSectionBreak'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestInsertSectionBreak);

export const insertSectionBreakDescription: INodeProperties[] = [
	{
		displayName: 'Section Type',
		name: 'sectionType',
		type: 'options',
		options: sectionType,
		default: 'CONTINUOUS',
		description: 'The type of section break to insert',
		displayOptions: {
			show: showForCreateRequestInsertSectionBreak,
		},
	},
	...insertionLocation.getDescription(),
];

export const createInsertSectionBreakRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IInsertSectionBreakRequest => {
		const type = input.getNodeParameter('sectionType', itemIndex) as string;
		const location = insertionLocation.getObject(input, itemIndex);

		return {
			insertSectionBreak: {
				sectionType: type,
				...location,
			},
		};
	},
);

interface IInsertSectionBreakRequest extends IGoogleDocsRequest {
	insertSectionBreak: {
		sectionType: string;
	} & IInsertionLocation;
}

const insertSectionBreakRequest: RequestDefinition = {
	name: 'Insert Section Break',
	value: 'insertSectionBreak',
	category: 'Document',
	description: insertSectionBreakDescription,
	operation: createInsertSectionBreakRequest,
};

registerRequest(insertSectionBreakRequest);
