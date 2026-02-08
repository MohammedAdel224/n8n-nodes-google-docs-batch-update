import type { ICredentialType, INodeProperties, Icon, ICredentialTestRequest } from 'n8n-workflow';

export class GoogleDocsOAuth2Api implements ICredentialType {
	name = 'googleDocsOAuth2Api';

	extends = ['googleOAuth2Api'];

	displayName = 'Google Docs OAuth2 API';

	icon: Icon = 'file:../icons/googleDocs.svg';

	documentationUrl = 'https://developers.google.com/docs/api/how-tos/authorizing';

	properties: INodeProperties[] = [
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'https://www.googleapis.com/auth/documents',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://docs.googleapis.com/v1',
			url: '/documents',
		},
	};
}
