import type { INodeProperties } from 'n8n-workflow';
import { RequestDefinition } from '../types';
import { registerRequest } from '../registry';
import {
    createUpdateParagraphStyleRequest,
    updateParagraphStyleDescription,
} from '../textRequests/updateParagraphStyle';
import { wrapInRequest } from '../wrapInRequest';

export { createUpdateParagraphStyleRequest, updateParagraphStyleDescription };
export type { IUpdateParagraphStyleRequest } from '../textRequests/updateParagraphStyle';

const showForCreateRequestUpdateParagraphStyle = {
    resource: ['createRequest'],
    operation: ['updateParagraphStyle'],
};

export const updateParagraphStyleLegacyDescription: INodeProperties[] = [
    {
        displayName:
            'Migration: Use Create Text Request → Update Paragraph Style for new workflows. ' +
            'This Document location is kept for backwards compatibility and will be removed in a future major release.',
        name: 'migrationNote',
        type: 'notice',
        default: '',
        displayOptions: {
            show: showForCreateRequestUpdateParagraphStyle,
        },
    },
    ...updateParagraphStyleDescription,
];

const updateParagraphStyleRequest: RequestDefinition = {
    name: 'Update Paragraph Style',
    value: 'updateParagraphStyle',
    category: 'Document',
    description: updateParagraphStyleLegacyDescription,
    operation: wrapInRequest(createUpdateParagraphStyleRequest),
};

registerRequest(updateParagraphStyleRequest);

