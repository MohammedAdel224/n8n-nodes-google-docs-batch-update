import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { ILocation, Location } from '../../../objects/location';
import { headerFooterType } from '../../../enums/headerFooterType';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestCreateFooter = {
	resource: ['createRequest'],
	operation: ['createFooter'],
};

const location = new Location(showForCreateRequestCreateFooter);

export const createFooterDescription: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: headerFooterType,
		default: 'DEFAULT',
		description: 'The type of footer to create',
		displayOptions: {
			show: showForCreateRequestCreateFooter,
		},
	},
	...location.getDescription(),
];

export const createFooterRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): ICreateFooterRequest => {
		const type = input.getNodeParameter('type', itemIndex) as string;
		const sectionBreakLocation = location.getObject(input, itemIndex);

		const request: ICreateFooterRequest = {
			createFooter: {
				type,
			},
		};

		if (sectionBreakLocation) {
			request.createFooter.sectionBreakLocation = sectionBreakLocation;
		}

		return request;
	},
);

export interface ICreateFooterRequest extends IBaseGoogleDocsRequest {
	createFooter: {
		type: string;
		sectionBreakLocation?: ILocation;
	};
}

const request: RequestDefinition = {
	name: 'Create Footer',
	value: 'createFooter',
	category: 'Headers & Footers',
	description: createFooterDescription,
	operation: createFooterRequest,
};

registerRequest(request);
