import { INodePropertyOptions } from 'n8n-workflow';

export const documentMode: INodePropertyOptions[] = [
    {
        name: 'Unspecified',
        value: 'DOCUMENT_MODE_UNSPECIFIED',
        description: 'The document mode is unspecified',
    },
    {
        name: 'Pages',
        value: 'PAGES',
        description: 'The document has pages',
    },
    {
        name: 'Pageless',
        value: 'PAGELESS',
        description: 'The document is pageless',
    },
];
