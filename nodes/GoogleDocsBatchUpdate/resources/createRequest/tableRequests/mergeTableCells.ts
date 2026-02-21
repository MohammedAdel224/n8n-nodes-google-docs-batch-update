import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../wrapInRequest';
import { TableRange, ITableRange } from '../../../objects/tableRange';
import { RequestDefinition, IBaseGoogleDocsRequest } from '../types';
import { registerRequest } from '../registry';

const showForCreateRequestMergeTableCells = {
	resource: ['createRequest'],
	operation: ['mergeTableCells'],
};

const tableRange = new TableRange(showForCreateRequestMergeTableCells);

export const mergeTableCellsDescription: INodeProperties[] = [
	...tableRange.getDescription(),
];

export const createMergeTableCellsRequest = wrapInRequest(
	(input: IExecuteFunctions, itemIndex: number): IMergeTableCellsRequest => {
		const range = tableRange.getObject(input, itemIndex) as ITableRange;

		return {
			mergeTableCells: {
				tableRange: range,
			},
		};
	},
);

export interface IMergeTableCellsRequest extends IBaseGoogleDocsRequest {
	mergeTableCells: {
		tableRange: ITableRange;
	};
}

const mergeTableCellsRequest: RequestDefinition = {
	name: 'Merge Table Cells',
	value: 'mergeTableCells',
	category: 'Tables',
	description: mergeTableCellsDescription,
	operation: createMergeTableCellsRequest,
};

registerRequest(mergeTableCellsRequest);
