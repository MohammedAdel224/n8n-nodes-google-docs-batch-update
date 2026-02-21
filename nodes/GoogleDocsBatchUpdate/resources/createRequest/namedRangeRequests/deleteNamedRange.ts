import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { ITabsCriteria, TabsCriteria } from '../../../objects/tabsCriteria';
import { NamedRangeReference, INamedRangeReference } from '../../../objects/namedRangeReference';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeleteNamedRange = {
    resource: ['createRequest'],
    operation: ['deleteNamedRange'],
};

const namedRangeReference = new NamedRangeReference(showForCreateRequestDeleteNamedRange);
const tabsCriteria = new TabsCriteria();

export const deleteNamedRangeDescription: INodeProperties[] = [
    ...namedRangeReference.getDescription(),
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: showForCreateRequestDeleteNamedRange,
        },
        options: tabsCriteria.getDescription()
    }
];

export const createDeleteNamedRangeRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IDeleteNamedRangeRequest => {
        const reference = namedRangeReference.getObject(input, itemIndex) as INamedRangeReference;
        const tabsCriteria_ = tabsCriteria.getObject(input, itemIndex, 'additionalFields');

        return {
            deleteNamedRange: {
                ...reference,
                ...tabsCriteria_,
            },
        };
    }
);

export interface IDeleteNamedRangeRequest extends IBaseGoogleDocsRequest {
    deleteNamedRange: INamedRangeReference & ITabsCriteria;
}

const deleteNamedRangeRequest: RequestDefinition = {
    name: 'Delete Named Range',
    value: 'deleteNamedRange',
    category: 'Named Ranges',
    description: deleteNamedRangeDescription,
    operation: createDeleteNamedRangeRequest,
};

registerRequest(deleteNamedRangeRequest);