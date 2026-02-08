import { INodePropertyOptions } from "n8n-workflow";

export const dashStyle: INodePropertyOptions[] = [
    {
        name: 'Unspecified',
        value: 'DASH_STYLE_UNSPECIFIED',
        description: 'Unspecified dash style'
    },
    {
        name: 'Solid',
        value: 'SOLID',
        description: 'Solid line. Corresponds to ECMA-376 ST_PresetLineDashVal value \'solid\'. This is the default dash style.'
    },
    {
        name: 'Dot',
        value: 'DOT',
        description: 'Dotted line. Corresponds to ECMA-376 ST_PresetLineDashVal value \'dot\'.'
    },

    {
        name: 'Dash',
        value: 'DASH',
        description: 'Dashed line. Corresponds to ECMA-376 ST_PresetLineDashVal value \'dash\'.'
    },
];