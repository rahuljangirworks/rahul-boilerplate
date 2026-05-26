import fs from "fs"
import path from "path"

const REGISTRY_DIR = path.join(process.cwd(), "registry")
const OUTPUT_DIR = path.join(process.cwd(), "public", "r")

// Ensure public/r directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Read index registry.json
const rawIndex = fs.readFileSync(path.join(REGISTRY_DIR, "registry.json"), "utf8")
const registryIndex = JSON.parse(rawIndex)

const compiledItems: any[] = []

for (const item of registryIndex.items) {
  console.log(`Compiling registry item: ${item.name}...`)
  
  const compiledFiles = item.files.map((file: any) => {
    const absolutePath = path.join(process.cwd(), file.path)
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Registry source file not found: ${file.path}`)
    }
    const content = fs.readFileSync(absolutePath, "utf8")
    return {
      path: file.target,
      content: content,
      type: file.type
    }
  })

  const compiledItem = {
    ...item,
    files: compiledFiles
  }

  // Save standalone json file
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${item.name}.json`),
    JSON.stringify(compiledItem, null, 2),
    "utf8"
  )
  
  compiledItems.push(compiledItem)
}

// Save global compiled index.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, "index.json"),
  JSON.stringify({ ...registryIndex, items: compiledItems }, null, 2),
  "utf8"
)

console.log(`Successfully compiled ${compiledItems.length} registry items to public/r/!`)
