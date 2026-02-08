import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { InsertionLocation, IInsertionLocation } from '../../../objects/insertionLocation';
import { PersonProperties, IPersonProperties } from '../../../objects/personProperties';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

const showForCreateRequestInsertPerson = {
	resource: ['createRequest'],
	operation: ['insertPerson'],
};

const insertionLocation = new InsertionLocation(showForCreateRequestInsertPerson);
const personProperties = new PersonProperties(showForCreateRequestInsertPerson);

export const insertPersonDescription: INodeProperties[] = [
	...personProperties.getDescription(),
	...insertionLocation.getDescription(),
];

export const createInsertPersonRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IInsertPersonRequest => {
		const location = insertionLocation.getObject(input, itemIndex);
		const properties = personProperties.getObject(input, itemIndex);

		return {
			insertPerson: {
				personProperties: properties,
				...location,
			},
		};
	},
);

interface IInsertPersonRequest extends IGoogleDocsRequest {
	insertPerson: {
		personProperties?: IPersonProperties;
	} & IInsertionLocation;
}

const insertPersonRequest: RequestDefinition = {
	name: 'Insert Person',
	value: 'insertPerson',
	category: 'Document',
	description: insertPersonDescription,
	operation: createInsertPersonRequest,
};

registerRequest(insertPersonRequest);
