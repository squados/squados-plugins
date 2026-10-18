import { readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositories = new Set([
  "anthropics/skills",
  "anthropics/knowledge-work-plugins",
  "openai/skills",
  "openai/plugins",
]);
const languages = ["en", "pt-BR"];
const segment = /^(?!\.{1,2}$)[A-Za-z0-9._-]{1,100}$/;
function identity(source) {
  if (!source || typeof source !== "object") return null;
  const path = source.type === "github" ? source.identifier : source.path;
  if (typeof path !== "string" || !path.split("/").every((part) => segment.test(part))) return null;
  if (source.type === "github")
    return repositories.has(path.split("/").slice(0, 2).join("/")) && path.split("/").length > 2
      ? path
      : null;
  if (source.type === "hermes" && /^(skills|optional-skills)\//.test(path)) return `hermes/${path}`;
  if (source.type === "squados" && path.startsWith("skills/"))
    return `squados/squados-plugins/${path}`;
  return null;
}
export function webpDimensions(raw) {
  if (
    raw.length < 30 ||
    raw.toString("ascii", 0, 4) !== "RIFF" ||
    raw.toString("ascii", 8, 12) !== "WEBP"
  )
    return null;
  const kind = raw.toString("ascii", 12, 16);
  if (kind === "VP8X") return [1 + raw.readUIntLE(24, 3), 1 + raw.readUIntLE(27, 3)];
  if (kind === "VP8 " && raw.subarray(23, 26).equals(Buffer.from([0x9d, 0x01, 0x2a])))
    return [raw.readUInt16LE(26) & 0x3fff, raw.readUInt16LE(28) & 0x3fff];
  if (kind === "VP8L" && raw[20] === 0x2f) {
    const bits = raw.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  return null;
}

export function validateSkillsCatalog(directory = resolve(".")) {
  const problems = [];
  const fail = (id, field) => problems.push(`${id}: ${field}`);
  let catalog, curation;
  try {
    const file = readFileSync(join(directory, "gallery.json"));
    if (file.length > 1_000_000) return ["catalog: exceeds 1 MB"];
    catalog = JSON.parse(file);
    curation = JSON.parse(readFileSync(join(directory, "curation.json"), "utf8"));
  } catch {
    return ["catalog: invalid or missing index/curation"];
  }
  if (catalog.version !== 2 || !Array.isArray(catalog.items) || catalog.items.length > 500)
    return ["catalog: version or items"];
  if (!Array.isArray(catalog.areas) || catalog.areas.length > 50) return ["catalog: areas"];
  const areas = new Set(catalog.areas.map((area) => area.id));
  const ids = new Set(),
    sources = new Set();
  const text = (value, max, id, field) => {
    for (const language of languages)
      if (
        typeof value?.[language] !== "string" ||
        !value[language].trim() ||
        value[language].length > max
      )
        fail(id, `${field}.${language}`);
  };
  for (const area of catalog.areas) text(area.title, 60, area.id, "area.title");
  for (const item of catalog.items) {
    const id = item.id || "item";
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(id) || ids.has(id)) fail(id, "duplicate or invalid id");
    ids.add(id);
    const key = identity(item.source);
    if (item.source?.type !== "squados") fail(id, "official catalog requires a SquadOS source");
    if (!key || sources.has(key)) fail(id, "duplicate or invalid source");
    sources.add(key);
    if (!areas.has(item.area)) fail(id, "unknown area");
    text(item.title, 80, id, "title");
    text(item.description, 300, id, "description");
    const editorial = item.editorial,
      presentation = editorial?.presentation;
    if (!presentation) {
      fail(id, "missing editorial");
      continue;
    }
    for (const [field, max] of [
      ["title", 80],
      ["summary", 300],
      ["overview", 12000],
    ])
      text(presentation[field], max, id, field);
    if (
      !Array.isArray(presentation.examples) ||
      presentation.examples.length < 3 ||
      presentation.examples.length > 5
    )
      fail(id, "examples count");
    const exampleIds = new Set();
    for (const example of presentation.examples ?? []) {
      if (!example.id || exampleIds.has(example.id)) fail(id, "duplicate example id");
      exampleIds.add(example.id);
      text(example.prompt, 800, id, "example.prompt");
    }
    if (typeof presentation.publisher !== "string" || !presentation.publisher.trim())
      fail(id, "publisher");
    for (const field of ["roles", "outputs"])
      if (
        !Array.isArray(presentation[field]) ||
        presentation[field].length > 8 ||
        presentation[field].some((tag) => typeof tag !== "string" || !tag || tag.length > 80)
      )
        fail(id, field);
    if (!editorial.reviewedRevision) fail(id, "reviewedRevision");
    if (
      typeof editorial.license?.label !== "string" ||
      !editorial.license.label ||
      !/^https:\/\//.test(editorial.license?.url ?? "")
    )
      fail(id, "license");
    if (!["ready", "requires-connection"].includes(editorial.compatibility?.status))
      fail(id, "unsupported published item");
    if (
      !Array.isArray(editorial.compatibility?.requirements) ||
      editorial.compatibility.requirements.length > 10
    )
      fail(id, "requirements");
    for (const requirement of editorial.compatibility?.requirements ?? [])
      text(requirement, 500, id, "requirement");
    text(presentation.image?.alt, 300, id, "image.alt");
    const imagePath = presentation.image?.path;
    if (typeof imagePath !== "string" || !/^assets\/[a-z0-9][a-z0-9-]*\.webp$/.test(imagePath)) {
      fail(id, "image.path");
      continue;
    }
    try {
      const path = realpathSync(join(directory, imagePath));
      const inside = relative(realpathSync(directory), path);
      if (inside.startsWith("..") || isAbsolute(inside)) throw new Error("escape");
      if (statSync(path).size > 160 * 1024) fail(id, "image exceeds 160 KiB");
      const dimensions = webpDimensions(readFileSync(path));
      if (
        !dimensions ||
        dimensions[0] <= 0 ||
        dimensions[1] <= 0 ||
        dimensions[0] * 9 !== dimensions[1] * 16
      )
        fail(id, "image dimensions must be 16:9");
    } catch {
      fail(id, "missing or unsafe image");
    }
  }
  const reviewed = curation.candidates;
  if (!Array.isArray(reviewed) || reviewed.length === 0)
    fail("curation", "must account for reviewed candidates");
  const reviewedSources = new Set();
  for (const row of reviewed ?? []) {
    const key = identity(row.source);
    if (!key || reviewedSources.has(key)) fail("curation", "duplicate or invalid source");
    reviewedSources.add(key);
    if (
      !row.reviewedRevision ||
      !["ready", "requires-connection", "unsupported"].includes(row.status)
    )
      fail(key, "review identity/status");
    text(row.reason, 2000, key, "curation.reason");
    if (row.status === "unsupported" && sources.has(key)) fail(key, "excluded item published");
    if (row.status !== "unsupported" && !sources.has(key)) fail(key, "compatible item missing");
  }
  for (const key of sources) if (!reviewedSources.has(key)) fail(key, "unreviewed source");
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const problems = validateSkillsCatalog();
  if (problems.length) {
    for (const problem of problems) console.error(problem);
    process.exitCode = 1;
  } else console.log("Catálogo de skills validado: conteúdo, procedência, matriz e imagens.");
}
