# n8n-nodes-google-docs-batch-update

This is an n8n community node that lets you perform batch updates on Google Docs documents using the Google Docs API.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Features](#features)  
[Operations](#operations)  
[Credentials](#credentials)  
[Usage](#usage)  
[Examples](#examples)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Manual Installation

1. Navigate to your n8n installation directory
2. Install the package:
   ```bash
   npm install n8n-nodes-google-docs-batch-update
   ```
3. Restart n8n

## Features

- **37 Request Types** across 8 categories for building Google Docs batch update requests
- **Direct API Integration** to send requests to Google Docs
- **Flexible Input** - Accept single requests, arrays, or multiple input items
- **OAuth2 Authentication** with Google
- **Type-Safe** - Built with TypeScript for better development experience

## Operations

This node provides two main modes of operation:

### 1. Create Request Resources

Build individual request objects for Google Docs batch updates. Choose from 8 categories:

#### Bullets
- Create Paragraph Bullets
- Delete Paragraph Bullets

#### Document
- Create Footnote
- Delete Content Range
- Delete Positioned Object
- Insert Page Break
- Insert Person
- Insert Section Break
- Update Document Style
- Update Paragraph Style
- Update Section Style

#### Headers & Footers
- Create Footer
- Create Header
- Delete Footer
- Delete Header

#### Images
- Insert Inline Image
- Replace Image

#### Named Ranges
- Create Named Range
- Delete Named Range
- Replace Named Range Content

#### Tables
- Delete Table Column
- Delete Table Row
- Insert Table
- Insert Table Column
- Insert Table Row
- Merge Table Cells
- Pin Table Header Rows
- Unmerge Table Cells
- Update Table Cell Style
- Update Table Column Properties
- Update Table Row Style

#### Tabs
- Add Document Tab
- Delete Tab
- Update Document Tab Properties

#### Text
- Insert Text
- Replace All Text
- Update Text Style

### 2. Send Request

Send batch update requests directly to Google Docs API:
- **From Input** - Collect requests from previous nodes (supports single request, arrays, or multiple items)
- **Define Below** - Write JSON directly in the node

## Credentials

This node requires Google OAuth2 credentials to send requests via the "Send Request" resource.

### Setting Up Google OAuth2

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Docs API
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Choose **Web application**
   - Add authorized redirect URIs (your n8n OAuth callback URL)
5. Copy the **Client ID** and **Client Secret**
6. In n8n, create a new **Google Docs OAuth2 API** credential
7. Paste your Client ID and Client Secret
8. Connect your Google account

**Required Scope:** `https://www.googleapis.com/auth/documents`

> **Note:** The "Create Request" resources don't require credentials - they only build request objects. Credentials are only needed when using the "Send Request" resource.

## Usage

### Basic Workflow Pattern

The typical workflow structure is:

1. **Build Requests** - Use "Create Request" resources to build individual operations
2. **Collect** - Multiple request nodes feed into a single "Send Request" node
3. **Send** - Use "Send Request" resource to apply all changes at once

### Why Two Modes?

- **Create Request** - Provides a UI-friendly way to build complex request objects with validation and auto-completion
- **Send Request** - Handles API authentication and batch sending. Accepts requests from multiple sources.

This separation allows you to:
- Build multiple updates in parallel
- Combine different operation types
- Review/modify requests before sending
- Reuse request templates

## Examples

### Example 1: Insert Text and Format It

1. **Node 1** - Google Docs Batch Update (Create Text Request)
   - Resource: Create Text Request
   - Operation: Insert Text
   - Text: "Hello World"
   - Location Index: 1

2. **Node 2** - Google Docs Batch Update (Create Text Request)
   - Resource: Create Text Request
   - Operation: Update Text Style
   - Range: Start Index: 1, End Index: 12
   - Bold: true

3. **Node 3** - Google Docs Batch Update (Send Request)
   - Resource: Send Request
   - Operation: Send to Google Docs API
   - Document ID: `your-document-id`
   - Requests Source: From Input

### Example 2: Create a Table with Data

1. **Node 1** - Google Docs Batch Update (Create Tables Request)
   - Operation: Insert Table
   - Rows: 3
   - Columns: 2
   - Location Index: 1

2. **Node 2** - Google Docs Batch Update (Send Request)
   - Document ID: `your-document-id`
   - Requests Source: From Input

### Example 3: Bulk Operations from JSON

1. **Node 1** - Google Docs Batch Update (Send Request)
   - Resource: Send Request
   - Document ID: `your-document-id`
   - Requests Source: Define Below
   - Requests:
   ```json
   [
     {
       "insertText": {
         "text": "Title\n",
         "location": { "index": 1 }
       }
     },
     {
       "updateTextStyle": {
         "range": { "startIndex": 1, "endIndex": 6 },
         "textStyle": { "fontSize": { "magnitude": 24, "unit": "PT" } },
         "fields": "fontSize"
       }
     }
   ]
   ```

## Compatibility

- **Minimum n8n version:** 1.0.0
- **Tested with:** n8n 1.x
- **Node.js:** 18.x or higher

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Google Docs API Reference](https://developers.google.com/docs/api/reference/rest)
- [Google Docs API Batch Update Guide](https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate)
- [Google Cloud Console](https://console.cloud.google.com/)

## License

[MIT](LICENSE.md)

## Author

Mohammed Adel  
[mohammedadellma224@gmail.com](mailto:mohammedadellma224@gmail.com)

---

## Development

For contributors who want to modify or extend this node:

### Building the Node

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

This starts n8n with your node loaded and hot reload enabled.

### Linting

```bash
npm run lint
npm run lint:fix
```

### Project Structure

- `nodes/GoogleDocsBatchUpdate/` - Main node implementation
  - `resources/` - Resource definitions (create requests and send request)
  - `objects/` - Reusable helper objects
  - `enums/` - Type definitions
- `credentials/` - Google OAuth2 credential definition
- `icons/` - Node icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
