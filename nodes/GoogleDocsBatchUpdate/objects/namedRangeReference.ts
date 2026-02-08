import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface INamedRangeReference extends IObject {
    namedRangeId?: string;
    name?: string;
}

export class NamedRangeReference extends IGoogleDocsObject {
    constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Named Range',
                name: 'namedRangeReference',
                type: 'resourceLocator',
                default: { mode: 'id', value: '' },
                required: true,
                displayOptions: {
                    show: show,
                },
                modes: [
                    {
                        displayName: 'ID',
                        name: 'id',
                        type: 'string',
                        placeholder: 'kix.xxxxxxxx',
                        hint: 'The ID of the named range.',
                    },
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        placeholder: 'My Range',
                        hint: 'The name of the named range.',
                    },
                ],
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): INamedRangeReference | undefined {
        const propertyName = path || 'namedRangeReference';
        const reference = input.getNodeParameter(propertyName, itemIndex, {}) as { mode: string, value: string };

        const namedRangeReference: INamedRangeReference = {};

        if (reference.mode === 'id') {
            namedRangeReference.namedRangeId = reference.value;
        } else if (reference.mode === 'name') {
            namedRangeReference.name = reference.value;
        }

        if (Object.keys(namedRangeReference).length === 0) {
            return undefined;
        }

        return namedRangeReference;
    }
}
