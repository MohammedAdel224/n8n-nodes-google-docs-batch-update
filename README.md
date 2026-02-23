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

This package is published to npm as [`n8n-nodes-google-docs-batch-update`](https://www.npmjs.com/package/n8n-nodes-google-docs-batch-update).

Important: Installing community nodes from npm is only available on **self-hosted n8n**. Unverified community nodes aren't available on n8n Cloud.

### Option A — Install from the n8n UI (recommended)

1. In n8n, go to **Settings → Community Nodes**
2. Select **Install**
3. Enter the npm package name:

    `n8n-nodes-google-docs-batch-update`

4. Accept the risk prompt and install
5. Restart n8n if prompted

Official n8n docs: [GUI installation](https://docs.n8n.io/integrations/community-nodes/installation/gui-install/)

### Option B — Manual install (Docker / restricted installs)

1. Open a shell in your n8n container

    `docker exec -it n8n sh`

2. Install the node package into the custom nodes folder:

    `mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes`

    `npm i n8n-nodes-google-docs-batch-update`

3. Restart n8n

Official n8n docs: [Manual installation](https://docs.n8n.io/integrations/community-nodes/installation/manual-install/)

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

Note: If an input item contains an array of request objects (or `{ "requests": [ ... ] }`), they are included in the same `documents.batchUpdate` HTTP request (one call per execution, or per item if **Run For Each Input Item** is enabled).

Tip: If you want to build multiple requests and send them together, you typically create multiple items (for example by using multiple Create Request nodes and combining them with **Merge**), then Send Request will collect all incoming items and send a single batch.

Important: If you build requests across multiple branches and want to send them all in a single call (and in a specific order), merge them first using a **Merge** node in **Append** mode, then connect the merged output to **Send Request**.

#### Option B — Paste raw JSON (“Define Below”)

Use **Send Request → Requests Source = Define Below** and paste an array of Google Docs API request objects.

Note: The array is sent as a single Google Docs API `documents.batchUpdate` HTTP request (one call per execution, or per item if **Run For Each Input Item** is enabled).

If you run **Send Request** with multiple input items while using `Define Below`, aggregate mode (`Run For Each Input Item = false`) concatenates the requests from all items for the same Document ID (in item order) and sends one `batchUpdate` call per document.

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
5. Choose **Run For Each Input Item**:
   - `false` (default): one API call with requests collected from all input items in order
   - `true`: one API call per input item
6. Execute the workflow

Notes:
- In aggregate mode (`Run For Each Input Item = false`), requests are sent in the same order they are received from input items.
- In per-item mode (`Run For Each Input Item = true`), each input item is sent independently, preserving request order inside that item.
- If **Document ID** is set dynamically from item data and differs between input items, aggregate mode sends **one `documents.batchUpdate` call per Document ID** (still preserving item order within each document).
- When multiple Document IDs are used in aggregate mode, the node returns an object with `documentResponses` (one entry per document).
- If multiple branches connect directly to **Send Request**, n8n does not guarantee branch synchronization or ordering. Use **Merge (Append)** to combine branches deterministically.

Write control (optional):
- **Options → Write Control** lets you set Google Docs API `writeControl` to help avoid writing to the wrong document revision.
   - **Target revision ID**: applies the write against a specific target revision.
   - **Required revision ID**: the write must be applied to this revision (otherwise the API rejects it).
- In aggregate mode, one request is sent per Document ID, so **Write Control is taken from the first item for that document**.

Behavior summary:
- n8n does not automatically “wait for all branches”. If multiple branches connect to **Send Request**, each branch run is handled independently.
- `Run For Each Input Item = false`: sends one `documents.batchUpdate` call per Document ID (requests are appended in input item order).
- `Run For Each Input Item = true`: sends one `documents.batchUpdate` call per input item.

Example (dynamic Document ID):
- 3 input items with Document IDs: `docA`, `docB`, `docA`
- Aggregate mode sends 2 HTTP calls: one for `docA` (items 1 and 3 combined, in order) and one for `docB` (item 2)

---

## Troubleshooting

- `403` / permission errors: the connected Google account must have edit access to the document
- Invalid request body: verify indices/ranges are correct for the current document state
- Index/range errors (for example, `updateTextStyle` range is out of bounds): ensure the request that creates the content (like `insertText`) is in the same batch and comes before style updates; use **Merge (Append)** to enforce ordering
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

- [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Install & manage community nodes](https://docs.n8n.io/integrations/community-nodes/installation/)
- [Google Docs API (REST)](https://developers.google.com/docs/api/reference/rest)
- [`documents.batchUpdate`](https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate)

---

## License

MIT — see [LICENSE.md](LICENSE.md)
