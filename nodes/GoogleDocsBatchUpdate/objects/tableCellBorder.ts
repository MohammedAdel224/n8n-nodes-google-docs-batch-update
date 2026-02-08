import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { Dimension, IDimension } from './dimension';
import { IOptionalColor, OptionalColor } from './optionalColor';
import { dashStyle } from '../enums/dashStyle';

const dimension = new Dimension();
const color = new OptionalColor();

export interface ITableCellBorder extends IObject {
    color?: IOptionalColor;
    width?: IDimension;
    dashStyle?: string;
}

interface IValues {
    color?: string;
    width?: number;
    dashStyle?: string;
}

interface IInput{
    values: IValues;
}

export class TableCellBorder extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Table Cell Border',
                name: 'tableCellBorder',
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
                                displayOptions: { show },
                            },
                            {
                                displayName: 'Dash Style',
                                name: 'dashStyle',
                                type: 'options',
                                options: dashStyle,
                                default: 'DASH_STYLE_UNSPECIFIED',
                                description: 'The dash style of the border',
                                displayOptions: { show }
                            },
                        ]
                    }
                ],
                description: 'The border of the table cell',
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITableCellBorder | undefined {
        const valuePath = path ? `${path}.values` : 'tableCellBorder.values';

        const borderData = input.getNodeParameter(path, itemIndex, {}) as IInput;
        const values = borderData.values || {};

        const color_ = color.getObject(input, itemIndex, `${valuePath}.color`);
        const width = dimension.getObject(input, itemIndex, `${valuePath}.width`);
        const dashStyle = values.dashStyle as string | undefined;

        const border: ITableCellBorder = {};
        if (color_) border.color = color_;
        if (width) border.width = width;
        if (dashStyle) border.dashStyle = dashStyle;
        
        if (Object.keys(border).length === 0) {
            return undefined;
        }

        return border;
    }
}
