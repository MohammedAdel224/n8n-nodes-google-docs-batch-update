import { IGoogleDocsObject, IObject } from "./IGoogleDocsObject";
import type { INodeProperties, IExecuteFunctions } from "n8n-workflow";

export interface IWeightedFontFamily extends IObject {
    font?: {
        fontFamily?: string;
        weight?: number;
    }
}

export class WeightedFontFamily extends IGoogleDocsObject {
    public constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Font Family',
                name: 'fontFamily',
                type: 'string',
                default: '',
                description: 'The font family of the text.\nThe font family can be any font from the Font menu in Docs or from Google Fonts. If the font name is unrecognized, the text is rendered in Arial.',
                displayOptions: {
                    show: show
                },
            },
            {
                displayName: 'Weight',
                name: 'weight',
                type: 'number',
                default: 400,
                description: 'The weight of the font. This field can have any value that\'s a multiple of 100 between 100 and 900, inclusive.',
                displayOptions: {
                    show: show
                },
            }
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IWeightedFontFamily | undefined {
        const fontFamily = input.getNodeParameter(`${path}.fontFamily`, itemIndex, null) as string | null;
        const weight = input.getNodeParameter(`${path}.weight`, itemIndex, null) as number | null;

        const weightedFontFamily: IWeightedFontFamily = {};
        if (fontFamily !== null) {
            weightedFontFamily.font = weightedFontFamily.font || {};
            weightedFontFamily.font.fontFamily = fontFamily;
        }
        if (weight !== null) {
            weightedFontFamily.font = weightedFontFamily.font || {};
            weightedFontFamily.font.weight = weight;
        }

        if (Object.keys(weightedFontFamily).length === 0) {
            return undefined;
        }

        return weightedFontFamily;
    };
}