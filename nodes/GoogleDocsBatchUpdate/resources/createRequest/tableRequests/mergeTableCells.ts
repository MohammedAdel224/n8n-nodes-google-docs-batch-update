import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { wrapInRequest } from '../../../utils/wrapInRequest';
import { TableRange, ITableRange } from '../../../objects/tableRange';
import { RequestDefinition } from '../../../utils/types';
import { registerRequest } from '../registry';
import { IGoogleDocsRequest } from '../IGoogleDocsRequest';

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

interface IMergeTableCellsRequest extends IGoogleDocsRequest {
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
