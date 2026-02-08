import type { IExecuteFunctions } from 'n8n-workflow';

export function wrapInRequest<T extends (input: IExecuteFunctions, itemIndex: number) => object>(fn: T): T {
    return function(input: IExecuteFunctions, itemIndex: number) {
        const result = fn(input, itemIndex);
        return { request: result }; // Wrap the result in `{ request: { ... } }`
    } as T;
}