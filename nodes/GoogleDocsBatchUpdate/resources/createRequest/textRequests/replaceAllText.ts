import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { ITabsCriteria, TabsCriteria } from '../../../objects/tabsCriteria';
import { ISubstringMatchCriteria, SubstringMatchCriteria } from '../../../objects/substringMatchCriteria';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

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

interface IReplaceAllTextRequest extends IGoogleDocsRequest {
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