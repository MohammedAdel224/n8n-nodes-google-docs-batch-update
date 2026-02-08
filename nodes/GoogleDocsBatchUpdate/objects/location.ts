import { IGoogleDocsObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { EndOfSegmentLocation, IEndOfSegmentLocation } from './endOfSegmentLocation';

export interface ILocation extends IEndOfSegmentLocation {
    index?: number;
}

export class Location extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const segmentLocation = new EndOfSegmentLocation(show);
        const description: INodeProperties[] = [
            {
                displayName: 'Index',
                name: 'index',
                type: 'number',
                default: null,
                required: true,
                description: 'The zero-based index, in UTF-16 code units.\nThe index is relative to the beginning of the segment specified by segmentId',
                displayOptions: {
                    show: show
                },
            },
            ...segmentLocation.getDescription()
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ILocation | undefined {
        const endOfSegmentLocation = new EndOfSegmentLocation();
        const segmentLocation = endOfSegmentLocation.getObject(input, itemIndex, path);

        const indexPath = path ? `${path}.index` : 'index';
        const index = input.getNodeParameter(indexPath, itemIndex, null) as number;

        const location: ILocation = { ...segmentLocation };
        if (index !== null) {
            location.index = index;
        }

        if (Object.keys(location).length === 0) {
            return undefined;
        }

        return location;
    }
}