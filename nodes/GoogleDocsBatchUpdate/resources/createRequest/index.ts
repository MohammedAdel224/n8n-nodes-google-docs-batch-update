import type { INodeProperties } from 'n8n-workflow';
import './tabRequests/addDocumentTab';
import './headersFootersRequests/createFooter';
import './documentRequests/createFootnote';
import './headersFootersRequests/createHeader';
import './namedRangeRequests/createNamedRange';
import './bulletsRequests/createParagraphBullets';
import './documentRequests/deleteContentRange';
import './headersFootersRequests/deleteFooter';
import './headersFootersRequests/deleteHeader';
import './namedRangeRequests/deleteNamedRange';
import './bulletsRequests/deleteParagraphBullets';
import './documentRequests/deletePositionedObject';
import './tabRequests/deleteTab';
import './tableRequests/deleteTableColumn';
import './tableRequests/deleteTableRow';
import './imageRequests/insertInlineImage';
import './documentRequests/insertPageBreak';
import './documentRequests/insertPerson';
import './documentRequests/insertSectionBreak';
import './tableRequests/insertTable';
import './tableRequests/insertTableColumn';
import './tableRequests/insertTableRow';
import './textRequests/insertText';
import './tableRequests/mergeTableCells';
import './tableRequests/pinTableHeaderRows';
import './textRequests/replaceAllText';
import './imageRequests/replaceImage';
import './namedRangeRequests/replaceNamedRangeContent';
import './tableRequests/unmergeTableCells';
import './documentRequests/updateDocumentStyle';
import './tabRequests/updateDocumentTabProperties';
import './documentRequests/updateParagraphStyle';
import './documentRequests/updateSectionStyle';
import './tableRequests/updateTableCellStyle';
import './tableRequests/updateTableColumnProperties';
import './tableRequests/updateTableRowStyle';
import './textRequests/updateTextStyle';
import { requests } from './registry';
import { IOperation } from '../../utils/iOperation';

// Get unique categories from all requests
const categories = [...new Set(requests.map(req => req.category))].sort();

// Group requests by category
const requestsByCategory = requests.reduce((acc, req) => {
    if (!acc[req.category]) {
        acc[req.category] = [];
    }
    acc[req.category].push(req);
    return acc;
}, {} as Record<string, typeof requests>);

// Create resource key from category name
function getCategoryResourceKey(category: string): string {
    return 'create' + category.replace(/[^a-zA-Z0-9]/g, '') + 'Request';
}

// Export descriptions for each category as separate resources
export const categoryDescriptions: Record<string, INodeProperties[]> = {};
export const categoryOperations: Record<string, { [key: string]: IOperation }> = {};

categories.forEach(category => {
    const resourceKey = getCategoryResourceKey(category);
    const categoryRequests = requestsByCategory[category];
    
    const showForThisResource = {
        resource: [resourceKey],
    };

    // Create description for this category resource
    categoryDescriptions[resourceKey] = [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: showForThisResource,
            },
            options: categoryRequests.map(req => ({
                name: req.name,
                value: req.value,
            })),
            default: ''
        },
        ...categoryRequests.flatMap(req => 
            req.description.map(desc => ({
                ...desc,
                displayOptions: desc.displayOptions ? {
                    ...desc.displayOptions,
                    show: {
                        ...desc.displayOptions.show,
                        resource: [resourceKey],
                    }
                } : {
                    show: showForThisResource,
                }
            }))
        ),
    ];

    // Create operations for this category resource
    categoryOperations[resourceKey] = categoryRequests.reduce((acc, req) => {
        acc[req.value] = req.operation;
        return acc;
    }, {} as { [key: string]: IOperation });
});

// Export category metadata for resource generation
export const categoryMetadata = categories.map(category => ({
    name: `Create ${category} Request`,
    value: getCategoryResourceKey(category),
    category,
}));