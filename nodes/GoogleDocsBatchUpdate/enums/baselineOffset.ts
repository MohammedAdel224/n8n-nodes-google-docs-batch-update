import { INodePropertyOptions } from "n8n-workflow";

export const baselineOffset: INodePropertyOptions[] = [
    {
        name: 'Inherited',
        value: 'BASELINE_OFFSET_UNSPECIFIED',
        description: 'The text\'s baseline offset is inherited from the parent',
    },
    {
        name: 'None',
        value: 'NONE',
        description: 'The text is not vertically offset',
    },
    {
        name: 'Superscript',
        value: 'SUPERSCRIPT',
        description: 'The text is vertically offset upwards (superscript)',
    },
    {
        name: 'Subscript',
        value: 'SUBSCRIPT',
        description: 'The text is vertically offset downwards (subscript)',
    },
];