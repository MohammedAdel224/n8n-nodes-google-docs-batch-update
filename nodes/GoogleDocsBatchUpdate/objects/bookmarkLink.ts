import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface IBookmarkLink extends IObject {
    id?: string;
    tabId?: string;
}

export class BookmarkLink extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Bookmark ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'The ID of a bookmark in the document',
                displayOptions: {
                    show: show,
                },
            },
            {
                displayName: 'Tab ID',
                name: 'tabId',
                type: 'string',
                default: '',
                description: 'The ID of the tab containing the bookmark',
                displayOptions: {
                    show: show,
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IBookmarkLink | undefined {
        const idPath = path ? `${path}.id` : 'id';
        const tabIdPath = path ? `${path}.tabId` : 'tabId';

        const id = input.getNodeParameter(idPath, itemIndex, undefined) as string;
        const tabId = input.getNodeParameter(tabIdPath, itemIndex, undefined) as string;

        const bookmarkLink: IBookmarkLink = {};
        if (id) bookmarkLink.id = id;
        if (tabId) bookmarkLink.tabId = tabId;

        if (Object.keys(bookmarkLink).length === 0) {
            return undefined;
        }
        return bookmarkLink;
    }
}
