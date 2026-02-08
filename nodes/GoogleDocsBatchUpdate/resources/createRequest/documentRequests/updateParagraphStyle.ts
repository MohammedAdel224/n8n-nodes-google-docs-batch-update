import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { IRange, Range } from '../../../objects/range';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';
import { ParagraphStyle, IParagraphStyle } from '../../../objects/paragraphStyle';

const showForCreateRequestUpdateParagraphStyle = {
    resource: ['createRequest'],
    operation: ['updateParagraphStyle'],
};

const range = new Range(showForCreateRequestUpdateParagraphStyle);
const paragraphStyle = new ParagraphStyle();

export const updateParagraphStyleDescription: INodeProperties[] = [
    ...range.getDescription(),
    {
        displayName: 'Style',
        name: 'style',
        type: 'collection',
        description: 'Style fields',
        default: {},
        placeholder: 'Add Style Field',
        displayOptions: {
            show: showForCreateRequestUpdateParagraphStyle,
        },
        options: paragraphStyle.getDescription(),
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
        options: paragraphStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestUpdateParagraphStyle,
        },
    },
];

export const createUpdateParagraphStyleRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IUpdateParagraphStyleRequest => {
        const range_ = range.getObject(input, itemIndex);
        const style = paragraphStyle.getObject(input, itemIndex, 'style');
        const fields = input.getNodeParameter('fields', itemIndex, []) as string[];

        return {
            updateParagraphStyle: {
                range: range_,
                paragraphStyle: style,
                fields: fields.join(','),
            },
        };
    }
);

interface IUpdateParagraphStyleRequest extends IGoogleDocsRequest {
    updateParagraphStyle: {
        range?: IRange;
        paragraphStyle: IParagraphStyle;
        fields: string;
    };
}

const updateParagraphStyleRequest: RequestDefinition = {
    name: 'Update Paragraph Style',
    value: 'updateParagraphStyle',
    category: 'Document',
    description: updateParagraphStyleDescription,
    operation: createUpdateParagraphStyleRequest,
};

registerRequest(updateParagraphStyleRequest);

