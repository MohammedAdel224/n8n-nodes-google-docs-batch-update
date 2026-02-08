import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { Dimension, IDimension } from './dimension';

export interface ISectionColumnProperties extends IObject {
	width?: IDimension;
	paddingEnd?: IDimension;
}

export class SectionColumnProperties extends IGoogleDocsObject {
	constructor(show: Record<string, string[]> = {}) {
        const dimension = new Dimension(show);
		const description: INodeProperties[] = [
			{
                ...dimension.getDescription()[0],
				displayName: 'Width',
				name: 'width',
				description: 'Width of the column in points',
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Padding End',
				name: 'paddingEnd',
				description: 'Padding at the end of the column in points',
			},
		];
		super(description);
	}

	public getObject(
		input: IExecuteFunctions,
		itemIndex: number,
		path: string = '',
	): ISectionColumnProperties | undefined {
        const dimension = new Dimension();
        const sectionColumnProperties: ISectionColumnProperties = {};

		const widthPath = path ? `${path}.width` : 'width';
        const width = dimension.getObject(input, itemIndex, widthPath);
        if (width) sectionColumnProperties.width = width;
        
		const paddingEndPath = path ? `${path}.paddingEnd` : 'paddingEnd';
        const paddingEnd = dimension.getObject(input, itemIndex, paddingEndPath);
        if (paddingEnd) sectionColumnProperties.paddingEnd = paddingEnd;

		if (Object.keys(sectionColumnProperties).length === 0) {
			return undefined;
		}

		return sectionColumnProperties;
	}

    public createObject(width: number, paddingEnd: number): ISectionColumnProperties {
        const dimension = new Dimension();
        const widthObj = dimension.createObject(width);
        const paddingEndObj = dimension.createObject(paddingEnd);

        const sectionColumnProperties: ISectionColumnProperties = {};
        if (width) sectionColumnProperties.width = widthObj;
        if (paddingEnd) sectionColumnProperties.paddingEnd = paddingEndObj;

        return sectionColumnProperties;
    }
}
