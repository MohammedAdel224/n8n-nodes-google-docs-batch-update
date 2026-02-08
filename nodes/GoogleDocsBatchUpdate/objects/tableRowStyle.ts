import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { Dimension, IDimension } from "./dimension";

export interface ITableRowStyle extends IObject {
    minRowHeight?: IDimension;
    tableHeader?: boolean;
    preventOverflow?: boolean;
}

const dimension = new Dimension();

export class TableRowStyle extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                ...dimension.getDescription()[0],
                displayName: 'Min Row Height',
                name: 'minRowHeight',
                description: 'The minimum height of the row. The row will be rendered in the Docs editor at a height equal to or greater than this value in order to preserve all the content in the row\'s cells.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Table Header',
                name: 'tableHeader',
                type: 'boolean',
                default: false,
                description: 'Whether the row is a table header',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Prevent Overflow',
                name: 'preventOverflow',
                type: 'boolean',
                default: false,
                description: 'Whether the row cannot overflow across page or column boundaries',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITableRowStyle {
        const style = input.getNodeParameter(path, itemIndex, {}) as IInput;
        const tableRowStyle: ITableRowStyle = {};

        const minRowHeight = dimension.getObject(input, itemIndex, `${path}.minRowHeight`);
        if (minRowHeight) {
            tableRowStyle.minRowHeight = minRowHeight;
        }

        if (style.tableHeader !== undefined) tableRowStyle.tableHeader = style.tableHeader;
        if (style.preventOverflow !== undefined) tableRowStyle.preventOverflow = style.preventOverflow;

        return tableRowStyle;
    };
}

interface IInput {
    tableHeader?: boolean;
    preventOverflow?: boolean;
}