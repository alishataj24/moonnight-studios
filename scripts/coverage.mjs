// Every piece in the catalogue must render somewhere, and no two may
// share an id — a duplicate silently shadows the earlier entry, because
// the lookup is a Map.
import { readFileSync } from "node:fs"
const read = (f) => readFileSync(f, "utf8")
const pf = read("src/data/portfolio.ts")
const rooms = read("src/data/rooms.ts")
const worlds = read("src/data/worlds.ts")
const content = read("src/data/content.ts")

const entries = [...pf.matchAll(/\n    id: "([a-z0-9-]+)"/g)].map((m) => m[1])
const seen = new Set(), dup = []
for (const id of entries) { if (seen.has(id)) dup.push(id); seen.add(id) }

const ids = (s) => new Set([...s.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]))
const ex = ids(rooms.slice(rooms.indexOf("exhibition"), rooms.indexOf("export type Slot")))
const sc = new Set([...rooms.matchAll(/\{ id: "([a-z0-9-]+)"/g)].map((m) => m[1]))
const gp = ids(rooms.slice(rooms.indexOf("gatePreview")))
const wo = new Set([...worlds.matchAll(/\/([a-z0-9-]+)\.jpg/g)].map((m) => m[1]))
const co = new Set([...content.matchAll(/\/([a-z0-9-]+)\.jpg/g)].map((m) => m[1]))
const shown = (id) => ex.has(id) || sc.has(id) || gp.has(id) || wo.has(id) || co.has(id)

const orphans = [...seen].filter((id) => !shown(id))
console.log(`catalogue ${seen.size}   exhibition ${ex.size}   screening ${sc.size}`)
console.log(dup.length ? `FAIL duplicate ids: ${dup.join(", ")}` : "PASS  no duplicate ids")
console.log(orphans.length ? `FAIL not shown anywhere: ${orphans.join(", ")}` : "PASS  every piece is shown somewhere")
process.exit(dup.length || orphans.length ? 1 : 0)
