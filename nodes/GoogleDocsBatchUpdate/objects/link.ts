import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { BookmarkLink, IBookmarkLink } from "./bookmarkLink";
import { HeadingLink, IHeadingLink } from "./headingLink";

export interface ILink extends IObject {
    url?: string;
    tabId?: string;
    bookmark?: IBookmarkLink;
    heading?: IHeadingLink;
    bookmarkId?: string;
    headingId?: string;
}

export class Link extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const bookmarkLink = new BookmarkLink({
            linkType: ['bookmark'],
        });
        const headingLink = new HeadingLink({
            linkType: ['heading'],
        });

        const description: INodeProperties[] = [
            {
                displayName: 'Link',
                name: 'link',
                type: 'fixedCollection',
                default: {},
                description: 'Link target type',
                typeOptions: {
                    multipleValues: false
                },
                options: [
                    {
                        displayName: 'Link Options',
                        name: 'linkOptions',
                        values: [
                            {
                                displayName: 'Bookmark ID',
                                name: 'bookmarkId',
                                type: 'string',
                                default: '',
                                description: 'The ID of a bookmark in this document',
                                displayOptions: {
                                    show: {
                                        linkType: ['bookmarkId'],
                                    },
                                },
                            },
                            {
                                displayName: 'Heading ID',
                                name: 'headingId',
                                type: 'string',
                                default: '',
                                description: 'The ID of a heading in this document',
                                displayOptions: {
                                    show: {
                                        linkType: ['headingId'],
                                    },
                                },
                            },
                            {
                                displayName: 'Link Type',
                                name: 'linkType',
                                type: 'options',
                                default: 'url',
                                description: 'Link target type',
                                typeOptions: {
                                    multipleValues: false
                                },
                                options: [
                                    {
                                        name: 'Bookmark',
                                        value: 'bookmark',
                                    },
                                    {
                                        name: 'Bookmark ID',
                                        value: 'bookmarkId',
                                    },
                                    {
                                        name: 'Heading',
                                        value: 'heading',
                                    },
                                    {
                                        name: 'Heading ID',
                                        value: 'headingId',
                                    },
                                    {
                                        name: 'Tab ID',
                                        value: 'tabId',
                                    },
                                    {
                                        name: 'URL',
                                        value: 'url',
                                    }
                                ],
                            },
                            {
                                displayName: 'Tab ID',
                                name: 'tabId',
                                type: 'string',
                                default: '',
                                description: 'The ID of a tab in this document',
                                displayOptions: {
                                    show: {
                                        linkType: ['tabId'],
                                    },
                                },
                            },
                            {
                                displayName: 'URL',
                                name: 'url',
                                type: 'string',
                                default: '',
                                description: 'An external URL',
                                displayOptions: {
                                    show: {
                                        linkType: ['url'],
                                    },
                                },
                            },
                            ...bookmarkLink.getDescription(),
                            ...headingLink.getDescription(),
                        ]
                    },
                ],
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ILink | undefined {
        const bookmarkLink = new BookmarkLink();
        const headingLink = new HeadingLink();
        const link_ = input.getNodeParameter(`${path}.link`, itemIndex, null) as IInput;

        let link: ILink = {};
        if(link_){
            const linkType = link_.linkOptions.linkType;
            if (linkType === 'url' && link_.linkOptions.url) {
                link = { url: link_.linkOptions.url };
            } else if (linkType === 'tabId' && link_.linkOptions.tabId) {
                link = { tabId: link_.linkOptions.tabId };
            } else if (linkType === 'bookmarkId' && link_.linkOptions.bookmarkId) {
                link = { bookmarkId: link_.linkOptions.bookmarkId };
            } else if (linkType === 'headingId' && link_.linkOptions.headingId) {
                link = { headingId: link_.linkOptions.headingId };
            } else if (linkType === 'bookmark') {
                link = { bookmark: bookmarkLink.getObject(input, itemIndex, `${path}.link.linkOptions`) };
            } else if (linkType === 'heading') {
                link = { heading: headingLink.getObject(input, itemIndex, `${path}.link.linkOptions`) };
            }
        }

        if (Object.keys(link).length === 0) {
            return undefined;
        }
        return link;
    };
}

interface IInput {
    linkOptions: {
        linkType: string;
        url?: string;
        tabId?: string;
        bookmarkId?: string;
        headingId?: string;
    }
}