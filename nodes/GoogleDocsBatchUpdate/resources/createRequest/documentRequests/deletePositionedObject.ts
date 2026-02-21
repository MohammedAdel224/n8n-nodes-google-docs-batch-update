import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeletePositionedObject = {
    resource: ['createRequest'],
    operation: ['deletePositionedObject'],
};

export const deletePositionedObjectDescription: INodeProperties[] = [
    {
        displayName: 'Object ID',
        name: 'objectId',
        type: 'string',
        default: '',
        required: true,
        description: 'The ID of the positioned object to delete',
        displayOptions: {
            show: showForCreateRequestDeletePositionedObject,
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: showForCreateRequestDeletePositionedObject,
        },
        options: [
            {
                displayName: 'Tab ID',
                name: 'tabId',
                type: 'string',
                default: '',
                description: 'The tab that the positioned object to delete is in. When omitted, the request is applied to the first tab.',
            },
        ],
    },
];

export const createDeletePositionedObjectRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IDeletePositionedObjectRequest => {
        const objectId = input.getNodeParameter('objectId', itemIndex) as string;
        const additionalFields = input.getNodeParameter('additionalFields', itemIndex, {}) as { tabId?: string };

        const deletePositionedObjectRequest: IDeletePositionedObjectRequest = {
            deletePositionedObject: {
                objectId,
            }
        };

        if (additionalFields.tabId) {
            deletePositionedObjectRequest.deletePositionedObject.tabId = additionalFields.tabId;
        }

        return deletePositionedObjectRequest;
    }
);

export interface IDeletePositionedObjectRequest extends IBaseGoogleDocsRequest {
    deletePositionedObject: {
        objectId: string;
        tabId?: string;
    }
}

const deletePositionedObjectRequest: RequestDefinition = {
    name: 'Delete Positioned Object',
    value: 'deletePositionedObject',
    category: 'Document',
    description: deletePositionedObjectDescription,
    operation: createDeletePositionedObjectRequest,
};

registerRequest(deletePositionedObjectRequest);
