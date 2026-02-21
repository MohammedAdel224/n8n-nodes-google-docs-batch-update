import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IRange, Range } from '../../../objects/range';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestDeleteParagraphBullets = {
    resource: ['createRequest'],
    operation: ['deleteParagraphBullets'],
};

const range = new Range(showForCreateRequestDeleteParagraphBullets);

export const deleteParagraphBulletsDescription: INodeProperties[] = [
    ...range.getDescription(),
];

export const createDeleteParagraphBulletsRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IDeleteParagraphBulletsRequest => {
        const range_ = range.getObject(input, itemIndex);

        return {
            deleteParagraphBullets: {
                range: range_,
            },
        };
    }
);

export interface IDeleteParagraphBulletsRequest extends IBaseGoogleDocsRequest {
    deleteParagraphBullets: {
        range?: IRange
    };
}

const deleteParagraphBulletsRequest: RequestDefinition = {
    name: 'Delete Paragraph Bullets',
    value: 'deleteParagraphBullets',
    category: 'Bullets',
    description: deleteParagraphBulletsDescription,
    operation: createDeleteParagraphBulletsRequest,
};

registerRequest(deleteParagraphBulletsRequest);