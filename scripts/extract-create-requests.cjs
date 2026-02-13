const fs = require('fs');
const path = require('path');

const root = path.join(
	process.cwd(),
	'nodes',
	'GoogleDocsBatchUpdate',
	'resources',
	'createRequest',
);

function walk(dir) {
	/** @type {string[]} */
	let out = [];
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, ent.name);
		if (ent.isDirectory()) {
			out = out.concat(walk(p));
		} else if (
			ent.isFile() &&
			ent.name.endsWith('.ts') &&
			ent.name !== 'index.ts' &&
			ent.name !== 'registry.ts' &&
			ent.name !== 'IGoogleDocsRequest.ts'
		) {
			out.push(p);
		}
	}
	return out;
}

function extractField(source, field) {
	// Matches: field: 'value' OR field: "value"
	const re = new RegExp(`${field}\\s*:\\s*(['\"])\\s*([^'\"]+)\\s*\\1`);
	const match = source.match(re);
	return match ? match[2] : null;
}

function extractRequestDefinitionBlock(source) {
	// Most request modules contain: const xyz: RequestDefinition = { ... };
	// We scope parsing to that block to avoid matching other "name:" fields.
	const re = /: RequestDefinition\s*=\s*\{([\s\S]*?)\};\s*[\r\n]+\s*registerRequest\s*\(/;
	const match = source.match(re);
	return match ? match[1] : null;
}

const files = walk(root);

/** @type {{file:string,name:string,value:string,category:string}[]} */
const items = [];

for (const file of files) {
	const src = fs.readFileSync(file, 'utf8');
	const block = extractRequestDefinitionBlock(src);
	if (!block) {
		throw new Error(
			`Failed to locate RequestDefinition block in ${path.relative(process.cwd(), file)}`,
		);
	}

	const name = extractField(block, 'name');
	const value = extractField(block, 'value');
	const category = extractField(block, 'category');

	if (!name || !value || !category) {
		throw new Error(
			`Failed to extract name/value/category from ${path.relative(process.cwd(), file)}`,
		);
	}

	items.push({
		file: path.relative(process.cwd(), file).replace(/\\/g, '/'),
		name,
		value,
		category,
	});
}

items.sort((a, b) => {
	const c = a.category.localeCompare(b.category);
	if (c !== 0) return c;
	return a.name.localeCompare(b.name);
});

/** @type {Record<string, typeof items>} */
const grouped = {};
for (const it of items) {
	if (!grouped[it.category]) grouped[it.category] = [];
	grouped[it.category].push(it);
}

// Print Markdown snippet
console.log(`Total request builders: ${items.length}`);
console.log('');

for (const category of Object.keys(grouped).sort((a, b) => a.localeCompare(b))) {
	console.log(`<details>`);
	console.log(`<summary><strong>${category}</strong> (${grouped[category].length})</summary>`);
	console.log('');
	for (const it of grouped[category]) {
		console.log(`- ${it.name} (\`${it.value}\`)`);
	}
	console.log('');
	console.log(`</details>`);
	console.log('');
}
