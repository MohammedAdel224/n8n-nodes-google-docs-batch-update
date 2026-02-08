import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface IHeadingLink extends IObject {
    id?: string;
    tabId?: string;
}

export class HeadingLink extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Heading ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'The ID of a heading in the document',
                displayOptions: {
                    show: show,
                },
            },
            {
                displayName: 'Tab ID',
                name: 'tabId',
                type: 'string',
                default: '',
                description: 'The ID of the tab containing the heading',
                displayOptions: {
                    show: show,
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IHeadingLink | undefined {
        const idPath = path ? `${path}.id` : 'id';
        const tabIdPath = path ? `${path}.tabId` : 'tabId';

        const id = input.getNodeParameter(idPath, itemIndex, undefined) as string;
        const tabId = input.getNodeParameter(tabIdPath, itemIndex, undefined) as string;

        const headingLink: IHeadingLink = {};
        if (id) headingLink.id = id;
        if (tabId) headingLink.tabId = tabId;

        if (Object.keys(headingLink).length === 0) {
            return undefined;
        }

        return headingLink;
    }
}
