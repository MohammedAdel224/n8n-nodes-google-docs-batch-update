import { INodePropertyOptions } from 'n8n-workflow';

export const sectionType: INodePropertyOptions[] = [
	{
		name: 'Unspecified',
		value: 'SECTION_TYPE_UNSPECIFIED',
		description: 'The section type is unspecified',
	},
	{
		name: 'Continuous',
		value: 'CONTINUOUS',
		description: 'The section starts immediately after the last paragraph of the previous section',
	},
	{
		name: 'Next Page',
		value: 'NEXT_PAGE',
		description: 'The section starts on the next page',
	},
];
