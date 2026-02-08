import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface IPersonProperties extends IObject {
	name?: string;
	email?: string;
}

export class PersonProperties extends IGoogleDocsObject {
	constructor(show: Record<string, string[]> = {}) {
		const description: INodeProperties[] = [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the person',
				displayOptions: {
					show: show,
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
                placeholder: 'name@example.com',
				description: 'The email address of the person',
				displayOptions: {
					show: show,
				},
			},
		];
		super(description);
	}

	public getObject(
		input: IExecuteFunctions,
		itemIndex: number,
		path: string = '',
	): IPersonProperties | undefined {
		const namePath = path ? `${path}.name` : 'name';
		const emailPath = path ? `${path}.email` : 'email';

		const name = input.getNodeParameter(namePath, itemIndex, '') as string;
		const email = input.getNodeParameter(emailPath, itemIndex, '') as string;

		const personProperties: IPersonProperties = {};

		if (name) {
			personProperties.name = name;
		}

		if (email) {
			personProperties.email = email;
		}

		if (Object.keys(personProperties).length === 0) {
			return undefined;
		}

		return personProperties;
	}
}
