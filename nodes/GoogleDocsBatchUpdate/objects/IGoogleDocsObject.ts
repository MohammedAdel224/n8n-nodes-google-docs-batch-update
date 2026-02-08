import { IExecuteFunctions, INodeProperties, INodePropertyOptions } from "n8n-workflow";

export abstract class IGoogleDocsObject {
    private description: INodeProperties[];
    public constructor(description: INodeProperties[]) {
        this.description = description;
    }

    public getDescription(): INodeProperties[] {
        return this.description;
    }

    public getDescriptionAsOptions(): INodePropertyOptions[] {
        return this.description.reduce((acc, curr) => {
            acc.push({
                name: curr.displayName,
                value: curr.name,
            });
            return acc;
        }, [] as INodePropertyOptions[])
    }
    public abstract getObject(input: IExecuteFunctions, itemIndex: number, path: string): IObject | undefined;
}

export interface IObject {
    _?: string;
}