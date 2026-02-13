# n8n-nodes-google-docs-batch-update

Community node for n8n to build and send Google Docs `documents.batchUpdate` requests.

## What this node does

- Builds Google Docs request objects with form-based fields (no hand-writing full JSON for every operation)
- Supports many request types (text, tables, images, named ranges, bullets, headers/footers, section/document style, tabs)
- Sends one or more requests to Google Docs in a single batch update call
- Accepts requests from previous items (`From Input`) or pasted JSON (`Define Below`)

## Installation

Use n8n Community Nodes or install manually:

```bash
npm install n8n-nodes-google-docs-batch-update
```

Then restart n8n.

Official n8n guide: https://docs.n8n.io/integrations/community-nodes/installation/

## Requirements

- n8n `1.x`
- Node.js `18+`
- Google account with access to the target Google Docs files

## Credentials

The node includes `Google Docs OAuth2 API` credentials.

1. Open Google Cloud Console: https://console.cloud.google.com/
2. Enable **Google Docs API**
3. Create OAuth client credentials
4. In n8n, create **Google Docs OAuth2 API** credentials and connect your account

Required scope:

- `https://www.googleapis.com/auth/documents`

Note: Create-request resources only build JSON objects; credentials are only required when using **Send Request**.

## Quick usage pattern

1. Add one or more **Create Request** nodes to build operations
2. Connect them to a **Send Request** node
3. Set `Document ID`
4. Set `Requests Source`:
    - `From Input` to collect requests from upstream nodes
    - `Define Below` to provide raw JSON array

## Minimal example (Define Below)

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

## Common issues

- `403` / permission errors: confirm the connected Google account can edit the document
- Invalid request body: verify indexes/ranges are valid for the current document state
- Empty input in `From Input`: ensure upstream nodes output request objects/arrays

## Development

```bash
npm run build
npm run dev
npm run lint
npm run lint:fix
```

## Resources

- n8n community nodes docs: https://docs.n8n.io/integrations/community-nodes/
- Google Docs API reference: https://developers.google.com/docs/api/reference/rest
- `documents.batchUpdate`: https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate

## Contributing

Pull requests are welcome.

## License

MIT — see [LICENSE.md](LICENSE.md)
