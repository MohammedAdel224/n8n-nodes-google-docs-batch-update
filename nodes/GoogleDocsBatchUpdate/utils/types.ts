import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { IGoogleDocsRequest } from '../resources/createRequest/IGoogleDocsRequest';

export interface RequestDefinition {
    name: string;
    value: string;
    category: string;
    description: INodeProperties[];
    operation: (input: IExecuteFunctions, itemIndex: number) => IGoogleDocsRequest;
}
