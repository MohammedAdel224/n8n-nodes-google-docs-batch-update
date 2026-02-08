import { INodePropertyOptions } from "n8n-workflow";

export const imageReplaceMethod: INodePropertyOptions[] = [
    {
        name: 'Center Crop',
        value: 'CENTER_CROP',
        description: 'Scales and centers the image to fill the bounds of the original image',
    },
    {
        name: 'Unspecified',
        value: 'IMAGE_REPLACE_METHOD_UNSPECIFIED',
        description: 'Unspecified image replace method',
    },
];