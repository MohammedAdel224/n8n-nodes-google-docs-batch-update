import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';
import { SectionStyle, ISectionStyle } from '../../../objects/sectionStyle';
import { Range, IRange } from '../../../objects/range';

const showForCreateRequestUpdateSectionStyle = {
	resource: ['createRequest'],
	operation: ['updateSectionStyle'],
};

const sectionStyle = new SectionStyle();
const range = new Range();

export const updateSectionStyleDescription: INodeProperties[] = [
    {
		displayName: 'Range',
		name: 'range',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Range',
		displayOptions: {
			show: showForCreateRequestUpdateSectionStyle,
		},
		options: [
			{
				displayName: 'Values',
				name: 'values',
				values: range.getDescription(),
			},
		],
	},
	{
		displayName: 'Section Style',
		name: 'sectionStyle',
		type: 'collection',
		placeholder: 'Add Style',
		default: {},
		displayOptions: {
			show: showForCreateRequestUpdateSectionStyle,
		},
		options: sectionStyle.getDescription(),
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'multiOptions',
		options: sectionStyle.getDescriptionAsOptions(),
		default: [],
		description: 'The fields that should be updated',
		displayOptions: {
			show: showForCreateRequestUpdateSectionStyle,
		},
	}
];

export const createUpdateSectionStyleRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IUpdateSectionStyleRequest => {
		const fields = input.getNodeParameter('fields', itemIndex, []) as string[];
		const style = sectionStyle.getObject(input, itemIndex, 'sectionStyle');
		const rangeData = range.getObject(input, itemIndex, 'range.values');

		const updateSectionStyleRequest: IUpdateSectionStyleRequest = {
			updateSectionStyle: {
				sectionStyle: style,
				fields: fields.join(','),
			},
		};

		if (rangeData) {
			updateSectionStyleRequest.updateSectionStyle.range = rangeData;
		}

		return updateSectionStyleRequest;
	},
);

interface IUpdateSectionStyleRequest extends IGoogleDocsRequest {
    updateSectionStyle: {
        range?: IRange;
		sectionStyle?: ISectionStyle;
		fields: string;
	};
}

const updateSectionStyleRequest: RequestDefinition = {
	name: 'Update Section Style',
	value: 'updateSectionStyle',
	category: 'Document',
	description: updateSectionStyleDescription,
	operation: createUpdateSectionStyleRequest,
};

registerRequest(updateSectionStyleRequest);
