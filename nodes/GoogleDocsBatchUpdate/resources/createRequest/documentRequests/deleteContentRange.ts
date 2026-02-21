import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IRange, Range } from '../../../objects/range';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeleteContentRange = {
    resource: ['createRequest'],
    operation: ['deleteContentRange'],
};

const range = new Range(showForCreateRequestDeleteContentRange);

export const deleteContentRangeDescription: INodeProperties[] = [
    ...range.getDescription(),
];

export const createDeleteContentRangeRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IDeleteContentRangeRequest => {
        const range_ = range.getObject(input, itemIndex);

        return {
            deleteContentRange: {
                range: range_,
            },
        };
    }
);

export interface IDeleteContentRangeRequest extends IBaseGoogleDocsRequest {
    deleteContentRange: {
        range?: IRange
    };
}

const deleteContentRangeRequest: RequestDefinition = {
    name: 'Delete Content Range',
    value: 'deleteContentRange',
    category: 'Document',
    description: deleteContentRangeDescription,
    operation: createDeleteContentRangeRequest,
};

registerRequest(deleteContentRangeRequest);
