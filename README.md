# n8n-nodes-google-docs-batch-update

An n8n community node that helps you **build** and **send** Google Docs API `documents.batchUpdate` requests (without hand-writing every JSON payload).

Use it when you need advanced Google Docs edits like **text styling, tables, tabs, headers/footers, named ranges, bullets, and document/section/paragraph styles**.

---

## Requirements

- n8n `1.x`
- Node.js `18+`
- A Google account that can edit the target document

---

## Install

This package is published to npm as `n8n-nodes-google-docs-batch-update`.

Important: Installing community nodes from npm is only available on **self-hosted n8n**. Unverified community nodes aren't available on n8n Cloud.

### Option A — Install from the n8n UI (recommended)

1. In n8n, go to **Settings → Community Nodes**
2. Select **Install**
3. Enter the npm package name:

    `n8n-nodes-google-docs-batch-update`

4. Accept the risk prompt and install
5. Restart n8n if prompted

Official n8n docs: https://docs.n8n.io/integrations/community-nodes/installation/gui-install/

### Option B — Manual install (Docker / restricted installs)

1. Open a shell in your n8n container

    `docker exec -it n8n sh`

2. Install the node package into the custom nodes folder:

    `mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes`

    `npm i n8n-nodes-google-docs-batch-update`

3. Restart n8n

Official n8n docs: https://docs.n8n.io/integrations/community-nodes/installation/manual-install/

---

## Credentials (Google Docs OAuth2)

This node includes a credential type named **Google Docs OAuth2 API** (internally it extends n8n's Google OAuth2).

- Required OAuth scope:
   - `https://www.googleapis.com/auth/documents`

High-level setup:

1. In Google Cloud Console:
    - Enable the **Google Docs API**
    - Create OAuth client credentials
2. In n8n:
    - Create credentials: **Google Docs OAuth2 API**
    - Paste your OAuth client ID/secret and complete the OAuth flow

Note: Credentials are only required when using **Send Request**. All **Create … Request** operations only build JSON.

---

## What’s included

### Node

- **Google Docs Batch Update**

### Resources (in the node UI)

- **Create … Request** resources (request builders)
- **Send Request** resource (calls Google Docs API `documents.batchUpdate`)

### Create Request operations

The node provides **37** request builders across these categories:

<details>
<summary><strong>Bullets</strong> (2)</summary>

- Create Paragraph Bullets (`createParagraphBullets`)
- Delete Paragraph Bullets (`deleteParagraphBullets`)

</details>

<details>
<summary><strong>Document</strong> (9)</summary>

- Create Footnote (`createFootnote`)
- Delete Content Range (`deleteContentRange`)
- Delete Positioned Object (`deletePositionedObject`)
- Insert Page Break (`insertPageBreak`)
- Insert Person (`insertPerson`)
- Insert Section Break (`insertSectionBreak`)
- Update Document Style (`updateDocumentStyle`)
- Update Paragraph Style (`updateParagraphStyle`)
- Update Section Style (`updateSectionStyle`)

</details>

<details>
<summary><strong>Headers & Footers</strong> (4)</summary>

- Create Footer (`createFooter`)
- Create Header (`createHeader`)
- Delete Footer (`deleteFooter`)
- Delete Header (`deleteHeader`)

</details>

<details>
<summary><strong>Images</strong> (2)</summary>

- Insert Inline Image (`insertInlineImage`)
- Replace Image (`replaceImage`)

</details>

<details>
<summary><strong>Named Ranges</strong> (3)</summary>

- Create Named Range (`createNamedRange`)
- Delete Named Range (`deleteNamedRange`)
- Replace Named Range Content (`replaceNamedRangeContent`)

</details>

<details>
<summary><strong>Tables</strong> (11)</summary>

- Delete Table Column (`deleteTableColumn`)
- Delete Table Row (`deleteTableRow`)
- Insert Table (`insertTable`)
- Insert Table Column (`insertTableColumn`)
- Insert Table Row (`insertTableRow`)
- Merge Table Cells (`mergeTableCells`)
- Pin Table Header Rows (`pinTableHeaderRows`)
- Unmerge Table Cells (`unmergeTableCells`)
- Update Table Cell Style (`updateTableCellStyle`)
- Update Table Column Properties (`updateTableColumnProperties`)
- Update Table Row Style (`updateTableRowStyle`)

</details>

<details>
<summary><strong>Tabs</strong> (3)</summary>

- Add Document Tab (`addDocumentTab`)
- Delete Tab (`deleteTab`)
- Update Document Tab Properties (`updateDocumentTabProperties`)

</details>

<details>
<summary><strong>Text</strong> (3)</summary>

- Insert Text (`insertText`)
- Replace All Text (`replaceAllText`)
- Update Text Style (`updateTextStyle`)

</details>

---

## How to use

### 1) Get the Document ID

The Document ID is part of the Google Docs URL:

`https://docs.google.com/document/d/<DOCUMENT_ID>/edit`

### 2) Choose how to build requests

You have two ways:

#### Option A — Build requests with “Create … Request” (no JSON)

Each Create Request operation outputs an item shaped like:

```json
{
   "request": {
      "insertText": {
         "text": "Hello",
         "location": { "index": 1 }
      }
   }
}
```

Then use **Send Request → Requests Source = From Input**.

Tip: If you want to build multiple requests and send them together, you typically create multiple items (for example by using multiple Create Request nodes and combining them with **Merge**), then Send Request will collect all incoming items and send a single batch.

#### Option B — Paste raw JSON (“Define Below”)

Use **Send Request → Requests Source = Define Below** and paste an array of Google Docs API request objects.

Minimal example:

```json
[
   {
      "insertText": {
         "location": { "index": 1 },
         "text": "Hello from n8n\n"
      }
   },
   {
      "updateTextStyle": {
         "range": { "startIndex": 1, "endIndex": 15 },
         "textStyle": { "bold": true },
         "fields": "bold"
      }
   }
]
```

### 3) Send the batch update

1. Add **Google Docs Batch Update** node
2. Select **Resource → Send Request**
3. Set **Document ID**
4. Choose **Requests Source** (`From Input` or `Define Below`)
5. Execute the workflow

Note: **Send Request executes once per workflow execution** and sends a single `documents.batchUpdate` call.

---

## Troubleshooting

- `403` / permission errors: the connected Google account must have edit access to the document
- Invalid request body: verify indices/ranges are correct for the current document state
- “No valid requests found…” when using `From Input`:
   - Ensure upstream nodes output request objects, arrays of request objects, or `{ "request": { ... } }`

---

## Development

```bash
npm run build
npm run dev
npm run lint
npm run lint:fix
```

---

## References

- n8n community nodes: https://docs.n8n.io/integrations/community-nodes/
- Install & manage community nodes: https://docs.n8n.io/integrations/community-nodes/installation/
- Google Docs API (REST): https://developers.google.com/docs/api/reference/rest
- `documents.batchUpdate`: https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate

---

## License

MIT — see [LICENSE.md](LICENSE.md)
