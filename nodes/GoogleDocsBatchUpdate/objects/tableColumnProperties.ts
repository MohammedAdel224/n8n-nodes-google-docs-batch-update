import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { Dimension, IDimension } from "./dimension";
import { widthType } from "../enums/widthType";

export interface ITableColumnProperties extends IObject {
    widthType?: string;
    width?: IDimension;
}

const dimension = new Dimension();

export class TableColumnProperties extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Width Type',
                name: 'widthType',
                type: 'options',
                options: widthType,
                default: 'FIXED_WIDTH',
                description: 'The width type of the column',
                displayOptions: {
                    show: show
                },
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Width',
                name: 'width',
                description: 'The width of the column. This property is ignored if the width type is not FIXED_WIDTH.',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ITableColumnProperties {
        const properties = input.getNodeParameter(path, itemIndex, {}) as IInput;

        const tableColumnProperties: ITableColumnProperties = {};
        if (properties.widthType) {
            tableColumnProperties.widthType = properties.widthType;
        }

        const widthObj = dimension.getObject(input, itemIndex, `${path}.width`);
        if (widthObj) {
            tableColumnProperties.width = widthObj;
        }

        return tableColumnProperties;
    };
}

interface IInput{
    widthType: string;
}