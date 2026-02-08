import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { OptionalColor, IOptionalColor } from "./optionalColor";
import { Dimension, IDimension } from "./dimension";
import { Size, ISize } from "./size";
import { documentMode } from "../enums/documentMode";

export interface IDocumentStyle extends IObject {
    background?: {
        color: IOptionalColor
    },
    defaultHeaderId?: string,
    defaultFooterId?: string,
    evenPageHeaderId?: string,
    evenPageFooterId?: string,
    firstPageHeaderId?: string,
    firstPageFooterId?: string,
    useFirstPageHeaderFooter?: boolean,
    useEvenPageHeaderFooter?: boolean,
    pageNumberStart?: number,
    marginTop?: IDimension,
    marginBottom?: IDimension,
    marginRight?: IDimension,
    marginLeft?: IDimension,
    pageSize?: ISize,
    marginHeader?: IDimension,
    marginFooter?: IDimension,
    useCustomHeaderFooterMargins?: boolean,
    flipPageOrientation?: boolean,
    documentFormat?: {
        documentMode: string
    }
}

const color = new OptionalColor();
const dimension = new Dimension();
const size = new Size();

export class DocumentStyle extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                ...color.getDescription()[0],
                displayName: 'Background',
                name: 'background',
                description: 'The background of the document. Documents cannot have a transparent background color.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Default Footer ID',
                name: 'defaultFooterId',
                type: 'string',
                default: '',
                description: 'The ID of the default footer. If not set, there\'s no default footer.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Default Header ID',
                name: 'defaultHeaderId',
                type: 'string',
                default: '',
                description: 'The ID of the default header. If not set, there\'s no default header.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Document Format',
                name: 'documentFormat',
                type: 'options',
                options: documentMode,
                default: 'DOCUMENT_MODE_UNSPECIFIED',
                description: 'Specifies document-level format settings, such as the document mode (pages vs pageless)',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Even Page Footer ID',
                name: 'evenPageFooterId',
                type: 'string',
                default: '',
                description: 'The ID of the footer used only for even pages',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Even Page Header ID',
                name: 'evenPageHeaderId',
                type: 'string',
                default: '',
                description: 'The ID of the header used only for even pages',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'First Page Footer ID',
                name: 'firstPageFooterId',
                type: 'string',
                default: '',
                description: 'The ID of the footer used only for the first page',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'First Page Header ID',
                name: 'firstPageHeaderId',
                type: 'string',
                default: '',
                description: 'The ID of the header used only for the first page',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Flip Page Orientation',
                name: 'flipPageOrientation',
                type: 'boolean',
                default: false,
                description: 'Whether to flip the dimensions of the pageSize, which allows changing the page orientation between portrait and landscape',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Margin Bottom',
                name: 'marginBottom',
                description: 'The bottom page margin.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Margin Footer',
                name: 'marginFooter',
                description: 'The amount of space between the bottom of the page and the contents of the footer.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Margin Header',
                name: 'marginHeader',
                description: 'The amount of space between the top of the page and the contents of the header.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Margin Left',
                name: 'marginLeft',
                description: 'The left page margin.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Margin Right',
                name: 'marginRight',
                description: 'The right page margin.',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Margin Top',
                name: 'marginTop',
                description: 'The top page margin.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Page Number Start',
                name: 'pageNumberStart',
                type: 'number',
                default: 1,
                description: 'The page number from which to start counting',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Page Size',
                name: 'pageSize',
                description: 'The size of a page in the document',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: false,
                },
                default: {},
                options: [
                    {
                        displayName: 'Values',
                        name: 'values',
                        values: size.getDescription()
                    }
                ],
                displayOptions: {
                    show: show
                },
            },
            // {
            //     ...size.getDescription()[0],
            //     displayName: 'Page Size',
            //     name: 'pageSize',
            //     description: 'The size of a page in the document.',
            //     displayOptions: {
            //         show: show
            //     },
            // },
            {
                displayName: 'Use Custom Header Footer Margins',
                name: 'useCustomHeaderFooterMargins',
                type: 'boolean',
                default: false,
                description: 'Whether DocumentStyle marginHeader, SectionStyle marginHeader and DocumentStyle marginFooter, SectionStyle marginFooter are respected. When false, the default values in the Docs editor for header and footer margin is used.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Use Even Page Header Footer',
                name: 'useEvenPageHeaderFooter',
                type: 'boolean',
                default: false,
                description: 'Whether to use the even page header and footer',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Use First Page Header Footer',
                name: 'useFirstPageHeaderFooter',
                type: 'boolean',
                default: false,
                description: 'Whether to use the first page header and footer',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IDocumentStyle {

        const documentStyle = input.getNodeParameter(path, itemIndex, {}) as IInput;

        const style: IDocumentStyle = {};

        const backgroundColor = color.getObject(input, itemIndex, `${path}.background`);
        if (backgroundColor) {
            style.background = { color: backgroundColor };
        }

        if (documentStyle.pageNumberStart !== undefined) {
            style.pageNumberStart = documentStyle.pageNumberStart;
        }

        const sizeObj = size.getObject(input, itemIndex, `${path}.pageSize.values`);
        if (sizeObj) {
            style.pageSize = sizeObj;
        }

        const assignDimension = (paramName: string, targetProp: string) => {
            const dimObj = dimension.getObject(input, itemIndex, `${path}.${paramName}`);
            if (dimObj) {
                // @ts-expect-error - targetProp is a dynamic key of style
                style[targetProp] = dimObj;
            }
        };

        assignDimension('marginTop', 'marginTop');
        assignDimension('marginBottom', 'marginBottom');
        assignDimension('marginRight', 'marginRight');
        assignDimension('marginLeft', 'marginLeft');
        assignDimension('marginHeader', 'marginHeader');
        assignDimension('marginFooter', 'marginFooter');

        if (documentStyle.useFirstPageHeaderFooter !== undefined) {
            style.useFirstPageHeaderFooter = documentStyle.useFirstPageHeaderFooter;
        }

        if (documentStyle.useEvenPageHeaderFooter !== undefined) {
            style.useEvenPageHeaderFooter = documentStyle.useEvenPageHeaderFooter;
        }

        if (documentStyle.useCustomHeaderFooterMargins !== undefined) {
            style.useCustomHeaderFooterMargins = documentStyle.useCustomHeaderFooterMargins;
        }

        if (documentStyle.defaultFooterId !== undefined) {
            style.defaultFooterId = documentStyle.defaultFooterId;
        }

        if (documentStyle.defaultHeaderId !== undefined) {
            style.defaultHeaderId = documentStyle.defaultHeaderId;
        }

        if (documentStyle.evenPageFooterId !== undefined) {
            style.evenPageFooterId = documentStyle.evenPageFooterId;
        }

        if (documentStyle.evenPageHeaderId !== undefined) {
            style.evenPageHeaderId = documentStyle.evenPageHeaderId;
        }

        if (documentStyle.firstPageFooterId !== undefined) {
            style.firstPageFooterId = documentStyle.firstPageFooterId;
        }

        if (documentStyle.firstPageHeaderId !== undefined) {
            style.firstPageHeaderId = documentStyle.firstPageHeaderId;
        }

        if (documentStyle.flipPageOrientation !== undefined) {
            style.flipPageOrientation = documentStyle.flipPageOrientation;
        }

        return style;
    }
}

interface IInput {
    background?: string
    defaultHeaderId?: string,
    defaultFooterId?: string,
    evenPageHeaderId?: string,
    evenPageFooterId?: string,
    firstPageHeaderId?: string,
    firstPageFooterId?: string,
    useFirstPageHeaderFooter?: boolean,
    useEvenPageHeaderFooter?: boolean,
    pageNumberStart?: number,
    marginTop?: number,
    marginBottom?: number,
    marginRight?: number,
    marginLeft?: number,
    pageSize?: ISize,
    marginHeader?: number,
    marginFooter?: number,
    useCustomHeaderFooterMargins?: boolean,
    flipPageOrientation?: boolean,
    documentFormat?: string
}