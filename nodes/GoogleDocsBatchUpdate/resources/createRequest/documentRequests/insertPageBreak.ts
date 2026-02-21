import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IInsertionLocation, InsertionLocation } from '../../../objects/insertionLocation';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestInsertPageBreak = {
    resource: ['createRequest'],
    operation: ['insertPageBreak'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestInsertPageBreak);

export const insertPageBreakDescription: INodeProperties[] = [
    ...insertionLocation.getDescription()
];

export const createInsertPageBreakRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IInsertPageBreakRequest => {
        const location = insertionLocation.getObject(input, itemIndex);

        return {
            insertPageBreak: location
        };
    }
);

export interface IInsertPageBreakRequest extends IBaseGoogleDocsRequest {
    insertPageBreak?: {} & IInsertionLocation;
}

const insertPageBreakRequest: RequestDefinition = {
    name: 'Insert Page Break',
    value: 'insertPageBreak',
    category: 'Document',
    description: insertPageBreakDescription,
    operation: createInsertPageBreakRequest,
};

registerRequest(insertPageBreakRequest);
