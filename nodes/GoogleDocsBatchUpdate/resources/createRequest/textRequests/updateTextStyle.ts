import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { IRange, Range } from '../../../objects/range';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';
import { TextStyle, ITextStyle } from '../../../objects/textStyle';

const showForCreateRequestUpdateTextStyle = {
    resource: ['createRequest'],
    operation: ['updateTextStyle'],
};

const range = new Range(showForCreateRequestUpdateTextStyle);
const textStyle = new TextStyle()

export const updateTextStyleDescription: INodeProperties[] = [
    ...range.getDescription(),
    {
        displayName: 'Style',
        name: 'style',
        type: 'collection',
        description: 'Style fields',
        default: {},
        placeholder: 'Add Style Field',
        displayOptions: {
            show: showForCreateRequestUpdateTextStyle,
        },
        options: textStyle.getDescription(),
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
        options: textStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestUpdateTextStyle,
        },
    },
];

export const createUpdateTextStyleRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IUpdateTextStyleRequest => {
        const range_ = range.getObject(input, itemIndex);

        const style = textStyle.getObject(input, itemIndex, 'style');
        const fields = input.getNodeParameter('fields', itemIndex, []) as string[];

        return {
            updateTextStyle: {
                range: range_,
                textStyle: style,
                fields: fields.join(','),
            },
        };
    }
);

export interface IUpdateTextStyleRequest extends IBaseGoogleDocsRequest {
    updateTextStyle: {
        range?: IRange;
        textStyle: ITextStyle;
        fields: string;
    }
}

const updateTextStyleRequest: RequestDefinition = {
    name: 'Update Text Style',
    value: 'updateTextStyle',
    category: 'Text',
    description: updateTextStyleDescription,
    operation: createUpdateTextStyleRequest,
};

registerRequest(updateTextStyleRequest);