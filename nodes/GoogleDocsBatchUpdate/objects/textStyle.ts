import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { Dimension, IDimension } from "./dimension";
import { IOptionalColor, OptionalColor } from "./optionalColor";
import { baselineOffset } from "../enums/baselineOffset";
import { WeightedFontFamily, IWeightedFontFamily } from "./weightedFontFamily";
import { ILink, Link } from "./link";

export interface ITextStyle extends IObject {
    backgroundColor?: IOptionalColor;
    baselineOffset?: string;
    bold?: boolean;
    fontSize?: IDimension;
    foregroundColor?: IOptionalColor;
    italic?: boolean;
    link?: ILink;
    smallCaps?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    weightedFontFamily?: IWeightedFontFamily;
}

const dimension = new Dimension();
const color = new OptionalColor();
const weightedFontFamily = new WeightedFontFamily();
const link = new Link();

export class TextStyle extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                ...color.getDescription()[0],
                displayName: 'Background Color',
                name: 'backgroundColor',
                default: '#ffffff',
                description: 'The background color of the text. If set, the color is either an RGB color or transparent, depending on the color field.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Baseline Offset',
                name: 'baselineOffset',
                type: 'options',
                options: baselineOffset,
                default: 'BASELINE_OFFSET_UNSPECIFIED',
                description: 'The text\'s vertical offset from its normal position',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Bold',
                name: 'bold',
                type: 'boolean',
                default: false,
                description: 'Whether or not the text is rendered as bold',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Font Size',
                name: 'fontSize',
                description: 'The size of the text\'s font',
                displayOptions: {
                    show: show
                },
            },
            {
                ...color.getDescription()[0],
                displayName: 'Foreground Color',
                name: 'foregroundColor',
                default: '#000000',
                description: 'The foreground color of the text. If set, the color is either an RGB color or transparent, depending on the color field.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Italic',
                name: 'italic',
                type: 'boolean',
                default: false,
                description: 'Whether or not the text is italicized',
                displayOptions: {
                    show: show
                },
            },
            ...link.getDescription(),
            {
                displayName: 'Small Caps',
                name: 'smallCaps',
                type: 'boolean',
                default: false,
                description: 'Whether or not the text is in small capital letters',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Strikethrough',
                name: 'strikethrough',
                type: 'boolean',
                default: false,
                description: 'Whether or not the text is struck through',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Underline',
                name: 'underline',
                type: 'boolean',
                default: false,
                description: 'Whether or not the text is underlined',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Weighted Font Family',
                name: 'weightedFontFamily',
                type: 'fixedCollection',
                default: {},
                description: 'The font family and rendered weight of the text',
                typeOptions: {
                    multipleValues: false
                },
                options: [
                    {
                        displayName: 'Font',
                        name: 'font',
                        values: weightedFontFamily.getDescription(),
                    },
                ],
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITextStyle {
        const style = input.getNodeParameter(path, itemIndex, {}) as IInput;
        const fontSize = dimension.getObject(input, itemIndex, `${path}.fontSize`);
        const weightedFontFamily_ = weightedFontFamily.getObject(input, itemIndex, `${path}.weightedFontFamily.font`);
        const link_ = link.getObject(input, itemIndex, path);

        const textStyle: ITextStyle = {};

        // Always include all provided style values
        if (style?.bold !== undefined) textStyle.bold = style.bold;
        if (style?.italic !== undefined) textStyle.italic = style.italic;
        if (style?.underline !== undefined) textStyle.underline = style.underline;
        if (style?.strikethrough !== undefined) textStyle.strikethrough = style.strikethrough;
        if (style?.smallCaps !== undefined) textStyle.smallCaps = style.smallCaps;
        if (style?.backgroundColor) {
            textStyle.backgroundColor = color.getObject(input, itemIndex, `${path}.backgroundColor`);
        }
        if (style?.foregroundColor) {
            textStyle.foregroundColor = color.getObject(input, itemIndex, `${path}.foregroundColor`);
        }
        if (fontSize !== null) {
            textStyle.fontSize = fontSize;
        }
        if (weightedFontFamily_ !== undefined) {
            textStyle.weightedFontFamily = weightedFontFamily_;
        }
        if (style?.baselineOffset && style.baselineOffset !== 'BASELINE_OFFSET_UNSPECIFIED') {
            textStyle.baselineOffset = style.baselineOffset;
        }
        if (link_ !== undefined) {
            textStyle.link = link_;
        }

        return textStyle;
    };
}

interface IInput {
    baselineOffset?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    smallCaps?: boolean;
    backgroundColor?: string;
    foregroundColor?: string;
    widthType?: string;
}