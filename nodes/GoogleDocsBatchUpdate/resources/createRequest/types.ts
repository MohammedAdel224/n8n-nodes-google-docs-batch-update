import { IAddDocumentTabRequest } from './tabRequests/addDocumentTab';
import { ICreateFooterRequest } from './headersFootersRequests/createFooter';
import { ICreateFootnoteRequest } from './documentRequests/createFootnote';
import { ICreateHeaderRequest } from './headersFootersRequests/createHeader';
import { ICreateNamedRangeRequest } from './namedRangeRequests/createNamedRange';
import { ICreateParagraphBulletsRequest } from './bulletsRequests/createParagraphBullets';
import { IDeleteContentRangeRequest } from './documentRequests/deleteContentRange';
import { IDeleteFooterRequest } from './headersFootersRequests/deleteFooter';
import { IDeleteHeaderRequest } from './headersFootersRequests/deleteHeader';
import { IDeleteNamedRangeRequest } from './namedRangeRequests/deleteNamedRange';
import { IDeleteParagraphBulletsRequest } from './bulletsRequests/deleteParagraphBullets';
import { IDeletePositionedObjectRequest } from './documentRequests/deletePositionedObject';
import { IDeleteTabRequest } from './tabRequests/deleteTab';
import { IDeleteTableColumnRequest } from './tableRequests/deleteTableColumn';
import { IDeleteTableRowRequest } from './tableRequests/deleteTableRow';
import { IInsertInlineImageRequest } from './imageRequests/insertInlineImage';
import { IInsertPageBreakRequest } from './documentRequests/insertPageBreak';
import { IInsertPersonRequest } from './documentRequests/insertPerson';
import { IInsertSectionBreakRequest } from './documentRequests/insertSectionBreak';
import { IInsertTableColumnRequest } from './tableRequests/insertTableColumn';
import { IInsertTableRequest } from './tableRequests/insertTable';
import { IInsertTableRowRequest } from './tableRequests/insertTableRow';
import { IInsertTextRequest } from './textRequests/insertText';
import { IMergeTableCellsRequest } from './tableRequests/mergeTableCells';
import { IPinTableHeaderRowsRequest } from './tableRequests/pinTableHeaderRows';
import { IReplaceAllTextRequest } from './textRequests/replaceAllText';
import { IReplaceNamedRangeContentRequest } from './namedRangeRequests/replaceNamedRangeContent';
import { IUnmergeTableCellsRequest } from './tableRequests/unmergeTableCells';
import { IUpdateDocumentStyleRequest } from './documentRequests/updateDocumentStyle';
import { IUpdateDocumentTabPropertiesRequest } from './tabRequests/updateDocumentTabProperties';
import { IUpdateParagraphStyleRequest } from './documentRequests/updateParagraphStyle';
import { IUpdateSectionStyleRequest } from './documentRequests/updateSectionStyle';
import { IUpdateTableCellStyleRequest } from './tableRequests/updateTableCellStyle';
import { IUpdateTableColumnPropertiesRequest } from './tableRequests/updateTableColumnProperties';
import { IUpdateTableRowStyleRequest } from './tableRequests/updateTableRowStyle';
import { IUpdateTextStyleRequest } from './textRequests/updateTextStyle';
import { IReplaceImageRequest } from './imageRequests/replaceImage';
import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

export interface IBaseGoogleDocsRequest {
    _?: string;
}

export type IGoogleDocsRequest = 
    IAddDocumentTabRequest | 
    ICreateFooterRequest | 
    ICreateFootnoteRequest | 
    ICreateHeaderRequest | 
    ICreateNamedRangeRequest | 
    ICreateParagraphBulletsRequest | 
    IDeleteContentRangeRequest | 
    IDeleteFooterRequest | 
    IDeleteHeaderRequest | 
    IDeleteNamedRangeRequest | 
    IDeleteParagraphBulletsRequest | 
    IDeletePositionedObjectRequest | 
    IDeleteTabRequest | 
    IDeleteTableColumnRequest | 
    IDeleteTableRowRequest | 
    IInsertInlineImageRequest | 
    IInsertPageBreakRequest | 
    IInsertPersonRequest | 
    IInsertSectionBreakRequest | 
    IInsertTableColumnRequest | 
    IInsertTableRequest | 
    IInsertTableRowRequest | 
    IInsertTextRequest | 
    IMergeTableCellsRequest | 
    IPinTableHeaderRowsRequest | 
    IReplaceAllTextRequest | 
    IReplaceImageRequest |
    IReplaceNamedRangeContentRequest | 
    IUnmergeTableCellsRequest | 
    IUpdateDocumentStyleRequest | 
    IUpdateDocumentTabPropertiesRequest | 
    IUpdateParagraphStyleRequest | 
    IUpdateSectionStyleRequest | 
    IUpdateTableCellStyleRequest | 
    IUpdateTableColumnPropertiesRequest | 
    IUpdateTableRowStyleRequest | 
    IUpdateTextStyleRequest;

export type IOperation = (input: IExecuteFunctions, itemIndex: number) => IBaseGoogleDocsRequest;

export interface RequestDefinition {
    name: string;
    value: string;
    category: string;
    description: INodeProperties[];
    operation: (input: IExecuteFunctions, itemIndex: number) => IGoogleDocsRequest;
}