import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface IEndOfSegmentLocation extends IObject {
    segmentId?: string;
    tabId?: string;
}

export class EndOfSegmentLocation extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Additional Location Fields',
                name: 'additionalLocationFields',
                type: 'collection',
                description: 'Additional fields for the end of segment location',
                default: {},
                placeholder: 'Add Field',
                displayOptions: {
                    show: show,
                },
                options: [
                    {
                        displayName: 'Segment ID',
                        name: 'segmentId',
                        type: 'string',
                        default: '',
                        description: 'The ID of the header, footer or footnote the location is in. An empty segment ID signifies the document\'s body.',
                    },
                    {
                        displayName: 'Tab ID',
                        name: 'tabId',
                        type: 'string',
                        default: '',
                        description: 'The tab that the location is in. When omitted, the request is applied to the first tab. In a document containing a single tab: * If provided, must match the singular tab\'s ID. * If omitted, the request applies to the singular tab: In a document containing multiple tabs: * If provided, the request applies to the specified tab. *If omitted, the request applies to the first tab in the document',
                    },
                ],
            },
        ];
        super(description)
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IEndOfSegmentLocation | undefined {
        const segmentIdPath = path ? `${path}.additionalLocationFields.segmentId` : 'additionalLocationFields.segmentId';
        const tabIdPath = path ? `${path}.additionalLocationFields.tabId` : 'additionalLocationFields.tabId';
        
        const segmentId = input.getNodeParameter(segmentIdPath, itemIndex, '') as string;
        const tabId = input.getNodeParameter(tabIdPath, itemIndex, '') as string;

        const endOfSegmentLocation: IEndOfSegmentLocation = {};
        if (segmentId) endOfSegmentLocation.segmentId = segmentId;
        if (tabId) endOfSegmentLocation.tabId = tabId;

        if (Object.keys(endOfSegmentLocation).length === 0) {
            return undefined;
        }

        return endOfSegmentLocation;
    }
};