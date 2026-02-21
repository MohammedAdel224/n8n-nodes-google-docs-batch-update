import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IRange, Range } from '../../../objects/range';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestCreateNamedRange = {
    resource: ['createRequest'],
    operation: ['createNamedRange'],
};

const range = new Range(showForCreateRequestCreateNamedRange)


export const createNamedRangeDescription: INodeProperties[] = [
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'The name of the NamedRange. Names do not need to be unique.',
        displayOptions: {
            show: showForCreateRequestCreateNamedRange,
        },
    },
    ...range.getDescription()
];

export interface ICreateNamedRangeRequest extends IBaseGoogleDocsRequest {
    createNamedRange: {
        name: string;
        range?: IRange;
    }
}

export const createCreateNamedRangeRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): ICreateNamedRangeRequest => {
        const name = input.getNodeParameter('name', itemIndex) as string;
        const range_ = range.getObject(input, itemIndex);

        return {
            createNamedRange: {
                name,
                range: range_,
            }
        };
    }
);

const createNamedRangeRequest: RequestDefinition = {
    name: 'Create Named Range',
    value: 'createNamedRange',
    category: 'Named Ranges',
    description: createNamedRangeDescription,
    operation: createCreateNamedRangeRequest,
};

registerRequest(createNamedRangeRequest);