import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { IInsertionLocation, InsertionLocation } from '../../../objects/insertionLocation';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

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

interface IInsertPageBreakRequest extends IGoogleDocsRequest {
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
