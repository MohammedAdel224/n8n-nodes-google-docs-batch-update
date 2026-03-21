import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { Location } from '../../../objects/location';
import { RequestDefinition, IGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';
import { TextStyle } from '../../../objects/textStyle';
import { IRange } from '../../../objects/range';
import { ParagraphStyle } from '../../../objects/paragraphStyle';
import { IUpdateTextStyleRequest } from './updateTextStyle';
import { IUpdateParagraphStyleRequest } from './updateParagraphStyle';
import { IInsertTextRequest } from './insertText';

const showForCreateRequestInsertStyledText = {
    resource: ['createRequest'],
    operation: ['insertStyledText'],
};

const location = new Location(showForCreateRequestInsertStyledText);
const textStyle = new TextStyle();
const paragraphStyle = new ParagraphStyle();

export const insertTextDescription: INodeProperties[] = [
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Text to insert',
        description: 'Text to insert into the document',
        displayOptions: {
            show: showForCreateRequestInsertStyledText,
        },
    },
    ...location.getDescription(),
    {
        displayName: 'Paragraph Style',
        name: 'paragraphStyle',
        type: 'collection',
        description: 'Paragraph Style fields',
        default: {},
        placeholder: 'Add Paragraph Style Field',
        displayOptions: {
            show: showForCreateRequestInsertStyledText,
        },
        options: paragraphStyle.getDescription(),
    },
    {
        displayName: 'Paragraph Style Fields',
        name: 'paragraphStyleFields',
        type: 'multiOptions',
        options: paragraphStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestInsertStyledText,
        },
    },
    {
        displayName: 'Text Style',
        name: 'textStyle',
        type: 'collection',
        description: 'Text Style fields',
        default: {},
        placeholder: 'Add text Style Field',
        displayOptions: {
            show: showForCreateRequestInsertStyledText,
        },
        options: textStyle.getDescription(),
    },
    {
        displayName: 'Text Style Fields',
        name: 'textStyleFields',
        type: 'multiOptions',
        options: textStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestInsertStyledText,
        },
    },
];

export const createInsertTextRequest = (input: IExecuteFunctions, itemIndex: number): IGoogleDocsRequest[] => {
    const requests: IGoogleDocsRequest[] = [];
    
    const insertTextRequest = buildInsertTextRequest(input, itemIndex);
    requests.push(insertTextRequest);

    const updateParagraphStyleRequest = buildUpdateParagraphStyleRequest(input, itemIndex);
    if(!styleRequestIsEmpty(updateParagraphStyleRequest)) {
        requests.push(updateParagraphStyleRequest);
    }

    const updateTextStyleRequest = buildUpdateTextStyleRequest(input, itemIndex);
    if(!styleRequestIsEmpty(updateTextStyleRequest)) {
        requests.push(updateTextStyleRequest);
    }

    return requests;
};

const buildInsertTextRequest = (input: IExecuteFunctions, itemIndex: number): IInsertTextRequest => {
    const text = input.getNodeParameter('text', itemIndex) as string;
    const location_ = location.getObject(input, itemIndex);
    const insertTextRequest: IInsertTextRequest = { 
        insertText: {
            text,
            location: location_
        } 
    };
    return insertTextRequest;
};

const buildUpdateParagraphStyleRequest = (input: IExecuteFunctions, itemIndex: number): IUpdateParagraphStyleRequest => {
    const range = buildRangeObject(input, itemIndex);
    const paragraphStyle_ = paragraphStyle.getObject(input, itemIndex, 'paragraphStyle');
    const paragraphStyleFields = input.getNodeParameter('paragraphStyleFields', itemIndex, []) as string[];
    return {
        updateParagraphStyle: {
            range,
            paragraphStyle: paragraphStyle_,
            fields: paragraphStyleFields.join(','),
        },
    };
}

const buildUpdateTextStyleRequest = (input: IExecuteFunctions, itemIndex: number): IUpdateTextStyleRequest => {
    const range = buildRangeObject(input, itemIndex);
    const textStyle_ = textStyle.getObject(input, itemIndex, 'textStyle');
    const textStyleFields = input.getNodeParameter('textStyleFields', itemIndex, []) as string[];
    return {
        updateTextStyle: {
            range,
            textStyle: textStyle_,
            fields: textStyleFields.join(','),
        },
    };
};

const buildRangeObject = (input: IExecuteFunctions, itemIndex: number): IRange => {
    const location_ = location.getObject(input, itemIndex);
    const text = input.getNodeParameter('text', itemIndex) as string;
    const range: IRange = {
        startIndex: location_?.index,
        endIndex: location_.index + text.length,
    }
    return range;
}

const styleRequestIsEmpty = (request: IUpdateTextStyleRequest | IUpdateParagraphStyleRequest): boolean => {
    if ('updateTextStyle' in request) {
        const fieldsIsEmpty = !request.updateTextStyle.fields;
        const styleIsEmpty = Object.keys(request.updateTextStyle.textStyle || {}).length === 0;
        return fieldsIsEmpty && styleIsEmpty;
    }
    if ('updateParagraphStyle' in request) {
        const fieldsIsEmpty = !request.updateParagraphStyle.fields;
        const styleIsEmpty = Object.keys(request.updateParagraphStyle.paragraphStyle || {}).length === 0;
        return fieldsIsEmpty && styleIsEmpty;
    }
    return true;
}

const insertStyledTextRequest: RequestDefinition = {
    name: 'Insert Styled Text',
    value: 'insertStyledText',
    category: 'Text',
    description: insertTextDescription,
    operation: wrapInRequest(createInsertTextRequest),
};

registerRequest(insertStyledTextRequest);