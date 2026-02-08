import { INodePropertyOptions } from "n8n-workflow";

export const namedStyleType: INodePropertyOptions[] = [
    {
        name: 'Unspecified',
        value: 'NAMED_STYLE_TYPE_UNSPECIFIED',
        description: 'The type of named style is unspecified'
    },
    {
        name: 'Normal Text',
        value: 'NORMAL_TEXT',
    },
    {
        name: 'Title',
        value: 'TITLE',
    },
    {
        name: 'HEADING_1',
        value: 'Heading 1',
    },
    {
        name: 'HEADING_2',
        value: 'Heading 2',
    },
    {
        name: 'HEADING_3',
        value: 'Heading 3',
    },
    {
        name: 'HEADING_4',
        value: 'Heading 4',
    },
    {
        name: 'HEADING_5',
        value: 'Heading 5',
    },
    {
        name: 'HEADING_6',
        value: 'Heading 6',
    },
];