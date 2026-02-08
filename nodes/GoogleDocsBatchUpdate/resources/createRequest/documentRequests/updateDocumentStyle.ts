import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';
import { DocumentStyle, IDocumentStyle } from '../../../objects/documentStyle';

const showForCreateRequestUpdateDocumentStyle = {
    resource: ['createRequest'],
    operation: ['updateDocumentStyle'],
};

const documentStyle = new DocumentStyle();

export const updateDocumentStyleDescription: INodeProperties[] = [
    {
        displayName: 'Document Style',
        name: 'documentStyle',
        type: 'collection',
        placeholder: 'Add Style',
        default: {},
        displayOptions: {
            show: showForCreateRequestUpdateDocumentStyle,
        },
        options: documentStyle.getDescription(),
    },
    {
        displayName: 'Fields',
        name: 'fields',
        type: 'multiOptions',
        options: documentStyle.getDescriptionAsOptions(),
        default: [],
        description: 'The fields that should be updated',
        displayOptions: {
            show: showForCreateRequestUpdateDocumentStyle,
        },
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: showForCreateRequestUpdateDocumentStyle,
        },
        options: [
            {
                displayName: 'Tab ID',
                name: 'tabId',
                type: 'string',
                default: '',
                description: 'The tab that the image to be replaced is in. When omitted, the request is applied to the first tab.',
            },
        ],
    },
];

export const createUpdateDocumentStyleRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IUpdateDocumentStyleRequest => {
        const fields = input.getNodeParameter('fields', itemIndex, []) as string[];
        const style: IDocumentStyle = documentStyle.getObject(input, itemIndex, 'documentStyle');
        const tabId = input.getNodeParameter('additionalFields.tabId', itemIndex, '') as string;

        const updateDocumentStyleRequest: IUpdateDocumentStyleRequest = {
            updateDocumentStyle: {
                documentStyle: style,
                fields: fields.join(','),
            },
        };

        if (tabId) {
            updateDocumentStyleRequest.updateDocumentStyle.tabId = tabId;
        }

        return updateDocumentStyleRequest;
    }
);


interface IUpdateDocumentStyleRequest extends IGoogleDocsRequest {
    updateDocumentStyle: {
        documentStyle: IDocumentStyle;
        fields: string;
        tabId?: string;
    };
}

const updateDocumentStyleRequest: RequestDefinition = {
    name: 'Update Document Style',
    value: 'updateDocumentStyle',
    category: 'Document',
    description: updateDocumentStyleDescription,
    operation: createUpdateDocumentStyleRequest,
};

registerRequest(updateDocumentStyleRequest);