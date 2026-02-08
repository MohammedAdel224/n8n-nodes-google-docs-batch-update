import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { OptionalColor, IOptionalColor } from "./optionalColor";
import { Dimension, IDimension } from "./dimension";
import { alignment } from "../enums/alignment";
import { contentDirection } from "../enums/contentDirection";
import { namedStyleType } from "../enums/namedStyleType";
import { spacingMode } from "../enums/spacingMode";
import { IParagraphBorder, ParagraphBorder } from "./paragraphBorder";

export interface IParagraphStyle extends IObject {
    alignment?: string;
    avoidWidowAndOrphan?: boolean;
    borderBetween?: IParagraphBorder;
    borderBottom?: IParagraphBorder;
    borderLeft?: IParagraphBorder;
    borderRight?: IParagraphBorder;
    borderTop?: IParagraphBorder;
    direction?: string;
    indentEnd?: IDimension;
    indentFirstLine?: IDimension;
    indentStart?: IDimension;
    keepLinesTogether?: boolean;
    keepWithNext?: boolean;
    lineSpacing?: number;
    namedStyleType?: string;
    pageBreakBefore?: boolean;
    shading?: {
        backgroundColor: IOptionalColor;
    };
    spaceAbove?: IDimension;
    spaceBelow?: IDimension;
    spacingMode?: string;
}

const dimension = new Dimension();
const paragraphBorder = new ParagraphBorder();
const color = new OptionalColor();

export class ParagraphStyle extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Alignment',
                name: 'alignment',
                type: 'options',
                options: alignment,
                default: 'ALIGNMENT_UNSPECIFIED',
                description: 'The text alignment for this paragraph',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Avoid Widow And Orphan',
                name: 'avoidWidowAndOrphan',
                type: 'boolean',
                default: false,
                description: 'Whether to avoid widows and orphans for the paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...paragraphBorder.getDescription()[0],
                displayName: 'Border Between',
                name: 'borderBetween',
                description: 'The border between this paragraph and the next and previous paragraphs. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...paragraphBorder.getDescription()[0],
                displayName: 'Border Bottom',
                name: 'borderBottom',
                description: 'The border at the bottom of this paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...paragraphBorder.getDescription()[0],
                displayName: 'Border Left',
                name: 'borderLeft',
                description: 'The border to the left of this paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...paragraphBorder.getDescription()[0],
                displayName: 'Border Right',
                name: 'borderRight',
                description: 'The border to the right of this paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...paragraphBorder.getDescription()[0],
                displayName: 'Border Top',
                name: 'borderTop',
                description: 'The border at the top of this paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Direction',
                name: 'direction',
                type: 'options',
                options: contentDirection,
                default: 'LEFT_TO_RIGHT',
                description: 'The text direction of this paragraph',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Indent End',
                name: 'indentEnd',
                description: 'The amount of indentation for the paragraph on the side that corresponds to the end of the text, based on the current paragraph direction. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Indent First Line',
                name: 'indentFirstLine',
                description: 'The amount of indentation for the first line of the paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Indent Start',
                name: 'indentStart',
                description: 'The amount of indentation for the paragraph on the side that corresponds to the start of the text, based on the current paragraph direction. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Keep Lines Together',
                name: 'keepLinesTogether',
                type: 'boolean',
                default: false,
                description: 'Whether all lines of the paragraph should be laid out on the same page or column if possible. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Keep With Next',
                name: 'keepWithNext',
                type: 'boolean',
                default: false,
                description: 'Whether at least a part of this paragraph should be laid out on the same page or column as the next paragraph if possible. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Line Spacing',
                name: 'lineSpacing',
                type: 'number',
                default: null,
                description: 'The amount of space between lines, as a percentage of normal, where normal is represented as 100.0. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Named Style Type',
                name: 'namedStyleType',
                type: 'options',
                options: namedStyleType,
                default: 'NAMED_STYLE_TYPE_UNSPECIFIED',
                description: 'The named style type of the paragraph',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Page Break Before',
                name: 'pageBreakBefore',
                type: 'boolean',
                default: false,
                description: 'Whether the current paragraph should always start at the beginning of a page. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...color.getDescription()[0],
                displayName: 'Shading',
                name: 'shading',
                description: 'The shading of the paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Space Above',
                name: 'spaceAbove',
                description: 'The amount of extra space above the paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Space Below',
                name: 'spaceBelow',
                description: 'The amount of extra space below the paragraph. If unset, the value is inherited from the parent.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Spacing Mode',
                name: 'spacingMode',
                type: 'options',
                options: spacingMode,
                default: 'SPACING_MODE_UNSPECIFIED',
                description: 'The spacing mode for the paragraph',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IParagraphStyle {
        const style = input.getNodeParameter(path, itemIndex, {}) as IInput;

        const paragraphStyle: IParagraphStyle = {};

        if (style.namedStyleType) paragraphStyle.namedStyleType = style.namedStyleType;
        if (style.alignment) paragraphStyle.alignment = style.alignment;
        if (style.lineSpacing) paragraphStyle.lineSpacing = style.lineSpacing;
        if (style.direction) paragraphStyle.direction = style.direction;
        if (style.spacingMode) paragraphStyle.spacingMode = style.spacingMode;

        const assignDimension = (paramName: string, targetProp: string) => {
            const dimObj = dimension.getObject(input, itemIndex, `${path}.${paramName}`);
            if (dimObj) {
                // @ts-expect-error - targetProp is a dynamic key of style
                paragraphStyle[targetProp] = dimObj;
            }
        };

        assignDimension('spaceAbove', 'spaceAbove');
        assignDimension('spaceBelow', 'spaceBelow');
        assignDimension('indentFirstLine', 'indentFirstLine');
        assignDimension('indentStart', 'indentStart');
        assignDimension('indentEnd', 'indentEnd');

        const assignBorder = (paramName: string, targetProp: string) => {
            const border = paragraphBorder.getObject(input, itemIndex, `${path}.${paramName}`);
            if (border) {
                // @ts-expect-error - targetProp is a dynamic key of style
                paragraphStyle[targetProp] = border;
            }
        };

        assignBorder('borderBetween', 'borderBetween');
        assignBorder('borderTop', 'borderTop');
        assignBorder('borderBottom', 'borderBottom');
        assignBorder('borderLeft', 'borderLeft');
        assignBorder('borderRight', 'borderRight');

        if (style.keepLinesTogether !== undefined) paragraphStyle.keepLinesTogether = style.keepLinesTogether;
        if (style.keepWithNext !== undefined) paragraphStyle.keepWithNext = style.keepWithNext;
        if (style.avoidWidowAndOrphan !== undefined) paragraphStyle.avoidWidowAndOrphan = style.avoidWidowAndOrphan;

        const shadingObj = color.getObject(input, itemIndex, `${path}.shading`);
        if (shadingObj) {
            paragraphStyle.shading = { backgroundColor: shadingObj };
        }

        if (style.pageBreakBefore !== undefined) paragraphStyle.pageBreakBefore = style.pageBreakBefore;

        return paragraphStyle
    };
}


interface IInput {
    alignment: string;
    avoidWidowAndOrphan: boolean;
    direction: string;
    namedStyleType: string;
    keepLinesTogether: boolean;
    keepWithNext: boolean;
    lineSpacing: number;
    pageBreakBefore: boolean;
    spacingMode: string;
}