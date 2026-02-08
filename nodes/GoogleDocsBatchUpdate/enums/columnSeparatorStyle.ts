import { INodePropertyOptions } from 'n8n-workflow';

export const columnSeparatorStyle: INodePropertyOptions[] = [
	{
		name: 'Unspecified',
		value: 'COLUMN_SEPARATOR_STYLE_UNSPECIFIED',
		description: 'An unspecified column separator style',
	},
	{
		name: 'None',
		value: 'NONE',
		description: 'No column separator lines between columns',
	},
	{
		name: 'Between Each Column',
		value: 'BETWEEN_EACH_COLUMN',
		description: 'Renders a column separator line between each column',
	},
];
