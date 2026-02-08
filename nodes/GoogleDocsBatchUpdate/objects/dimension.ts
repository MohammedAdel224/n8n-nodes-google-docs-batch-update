import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";

export interface IDimension extends IObject {
    magnitude?: number;
    unit?: 'PT';
}

export class Dimension extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Magnitude',
                name: 'magnitude',
                type: 'number',
                default: null,
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IDimension | undefined {
        const magnitudePath = path ? path : 'magnitude';
        const magnitude = input.getNodeParameter(magnitudePath, itemIndex, null) as number | null;

        const dimension: IDimension = {};
        if (magnitude !== null) {
            dimension.magnitude = magnitude;
            dimension.unit = 'PT';
        }

        if (Object.keys(dimension).length === 0) {
            return undefined;
        }

        return dimension;
    }

    public createObject(magnitude: number): IDimension {
        return {
            magnitude,
            unit: 'PT',
        };
    }
}