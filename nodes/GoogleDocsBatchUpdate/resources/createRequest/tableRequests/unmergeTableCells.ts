import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { TableRange, ITableRange } from '../../../objects/tableRange';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestUnmergeTableCells = {
	resource: ['createRequest'],
	operation: ['unmergeTableCells'],
};

const tableRange = new TableRange(showForCreateRequestUnmergeTableCells);

export const unmergeTableCellsDescription: INodeProperties[] = [
	...tableRange.getDescription(),
];

export const createUnmergeTableCellsRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IUnmergeTableCellsRequest => {
		const range = tableRange.getObject(input, itemIndex) as ITableRange;

		return {
			unmergeTableCells: {
				tableRange: range,
			},
		};
	},
);

export interface IUnmergeTableCellsRequest extends IBaseGoogleDocsRequest {
	unmergeTableCells: {
		tableRange: ITableRange;
	};
}

const unmergeTableCellsRequest: RequestDefinition = {
	name: 'Unmerge Table Cells',
	value: 'unmergeTableCells',
	category: 'Tables',
	description: unmergeTableCellsDescription,
	operation: createUnmergeTableCellsRequest,
};

registerRequest(unmergeTableCellsRequest);