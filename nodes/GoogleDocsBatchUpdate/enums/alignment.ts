import { INodePropertyOptions } from "n8n-workflow";

export const alignment: INodePropertyOptions[] = [
    {
        name: 'Inherited',
        value: 'ALIGNMENT_UNSPECIFIED',
        description: 'The paragraph alignment is inherited from the parent'
    },
    {
        name: 'START',
        value: 'START',
        description: 'The paragraph is aligned to the start of the line. Left-aligned for LTR text, right-aligned otherwise.'
    },
    {
        name: 'CENTER',
        value: 'CENTER',
        description: 'The paragraph is centered'
    },
    {
        name: 'END',
        value: 'END',
        description: 'The paragraph is aligned to the end of the line. Right-aligned for LTR text, left-aligned otherwise.'
    },
    {
        name: 'JUSTIFIED',
        value: 'JUSTIFIED',
        description: 'The paragraph is justified'
    },
];