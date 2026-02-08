import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { OptionalColor, IOptionalColor } from "./optionalColor";
import { Dimension, IDimension } from "./dimension";
import { TableCellBorder, ITableCellBorder } from "./tableCellBorder";
import { contentAlignment } from "../enums/contentAlignment";

export interface ITableCellStyle extends IObject {
    backgroundColor?: IOptionalColor;
    borderBottom?: ITableCellBorder;
    borderLeft?: ITableCellBorder;
    borderRight?: ITableCellBorder;
    borderTop?: ITableCellBorder;
    columnSpan?: number;
    contentAlignment?: string;
    paddingBottom?: IDimension;
    paddingLeft?: IDimension;
    paddingRight?: IDimension;
    paddingTop?: IDimension;
    rowSpan?: number;
}

const color = new OptionalColor();
const tableCellBorder = new TableCellBorder();
const dimension = new Dimension();

export class TableCellStyle extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                ...color.getDescription()[0],
                displayName: 'Background Color',
                name: 'backgroundColor',
                description: 'The background color of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...tableCellBorder.getDescription()[0],
                displayName: 'Border Bottom',
                name: 'borderBottom',
                description: 'The bottom border of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...tableCellBorder.getDescription()[0],
                displayName: 'Border Left',
                name: 'borderLeft',
                description: 'The left border of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...tableCellBorder.getDescription()[0],
                displayName: 'Border Right',
                name: 'borderRight',
                description: 'The right border of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...tableCellBorder.getDescription()[0],
                displayName: 'Border Top',
                name: 'borderTop',
                description: 'The top border of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Column Span',
                name: 'columnSpan',
                type: 'number',
                default: 1,
                description: 'The column span of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Content Alignment',
                name: 'contentAlignment',
                type: 'options',
                options: contentAlignment,
                default: 'CONTENT_ALIGNMENT_UNSPECIFIED',
                description: 'The alignment of the content in the table cell. The default alignment matches the alignment for newly created table cells in the Docs editor.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Padding Bottom',
                name: 'paddingBottom',
                description: 'The bottom padding of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Padding Left',
                name: 'paddingLeft',
                description: 'The left padding of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Padding Right',
                name: 'paddingRight',
                description: 'The right padding of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Padding Top',
                name: 'paddingTop',
                description: 'The top padding of the cell',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Row Span',
                name: 'rowSpan',
                type: 'number',
                default: 1,
                description: 'The row span of the cell',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITableCellStyle {
        const style = input.getNodeParameter(path, itemIndex, {}) as IInput;
        
        const tableCellStyle: ITableCellStyle = {};
        if (style.rowSpan) tableCellStyle.rowSpan = style.rowSpan;
        if (style.columnSpan) tableCellStyle.columnSpan = style.columnSpan;

        const backgroundColor = color.getObject(input, itemIndex, `${path}.backgroundColor`);
        if (backgroundColor && backgroundColor.color) {
            tableCellStyle.backgroundColor = backgroundColor;
        }

        const assignBorder = (paramName: string, targetProp: string) => {
            const border = tableCellBorder.getObject(input, itemIndex, `${path}.${paramName}`);
            if (border) {
                // @ts-expect-error - targetProp is a dynamic key of style
                tableCellStyle[targetProp] = border;
            }
        };

        assignBorder('borderLeft', 'borderLeft');
        assignBorder('borderRight', 'borderRight');
        assignBorder('borderTop', 'borderTop');
        assignBorder('borderBottom', 'borderBottom');

        const assignDimension = (paramName: string, targetProp: string) => {
            const dimObj = dimension.getObject(input, itemIndex, `${path}.${paramName}`);
            if (dimObj) {
                // @ts-expect-error - targetProp is a dynamic key of style
                tableCellStyle[targetProp] = dimObj;
            }
        };

        assignDimension('paddingLeft', 'paddingLeft');
        assignDimension('paddingRight', 'paddingRight');
        assignDimension('paddingTop', 'paddingTop');
        assignDimension('paddingBottom', 'paddingBottom');

        if (style.contentAlignment) tableCellStyle.contentAlignment = style.contentAlignment;

        return tableCellStyle;
    };
}


interface IInput {
    columnSpan: number;
    contentAlignment: string;
    rowSpan: number;
}