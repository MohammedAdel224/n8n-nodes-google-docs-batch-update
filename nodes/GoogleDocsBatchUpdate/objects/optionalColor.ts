import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";
import { hexToRgb } from "../utils/hexToRgb";

export interface IOptionalColor extends IObject{
    color?: {
        rgbColor: {
            red: number;
            green: number;
            blue: number;
        };
    };
}

export class OptionalColor extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Color',
                name: 'color',
                type: 'color',
                default: '',
                description: 'The color in hexadecimal format',
                displayOptions: {
                    show: show
                },
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IOptionalColor | undefined {
        const colorPath = path ? path : 'color';
        const colorHex = input.getNodeParameter(colorPath, itemIndex, '') as string;
        const colorRgb = hexToRgb(colorHex);

        const optionalColor: IOptionalColor = {};
        if (colorHex) {
            optionalColor.color = {
                rgbColor: {
                    red: colorRgb.red,
                    green: colorRgb.green,
                    blue: colorRgb.blue,
                },
            };
        }

        if (Object.keys(optionalColor).length === 0) {
            return undefined;
        }
        
        return optionalColor;
    }
}