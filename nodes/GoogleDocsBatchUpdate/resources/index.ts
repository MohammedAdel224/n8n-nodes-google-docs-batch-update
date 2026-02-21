import { categoryDescriptions, categoryOperations, categoryMetadata } from './createRequest';
import { sendRequestDescription, sendRequestOperations, sendRequestMetadata, type IApiOperation } from './sendRequest/index';
import type { IOperation } from './createRequest/types';
import type { INodeProperties } from 'n8n-workflow';

const resources: { [key: string]: { [key: string]: IOperation | IApiOperation } } = {};

// Populate resources from category operations
Object.keys(categoryOperations).forEach(resourceKey => {
    resources[resourceKey] = categoryOperations[resourceKey];
});

// Add sendRequest resource
resources['sendRequest'] = sendRequestOperations;

export function getOperation(resource: string, operation: string): IOperation | IApiOperation {
    return resources[resource][operation];
}

// Combine all metadata and descriptions
const allMetadata = [...categoryMetadata, sendRequestMetadata];
const allDescriptions: Record<string, INodeProperties[]> = {
    ...categoryDescriptions,
    sendRequest: sendRequestDescription,
};

// Export combined metadata for use in node description
export { allMetadata as categoryMetadata, allDescriptions as categoryDescriptions };