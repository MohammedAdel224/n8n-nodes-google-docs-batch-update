import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { SectionColumnProperties, ISectionColumnProperties } from './sectionColumnProperties';
import { Dimension, IDimension } from './dimension';
import { columnSeparatorStyle } from '../enums/columnSeparatorStyle';
import { sectionType } from '../enums/sectionType';
import { contentDirection } from '../enums/contentDirection';

export interface ISectionStyle extends IObject {
	columnSeparatorStyle?: string;
	contentDirection?: string;
	sectionType?: string;
	defaultHeaderId?: string;
	defaultFooterId?: string;
	evenPageHeaderId?: string;
	evenPageFooterId?: string;
	firstPageHeaderId?: string;
	firstPageFooterId?: string;
	useFirstPageHeaderFooter?: boolean;
	marginTop?: IDimension;
	marginBottom?: IDimension;
	marginRight?: IDimension;
	marginLeft?: IDimension;
	marginHeader?: IDimension;
	marginFooter?: IDimension;
	columnProperties?: ISectionColumnProperties[];
}

export class SectionStyle extends IGoogleDocsObject {
	constructor(show: Record<string, string[]> = {}) {
		const dimension = new Dimension(show);
		const sectionColumnProperties = new SectionColumnProperties(show);

		const description: INodeProperties[] = [
			{
				displayName: 'Column Separator Style',
				name: 'columnSeparatorStyle',
				type: 'options',
				options: columnSeparatorStyle,
				default: 'NONE',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Content Direction',
				name: 'contentDirection',
				type: 'options',
				options: contentDirection,
				default: 'LEFT_TO_RIGHT',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Section Type',
				name: 'sectionType',
				type: 'options',
				options: sectionType,
				default: 'CONTINUOUS',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Default Header ID',
				name: 'defaultHeaderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Default Footer ID',
				name: 'defaultFooterId',
				type: 'string',
				default: '',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Even Page Header ID',
				name: 'evenPageHeaderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Even Page Footer ID',
				name: 'evenPageFooterId',
				type: 'string',
				default: '',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'First Page Header ID',
				name: 'firstPageHeaderId',
				type: 'string',
				default: '',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'First Page Footer ID',
				name: 'firstPageFooterId',
				type: 'string',
				default: '',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Use First Page Header Footer',
				name: 'useFirstPageHeaderFooter',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: show,
				},
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Margin Top',
				name: 'marginTop',
				description: 'Top margin in points',
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Margin Bottom',
				name: 'marginBottom',
				description: 'Bottom margin in points',
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Margin Right',
				name: 'marginRight',
				description: 'Right margin in points',
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Margin Left',
				name: 'marginLeft',
				description: 'Left margin in points',
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Margin Header',
				name: 'marginHeader',
				description: 'Header margin in points',
			},
			{
                ...dimension.getDescription()[0],
				displayName: 'Margin Footer',
				name: 'marginFooter',
				description: 'Footer margin in points',
			},
			{
				displayName: 'Column Properties',
				name: 'columnProperties',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Column Properties',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: show,
				},
				options: [
					{
						displayName: 'Property',
						name: 'property',
						values: sectionColumnProperties.getDescription(),
					},
				],
			},
		];
		super(description);
	}

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): ISectionStyle | undefined {
        const style = input.getNodeParameter(path, itemIndex, {}) as IInput;
		const getPath = (field: string) => (path ? `${path}.${field}` : field);

		const sectionStyle: ISectionStyle = {};

        const assignStringParameter = (paramName: string, targetProp: string) => {
            const paramValue = input.getNodeParameter(getPath(paramName), itemIndex, '') as string;
            if (paramValue) {
                // @ts-expect-error - targetProp is a dynamic key of style
                sectionStyle[targetProp] = paramValue;
            }
        };

        assignStringParameter('columnSeparatorStyle', 'columnSeparatorStyle');
        assignStringParameter('contentDirection', 'contentDirection');
        assignStringParameter('sectionType', 'sectionType');
        assignStringParameter('defaultHeaderId', 'defaultHeaderId');
        assignStringParameter('defaultFooterId', 'defaultFooterId');
        assignStringParameter('evenPageHeaderId', 'evenPageHeaderId');
        assignStringParameter('evenPageFooterId', 'evenPageFooterId');
        assignStringParameter('firstPageHeaderId', 'firstPageHeaderId');
        assignStringParameter('firstPageFooterId', 'firstPageFooterId');

		if (style.useFirstPageHeaderFooter !== undefined) sectionStyle.useFirstPageHeaderFooter = style.useFirstPageHeaderFooter;

        const dimension = new Dimension();
        const assignDimension = (paramName: string, targetProp: string) => {
            const dimObj = dimension.getObject(input, itemIndex, `${path}.${paramName}`);
            if (dimObj) {
                // @ts-expect-error - targetProp is a dynamic key of style
                sectionStyle[targetProp] = dimObj;
            }
        };

        assignDimension('marginTop', 'marginTop');
        assignDimension('marginBottom', 'marginBottom');
        assignDimension('marginRight', 'marginRight');
        assignDimension('marginLeft', 'marginLeft');
        assignDimension('marginHeader', 'marginHeader');
        assignDimension('marginFooter', 'marginFooter');

        const sectionColumnProperties = new SectionColumnProperties();
		const columnPropertiesData = input.getNodeParameter(
			getPath('columnProperties'),
			itemIndex,
			[],
		) as { property: { width: number; paddingEnd: number }[] };
        if (columnPropertiesData && columnPropertiesData.property && columnPropertiesData.property.length > 0) {
            sectionStyle.columnProperties = columnPropertiesData.property.map((prop) => sectionColumnProperties.createObject(prop.width, prop.paddingEnd)) as ISectionColumnProperties[];
        }

		if (Object.keys(sectionStyle).length === 0) {
			return undefined;
		}

		return sectionStyle;
	}
}

interface IInput {
    useFirstPageHeaderFooter?: boolean;
}