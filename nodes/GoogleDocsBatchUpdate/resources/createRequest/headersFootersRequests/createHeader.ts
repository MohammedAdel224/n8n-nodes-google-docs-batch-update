import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { ILocation, Location } from '../../../objects/location';
import { headerFooterType } from '../../../enums/headerFooterType';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestCreateHeader = {
	resource: ['createRequest'],
	operation: ['createHeader'],
};

const location = new Location(showForCreateRequestCreateHeader);

export const createHeaderDescription: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: headerFooterType,
		default: 'DEFAULT',
		description: 'The type of header to create',
		displayOptions: {
			show: showForCreateRequestCreateHeader,
		},
	},
	...location.getDescription(),
];

export const createHeaderRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): ICreateHeaderRequest => {
		const type = input.getNodeParameter('type', itemIndex) as string;
		const sectionBreakLocation = location.getObject(input, itemIndex);

		const request: ICreateHeaderRequest = {
			createHeader: {
				type,
			},
		};

		if (sectionBreakLocation) {
			request.createHeader.sectionBreakLocation = sectionBreakLocation;
		}

		return request;
	},
);

export interface ICreateHeaderRequest extends IBaseGoogleDocsRequest {
	createHeader: {
		type: string;
		sectionBreakLocation?: ILocation;
	};
}

const request: RequestDefinition = {
	name: 'Create Header',
	value: 'createHeader',
	category: 'Headers & Footers',
	description: createHeaderDescription,
	operation: createHeaderRequest,
};

registerRequest(request);
