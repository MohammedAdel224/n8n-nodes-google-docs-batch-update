import type { IExecuteFunctions } from 'n8n-workflow';
import { IGoogleDocsRequest } from '../resources/createRequest/IGoogleDocsRequest';

export type IOperation = (input: IExecuteFunctions, itemIndex: number) => IGoogleDocsRequest;
