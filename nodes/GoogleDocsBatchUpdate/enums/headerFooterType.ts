import { INodePropertyOptions } from 'n8n-workflow';

export const headerFooterType: INodePropertyOptions[] = [
    {
        name: 'Unspecified',
        value: 'HEADER_FOOTER_TYPE_UNSPECIFIED',
        description: 'The header/footer type is unspecified',
    },
    {
        name: 'Default',
        value: 'DEFAULT',
        description: 'A default header/footer',
    }
];
