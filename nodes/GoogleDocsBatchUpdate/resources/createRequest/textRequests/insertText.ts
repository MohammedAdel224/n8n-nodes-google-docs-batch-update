import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IInsertionLocation, InsertionLocation } from '../../../objects/insertionLocation';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestInsertText = {
    resource: ['createRequest'],
    operation: ['insertText'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestInsertText);

export const insertTextDescription: INodeProperties[] = [
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        placeholder: 'Text to insert',
        description: 'Text to insert into the document',
        displayOptions: {
            show: showForCreateRequestInsertText,
        },
    },
    ...insertionLocation.getDescription()
];

export const createInsertTextRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IInsertTextRequest => {
        const text = input.getNodeParameter('text', itemIndex) as string;
        const location = insertionLocation.getObject(input, itemIndex);

        return { 
            insertText: {
                text: text,
                ...location
            } 
        };
    }
);

export interface IInsertTextRequest extends IBaseGoogleDocsRequest {
    insertText: {
        text: string;
    } & IInsertionLocation;
}

const insertTextRequest: RequestDefinition = {
    name: 'Insert Text',
    value: 'insertText',
    category: 'Text',
    description: insertTextDescription,
    operation: createInsertTextRequest,
};

registerRequest(insertTextRequest);