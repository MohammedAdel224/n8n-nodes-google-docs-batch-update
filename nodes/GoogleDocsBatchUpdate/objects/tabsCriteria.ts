import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface ITabsCriteria extends IObject {
    tabIds?: string[];
}

export class TabsCriteria extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Tab IDs',
                name: 'tabIds',
                type: 'string',
                placeholder: 'single tab ID or [tabId1, tabId2]',
                displayOptions: {
                    show: show,
                },
                default: '',
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITabsCriteria | undefined{
        const tabIdsPath = path ? `${path}.tabIds` : 'tabIds';
        let tabIds = input.getNodeParameter(tabIdsPath, itemIndex, null) as Array<string> | string;

        const criteria: ITabsCriteria = {};
        if (tabIds) {
            let tabIdsArray: string[] = [];
            if (Array.isArray(tabIds)) {
                tabIdsArray = tabIds.map(id => id.toString());
            } else {
                tabIds = tabIds.startsWith('[') ? tabIds.slice(1, -1) : tabIds;
                tabIds = tabIds.endsWith(']') ? tabIds.slice(0, -1) : tabIds;
                tabIdsArray = tabIds.split(',').map(id => id.trim());
            }
            if (tabIdsArray.length > 0) {
                criteria.tabIds = tabIdsArray;
            }
        }

        if (Object.keys(criteria).length === 0) {
            return undefined;
        }
        
        return criteria;
    }
}