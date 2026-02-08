import { IGoogleDocsObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { EndOfSegmentLocation, IEndOfSegmentLocation } from './endOfSegmentLocation';

export interface IRange extends IEndOfSegmentLocation {
    startIndex?: number;
    endIndex?: number;
}

export class Range extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const segmentLocation = new EndOfSegmentLocation(show);
        const description: INodeProperties[] = [
            {
                displayName: 'Start Index',
                name: 'startIndex',
                type: 'number',
                default: 0,
                required: true,
                description: 'The zero-based index, in UTF-16 code units.\nThe index is relative to the beginning of the segment specified by segmentId',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'End Index',
                name: 'endIndex',
                type: 'number',
                default: 0,
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

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IRange |  undefined {
        const endOfSegmentLocation = new EndOfSegmentLocation().getObject(input, itemIndex, path);

        const startIndexPath = path ? `${path}.startIndex` : 'startIndex';
        const endIndexPath = path ? `${path}.endIndex` : 'endIndex';

        const startIndex = input.getNodeParameter(startIndexPath, itemIndex, null) as number;
        const endIndex = input.getNodeParameter(endIndexPath, itemIndex, null) as number;

        const range: IRange = { ...endOfSegmentLocation };
        if (startIndex !== null) range.startIndex = startIndex;
        if (endIndex !== null) range.endIndex = endIndex;

        if (Object.keys(range).length === 0) {
            return undefined;
        }

        return range;
    }
}