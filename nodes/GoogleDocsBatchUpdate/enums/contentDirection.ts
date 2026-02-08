import { INodePropertyOptions } from "n8n-workflow";

export const contentDirection: INodePropertyOptions[] = [
    {
        name: 'Left to Right',
        value: 'LEFT_TO_RIGHT',
        description: 'The content goes from left to right'
    },
    {
        name: 'Right to Left',
        value: 'RIGHT_TO_LEFT',
        description: 'The content goes from right to left'
    },
];