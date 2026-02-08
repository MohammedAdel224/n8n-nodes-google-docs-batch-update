import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface ISubstringMatchCriteria extends IObject {
    text: string;
    matchCase?: boolean;
    searchByRegex?: boolean;
}

export class SubstringMatchCriteria extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Match Text',
                name: 'matchText',
                type: 'string',
                default: '',
                required: true,
                description: 'The text to search for in the document',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Match Case',
                name: 'matchCase',
                type: 'boolean',
                default: true,
                description: 'Whether the search should respect case: True : the search is case sensitive. False : the search is case insensitive.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Search By Regex',
                name: 'searchByRegex',
                type: 'boolean',
                default: false,
                description: 'Whether search using regex. True if the find value should be treated as a regular expression. Any backslashes in the pattern should be escaped.\nTrue : the search text is treated as a regular expressions.\nFalse : the search text is treated as a substring for matching',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ISubstringMatchCriteria | undefined {
        const textPath = path ? `${path}.matchText` : 'matchText';
        const matchCasePath = path ? `${path}.matchCase` : 'matchCase';
        const searchByRegexPath = path ? `${path}.searchByRegex` : 'searchByRegex';
        
        const text = input.getNodeParameter(textPath, itemIndex, null) as string;
        const matchCase = input.getNodeParameter(matchCasePath, itemIndex, null) as boolean;
        const searchByRegex = input.getNodeParameter(searchByRegexPath, itemIndex, null) as boolean;

        const criteria: ISubstringMatchCriteria = { text };
        if (matchCase !== null) criteria.matchCase = matchCase;
        if (searchByRegex !== null) criteria.searchByRegex = searchByRegex;

        if (Object.keys(criteria).length === 0) {
            return undefined;
        }

        return criteria;
    }
}




















