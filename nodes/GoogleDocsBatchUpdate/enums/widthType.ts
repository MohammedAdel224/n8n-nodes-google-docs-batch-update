import { INodePropertyOptions } from "n8n-workflow";

export const widthType: INodePropertyOptions[] = [
    {
        name: 'Evenly Distributed',
        value: 'EVENLY_DISTRIBUTED',
        description: 'The column width is evenly distributed among the other columns',
    },
    {
        name: 'Fixed Width',
        value: 'FIXED_WIDTH',
        description: 'The column has a fixed width',
    },
];