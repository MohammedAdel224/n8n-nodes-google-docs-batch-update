
import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { Dimension, IDimension } from './dimension';
import { IOptionalColor, OptionalColor } from './optionalColor';
import { dashStyle } from '../enums/dashStyle';

const dimension = new Dimension();
const color = new OptionalColor();

export interface IParagraphBorder extends IObject {
    color?: IOptionalColor;
    width?: IDimension;
    padding?: IDimension;
    dashStyle?: string;
}

export class ParagraphBorder extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Paragraph Border',
                name: 'paragraphBorder',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: false,
                },
                default: {},
                displayOptions: { show },
                options: [
                    {
                        displayName: 'Values',
                        name: 'values',
                        values: [
                            ...color.getDescription(),
                            {
                                ...dimension.getDescription()[0],
                                displayName: 'Width',
                                name: 'width',
                                description: 'The width of the border.',
                            },
                            {
                                ...dimension.getDescription()[0],
                                displayName: 'Padding',
                                name: 'padding',
                                description: 'The padding of the border.',
                            },
                            {
                                displayName: 'Dash Style',
                                name: 'dashStyle',
                                type: 'options',
                                options: dashStyle,
                                default: 'DASH_STYLE_UNSPECIFIED',
                            },
                        ]
                    }
                ],
            }
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IParagraphBorder | undefined {
        const valuePath = path ? `${path}.values` : 'paragraphBorder.values';

        const color_ = color.getObject(input, itemIndex, `${valuePath}.color`);
        const width = dimension.getObject(input, itemIndex, `${valuePath}.width`);
        const padding = dimension.getObject(input, itemIndex, `${valuePath}.padding`);
        const dashStyle = input.getNodeParameter(`${valuePath}.dashStyle`, itemIndex, "") as string;

        const border: IParagraphBorder = {};
        if (color_ && color_.color) border.color = color_;
        if (width) border.width = width;
        if (padding) border.padding = padding;
        if (dashStyle) border.dashStyle = dashStyle;
        
        if (Object.keys(border).length === 0) {
            return undefined;
        }

        return border;
    }
}