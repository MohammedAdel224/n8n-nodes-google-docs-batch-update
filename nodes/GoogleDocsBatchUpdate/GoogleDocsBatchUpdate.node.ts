import type {
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { categoryMetadata, categoryDescriptions, getOperation } from './resources';
import type { IOperation } from './utils/iOperation';

export class GoogleDocsBatchUpdate implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Google Docs Batch Update',
        name: 'googleDocsBatchUpdate',
        icon: 'file:../../icons/googleDocs.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Build and send Google Docs batch update requests',
        defaults: {
            name: 'Google Docs Batch Update',
        },
        usableAsTool: true,
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'googleDocsOAuth2Api',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['sendRequest'],
                    },
                },
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                default: '',
                noDataExpression: true,
                options: categoryMetadata.map(cat => ({
                    name: cat.name,
                    value: cat.value,
                })),
            },
            ...Object.values(categoryDescriptions).flat(),
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const outputs: INodeExecutionData[] = [];

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                const resource = this.getNodeParameter('resource', itemIndex) as string;
                const operation = this.getNodeParameter('operation', itemIndex) as string;

                const method = getOperation(resource, operation);
                
                // Check if this is an API operation or a request builder
                let result: IDataObject;
                if ('_isApiOperation' in method && method._isApiOperation) {
                    const runForEachInput = this.getNodeParameter('runForEachInput', itemIndex, false) as boolean;

                    if (!runForEachInput && itemIndex > 0) {
                        continue;
                    }

                    result = await method.execute(this, itemIndex);
                } else {
                    // This is a request builder - call it as a function
                    const requestResult = (method as IOperation)(this, itemIndex);
                    result = requestResult as unknown as IDataObject;
                }

                outputs.push({
                    json: result,
                    pairedItem: itemIndex,
                });
            } catch (error) {
                if (this.continueOnFail()) {
                    outputs.push({
                        json: {
                            error: (error as Error).message,
                        },
                        pairedItem: itemIndex,
                    });
                    continue;
                }
                
                if ((error as NodeOperationError).context) {
                    (error as NodeOperationError).context.itemIndex = itemIndex;
                    throw error;
                }
                throw new NodeOperationError(this.getNode(), error as Error, {
                    itemIndex,
                });
            }
        }

        return [outputs];
    }
}