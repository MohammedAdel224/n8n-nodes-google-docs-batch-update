import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { IRange, Range } from '../../../objects/range';
import { bulletGlyphPreset } from '../../../enums/bulletGlyphPreset';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestCreateParagraphBullets = {
    resource: ['createRequest'],
    operation: ['createParagraphBullets'],
};

const range = new Range(showForCreateRequestCreateParagraphBullets);

export const createParagraphBulletsDescription: INodeProperties[] = [
    ...range.getDescription(),
    {
        displayName: 'Bullet Preset',
        name: 'bulletPreset',
        type: 'options',
        default: 'BULLET_DISC_CIRCLE_SQUARE',
        description: 'The kinds of bullet glyphs to be used',
        options: bulletGlyphPreset,
        displayOptions: {
            show: showForCreateRequestCreateParagraphBullets,
        },
    },
];

interface ICreateParagraphBulletsRequest extends IGoogleDocsRequest {
    createParagraphBullets: {
        range?: IRange;
        bulletPreset?: string;
    }
}

export const createCreateParagraphBulletsRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): ICreateParagraphBulletsRequest => {
        const range_ = range.getObject(input, itemIndex);
        const bulletPreset = input.getNodeParameter('bulletPreset', itemIndex, null) as string;

        const createParagraphBulletsRequest: ICreateParagraphBulletsRequest = {
            createParagraphBullets: {
                range: range_,
            }
        };

        if (bulletPreset) {
            createParagraphBulletsRequest.createParagraphBullets.bulletPreset = bulletPreset;
        }

        return createParagraphBulletsRequest;
    }
);

const createParagraphBulletsRequest: RequestDefinition = {
    name: 'Create Paragraph Bullets',
    value: 'createParagraphBullets',
    category: 'Bullets',
    description: createParagraphBulletsDescription,
    operation: createCreateParagraphBulletsRequest,
};

registerRequest(createParagraphBulletsRequest);