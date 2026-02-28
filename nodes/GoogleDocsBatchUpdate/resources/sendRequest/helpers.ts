import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export const unwrap = (obj: unknown): IDataObject | null => {
	if (typeof obj !== 'object' || obj === null) return null;
	const asDataObject = obj as IDataObject;
	if (asDataObject.request && typeof asDataObject.request === 'object' && asDataObject.request !== null) {
		return asDataObject.request as IDataObject;
	}
	return asDataObject;
};

export const collectRequestsFromItems = (inputItems: Array<{ json: unknown }>) => {
	const collected: IDataObject[] = [];
	const asRecord = (value: unknown): Record<string, unknown> | null =>
		typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
	for (const item of inputItems) {
		const inputData = item.json as unknown;

		if (Array.isArray(inputData)) {
			for (const element of inputData) {
				const unwrapped = unwrap(element);
				if (unwrapped) collected.push(unwrapped);
			}
		} else if (asRecord(inputData)?.requests && Array.isArray(asRecord(inputData)?.requests)) {
			const requestsValue = asRecord(inputData)!.requests as unknown[];
			for (const element of requestsValue) {
				const unwrapped = unwrap(element);
				if (unwrapped) collected.push(unwrapped);
			}
		} else if (
			asRecord(inputData)?.request &&
			typeof asRecord(inputData)?.request === 'object' &&
			asRecord(inputData)?.request !== null
		) {
			collected.push(asRecord(inputData)!.request as IDataObject);
		} else if (typeof inputData === 'object' && inputData !== null) {
			const unwrapped = unwrap(inputData);
			if (unwrapped) collected.push(unwrapped);
		}
	}

	return collected;
};

export const parseRequestsFromDefine = (context: IExecuteFunctions, idx: number): IDataObject[] => {
	const requestsParam = context.getNodeParameter('requests', idx);

	if (typeof requestsParam === 'object' && requestsParam !== null) {
		return Array.isArray(requestsParam)
			? (requestsParam as IDataObject[])
			: [requestsParam as IDataObject];
	}
	if (typeof requestsParam === 'string') {
		try {
			const parsedRequests = JSON.parse(requestsParam);
			return Array.isArray(parsedRequests)
				? (parsedRequests as IDataObject[])
				: [parsedRequests as IDataObject];
		} catch (error) {
			throw new NodeOperationError(
				context.getNode(),
				`Invalid JSON in requests field: ${(error as Error).message}`,
				{ itemIndex: idx },
			);
		}
	}
	throw new NodeOperationError(
		context.getNode(),
		'Requests parameter must be a JSON string, object, or array',
		{ itemIndex: idx },
	);
};

export const collectRequestsFromDefineIndexes = (
	context: IExecuteFunctions,
	indexes: number[],
): IDataObject[] => {
	const collected: IDataObject[] = [];
	for (const idx of indexes) {
		const parsed = parseRequestsFromDefine(context, idx);
		for (const req of parsed) {
			collected.push(req);
		}
	}
	return collected;
};

export const collectRequestsForIndexes = (
	context: IExecuteFunctions,
	items: Array<{ json: unknown }>,
	indexes: number[],
	itemIndex: number,
) => {
	const scopedItems = indexes
		.map((i) => items[i])
		.filter((item): item is { json: unknown } => !!item);

	const collected = collectRequestsFromItems(scopedItems);
	if (collected.length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			'No valid requests found in input data. Input must contain request object(s), arrays of request objects, or {request:{...}} items from Create Request builders.',
			{ itemIndex: indexes[0] ?? itemIndex },
		);
	}
	return collected;
};
