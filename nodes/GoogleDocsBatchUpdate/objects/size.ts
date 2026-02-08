import { Dimension, IDimension } from "./dimension";
import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";

export interface ISize extends IObject{
    height?: IDimension,
    width?: IDimension,
}



export class Size extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const dimension = new Dimension(show);
        const description: INodeProperties[] = [
            {
                ...dimension.getDescription()[0],
                displayName: 'Height',
                name: 'height',
                description: 'The height of the object',
            },
            {
                ...dimension.getDescription()[0],
                displayName: 'Width',
                name: 'width',
                description: 'The width of the object',
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ISize | undefined {
        const heightPath = path ? `${path}.height` : 'height';
        const widthPath = path ? `${path}.width` : 'width';

        const dimension = new Dimension();
        const height = dimension.getObject(input, itemIndex, heightPath);
        const width = dimension.getObject(input, itemIndex, widthPath);
        const size: ISize = {};
        
        if (height) {
            size.height = height;
        }
        if (width) {
            size.width = width;
        }

        if (Object.keys(size).length === 0) {
            return undefined;
        }

        return size;
    }
}
