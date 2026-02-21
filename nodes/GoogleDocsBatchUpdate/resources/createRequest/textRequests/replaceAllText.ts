import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { ITabsCriteria, TabsCriteria } from '../../../objects/tabsCriteria';
import { ISubstringMatchCriteria, SubstringMatchCriteria } from '../../../objects/substringMatchCriteria';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestReplaceAllText = {
    resource: ['createRequest'],
    operation: ['replaceAllText'],
};

const tabsCriteria = new TabsCriteria();
const containsText = new SubstringMatchCriteria(showForCreateRequestReplaceAllText);

export const replaceAllTextDescription: INodeProperties[] = [
    {
        displayName: 'New Text',
        name: 'replaceText',
        type: 'string',
        default: '',
        description: 'The text that will replace the matched text',
        displayOptions: {
            show: showForCreateRequestReplaceAllText,
        },
    },
    ...containsText.getDescription(),
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: showForCreateRequestReplaceAllText,
        },
        options: [
            ...tabsCriteria.getDescription(),
        ],
    }
];

export const createReplaceAllTextRequest = wrapInRequest(
    (input: IExecuteFunctions, itemIndex: number): IReplaceAllTextRequest => {
        const replaceText = input.getNodeParameter('replaceText', itemIndex) as string;
        const tabs = tabsCriteria.getObject(input, itemIndex, 'additionalFields');
        const substringMatchCriteria = containsText.getObject(input, itemIndex);

        return {
            replaceAllText: {
                replaceText,
                ...tabs,
                containsText: substringMatchCriteria,
            }
        };
    }
);

export interface IReplaceAllTextRequest extends IBaseGoogleDocsRequest {
    replaceAllText: {
        replaceText: string;
        containsText?: ISubstringMatchCriteria;
    } & ITabsCriteria;
}

const replaceAllTextRequest: RequestDefinition = {
    name: 'Replace All Text',
    value: 'replaceAllText',
    category: 'Text',
    description: replaceAllTextDescription,
    operation: createReplaceAllTextRequest,
};

registerRequest(replaceAllTextRequest);