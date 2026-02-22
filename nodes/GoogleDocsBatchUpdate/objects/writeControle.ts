import { IGoogleDocsObject, IObject } from './IGoogleDocsObject';
import type { INodeProperties, IExecuteFunctions } from 'n8n-workflow';

export interface IWriteControl extends IObject {
    requiredRevisionId?: string;
    targetRevisionId?: string;
}

export class WriteControl extends IGoogleDocsObject {
    constructor(show: Record<string, string[]> = {}) {
        const description: INodeProperties[] = [
            {
                displayName: 'Write Control',
                name: 'writeControl',
                type: 'resourceLocator',
                default: { mode: 'targetRevisionId', value: '' },
                displayOptions: {
                    show: show,
                },
                modes: [
                    {
                        displayName: 'Target',
                        name: 'targetRevisionId',
                        type: 'string',
                        placeholder: 'Revision ID',
                        hint: 'The target revision ID of the document that the write request is applied to.',
                    },
                    {
                        displayName: 'Required',
                        name: 'requiredRevisionId',
                        type: 'string',
                        placeholder: 'Revision ID',
                        hint: 'The revision ID of the document that the write request must be applied to.',
                    },
                ],
            },
        ];
        super(description);
    }

    public getObject(input: IExecuteFunctions, itemIndex: number, path: string = ''): IWriteControl | undefined {
        const propertyPath = path ? `${path}.writeControl` : 'writeControl';
        const control = input.getNodeParameter(propertyPath, itemIndex, {}) as { mode?: string; value?: string };

        const writeControl: IWriteControl = {};

        if (control.mode === 'targetRevisionId' && control.value) {
            writeControl.targetRevisionId = control.value;
        } else if (control.mode === 'requiredRevisionId' && control.value) {
            writeControl.requiredRevisionId = control.value;
        }

        if (Object.keys(writeControl).length === 0) {
            return undefined;
        }

        return writeControl;
    }
}
