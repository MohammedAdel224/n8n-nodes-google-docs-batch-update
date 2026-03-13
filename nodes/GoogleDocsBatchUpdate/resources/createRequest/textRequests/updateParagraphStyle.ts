import { registerRequest } from '../registry';
import { RequestDefinition } from '../types';
import {
    createUpdateParagraphStyleRequest,
    updateParagraphStyleDescription,
} from '../documentRequests/updateParagraphStyle';

const updateParagraphStyleTextRequest: RequestDefinition = {
    name: 'Update Paragraph Style',
    value: 'updateParagraphStyle',
    category: 'Text',
    description: updateParagraphStyleDescription,
    operation: createUpdateParagraphStyleRequest,
};

registerRequest(updateParagraphStyleTextRequest);
