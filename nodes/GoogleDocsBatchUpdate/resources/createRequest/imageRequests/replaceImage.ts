import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';
// import { imageReplaceMethod } from '../../../enums/imageReplaceMethod';

const showForCreateRequestReplaceImage = {
    resource: ['createRequest'],
    operation: ['replaceImage'],
};

export const replaceImageDescription: INodeProperties[] = [
    {
        displayName: 'Image Object ID',
        name: 'imageObjectId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the existing image that will be replaced',
        displayOptions: {
            show: showForCreateRequestReplaceImage,
        },
    },
    {
        displayName: 'Image URI',
        name: 'uri',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'https://example.com/image.png',
        description: 'The URI of the new image',
        displayOptions: {
            show: showForCreateRequestReplaceImage,
        },
    },
    // {
    //     displayName: 'Image Replace Method',
    //     name: 'imageReplaceMethod',
    //     type: 'options',
    //     options: imageReplaceMethod,
    //     default: 'CENTER_CROP',
    //     description: 'The replacement method.',
    //     displayOptions: {
    //         show: showForCreateRequestReplaceImage,
    //     },
    // },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: showForCreateRequestReplaceImage,
        },
        options: [
            {
                displayName: 'Tab ID',
                name: 'tabId',
                type: 'string',
                default: '',
                description: 'The tab that the image to be replaced is in. When omitted, the request is applied to the first tab.',
            },
        ],
    },
];

export const createReplaceImageRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IReplaceImageRequest => {
        const imageObjectId = input.getNodeParameter('imageObjectId', itemIndex) as string;
        const uri = input.getNodeParameter('uri', itemIndex) as string;
        // const imageReplaceMethod = input.getNodeParameter('imageReplaceMethod', itemIndex) as string;
        const tabId = input.getNodeParameter('additionalFields.tabId', itemIndex, '') as string;

        const replaceImageRequest: IReplaceImageRequest = {
            replaceImage: {
                imageObjectId,
                uri,
                // imageReplaceMethod,
            }
        };

        if (tabId) {
            replaceImageRequest.replaceImage.tabId = tabId;
        }

        return replaceImageRequest;
    }
);

export interface IReplaceImageRequest extends IBaseGoogleDocsRequest {
    replaceImage: {
        imageObjectId: string;
        uri: string;
        // imageReplaceMethod?: string;
        tabId?: string;
    }
}

const replaceImageRequest: RequestDefinition = {
    name: 'Replace Image',
    value: 'replaceImage',
    category: 'Images',
    description: replaceImageDescription,
    operation: createReplaceImageRequest,
};

registerRequest(replaceImageRequest);
