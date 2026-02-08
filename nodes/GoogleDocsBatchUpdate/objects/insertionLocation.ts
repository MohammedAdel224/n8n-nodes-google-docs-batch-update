import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { EndOfSegmentLocation, IEndOfSegmentLocation } from './endOfSegmentLocation';
import { ILocation, Location } from './location';

export interface IInsertionLocation extends IObject {
    location?: ILocation;
    endOfSegmentLocation?: IEndOfSegmentLocation;
}

export class InsertionLocation extends IGoogleDocsObject {
    constructor(show: Record<string, string[]> = {}) {
        const endOfSegmentLocation = new EndOfSegmentLocation({
            ...show,
            insertionLocation: ['endOfSegmentLocation'],
        });
        
        const location = new Location({
            ...show,
            insertionLocation: ['location'],
        });

        const description: INodeProperties[] = [
            {
                displayName: 'Insertion Location',
                name: 'insertionLocation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Location',
                        value: 'location',
                    },
                    {
                        name: 'End of Segment Location',
                        value: 'endOfSegmentLocation',
                    },
                ],
                default: 'location',
                description: 'Location Type',
                displayOptions: {
                    show: show,
                },
            },
            ...endOfSegmentLocation.getDescription(),
            ...location.getDescription(),
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IInsertionLocation | undefined {
        const insertionLocationPath = path ? `${path}.insertionLocation` : 'insertionLocation';
        const insertionLocation = input.getNodeParameter(insertionLocationPath, itemIndex) as string;

        const insertionLocationObject: IInsertionLocation = {};
        if ( insertionLocation === 'endOfSegmentLocation' ) {
            const endOfSegmentLocation = new EndOfSegmentLocation();
            const endOfSegmentLocationObject = endOfSegmentLocation.getObject(input, itemIndex, path);
            insertionLocationObject.endOfSegmentLocation = endOfSegmentLocationObject? endOfSegmentLocationObject : {};
        }
        else {
            const location = new Location();
            const locationObject = location.getObject(input, itemIndex, path);
            if (locationObject !== undefined) insertionLocationObject.location = locationObject;
        }

        if (Object.keys(insertionLocationObject).length === 0) {
            return undefined;
        }
        return insertionLocationObject;
    }
}