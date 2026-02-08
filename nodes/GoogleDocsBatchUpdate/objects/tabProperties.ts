import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface ITabProperties extends IObject {
	tabId?: string;
	title?: string;
	parentTabId?: string;
	index?: number;
	iconEmoji?: string;
}

export class TabProperties extends IGoogleDocsObject {
	constructor(show: Record<string, string[]> = {}) {
		const description: INodeProperties[] = [
			{
				displayName: 'Tab ID',
				name: 'tabId',
				type: 'string',
				default: '',
				description: 'The ID of the tab',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the tab',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Index',
				name: 'index',
				type: 'number',
				default: 0,
				description: 'The zero-based index of the tab',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: show,
				},
				options: [
					{
						displayName: 'Parent Tab ID',
						name: 'parentTabId',
						type: 'string',
						default: '',
						description: 'The ID of the parent tab. If not set, the tab will be a top-level tab.',
					},
					{
						displayName: 'Icon Emoji',
						name: 'iconEmoji',
						type: 'string',
						default: '',
						description: 'The emoji icon for the tab',
					},
				],
			},
		];
		super(description);
	}

	public getObject(
		input: IExecuteFunctions,
		itemIndex: number,
		path: string = '',
	): ITabProperties | undefined {
		const tabIdPath = path ? `${path}.tabId` : 'tabId';
		const titlePath = path ? `${path}.title` : 'title';
		const indexPath = path ? `${path}.index` : 'index';
		const additionalFieldsPath = path ? `${path}.additionalFields` : 'additionalFields';

		const tabId = input.getNodeParameter(tabIdPath, itemIndex, '') as string;
		const title = input.getNodeParameter(titlePath, itemIndex, '') as string;
		const index = input.getNodeParameter(indexPath, itemIndex, null) as number | null;
		const additionalFields = input.getNodeParameter(additionalFieldsPath, itemIndex, {}) as {
			parentTabId?: string;
			iconEmoji?: string;
		};

		const tabProperties: ITabProperties = {};

		if (tabId) {
			tabProperties.tabId = tabId;
		}

		if (title) {
			tabProperties.title = title;
		}

		if (additionalFields.parentTabId) {
			tabProperties.parentTabId = additionalFields.parentTabId;
		}

		if (index !== null) {
			tabProperties.index = index;
		}

		if (additionalFields.iconEmoji) {
			tabProperties.iconEmoji = additionalFields.iconEmoji;
		}

		if (Object.keys(tabProperties).length === 0) {
			return undefined;
		}

		return tabProperties;
	}
}
