import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { InsertionLocation, IInsertionLocation } from '../../../objects/insertionLocation';
import { ISize, Size } from '../../../objects/size';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestInsertInlineImage = {
    resource: ['createRequest'],
    operation: ['insertInlineImage'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestInsertInlineImage);
const size = new Size(showForCreateRequestInsertInlineImage);

export const insertInlineImageDescription: INodeProperties[] = [
    {
        displayName: 'Image URI',
        name: 'uri',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/image.png',
        description: 'The URI of the image to insert',
        displayOptions: {
            show: showForCreateRequestInsertInlineImage,
        },
    },
    ...size.getDescription(),
    ...insertionLocation.getDescription()
];

export const createInsertInlineImageRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IInsertInlineImageRequest => {
        const uri = input.getNodeParameter('uri', itemIndex) as string;
        const location = insertionLocation.getObject(input, itemIndex);
        const objectSize = size.getObject(input, itemIndex, '');

        const insertInlineImageRequest: IInsertInlineImageRequest = {
            insertInlineImage: {
                uri,
                ...location
            }
        };

        if (objectSize) {
            insertInlineImageRequest.insertInlineImage.objectSize = objectSize;
        }

        return insertInlineImageRequest;
    }
);

export interface IInsertInlineImageRequest extends IBaseGoogleDocsRequest {
    insertInlineImage: {
        uri: string;
        objectSize?: ISize
    } & IInsertionLocation;
}

const insertInlineImageRequest: RequestDefinition = {
    name: 'Insert Inline Image',
    value: 'insertInlineImage',
    category: 'Images',
    description: insertInlineImageDescription,
    operation: createInsertInlineImageRequest,
};

registerRequest(insertInlineImageRequest);
