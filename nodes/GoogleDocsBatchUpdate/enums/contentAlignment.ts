import { INodePropertyOptions } from "n8n-workflow";

export const contentAlignment: INodePropertyOptions[] = [
    {
        name: 'Unspecified',
        value: 'CONTENT_ALIGNMENT_UNSPECIFIED',
        description: 'An unspecified content alignment. The content alignment is inherited from the parent if it exists.',
    },
    {
        name: 'Top',
        value: 'CONTENT_ALIGNMENT_TOP',
        description: 'An alignment that aligns the content to the top of the cell',
    },
    {
        name: 'Middle',
        value: 'CONTENT_ALIGNMENT_MIDDLE',
        description: 'An alignment that aligns the content to the middle of the cell',
    },
    {
        name: 'Bottom',
        value: 'CONTENT_ALIGNMENT_BOTTOM',
        description: 'An alignment that aligns the content to the bottom of the cell',
    },
];