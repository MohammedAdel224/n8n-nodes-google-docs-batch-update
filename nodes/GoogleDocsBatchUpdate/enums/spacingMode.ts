import { INodePropertyOptions } from "n8n-workflow";

export const spacingMode: INodePropertyOptions[] = [
        {
            name: 'Inherited',
            value: 'SPACING_MODE_UNSPECIFIED',
            description: 'The spacing mode is inherited from the parent'
        },
        {
            name: 'Never Collapse',
            value: 'NEVER_COLLAPSE',
            description: 'Paragraph spacing is always rendered'
        },
        {
            name: 'Collapse Lists',
            value: 'COLLAPSE_LISTS',
            description: 'Paragraph spacing is skipped between list elements'
        },
    ];