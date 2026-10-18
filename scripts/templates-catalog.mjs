import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const validPath = (path) => typeof path === "string" && path.length <= 1000 && path.split("/").every(
  (part) => /^[^<>:\"\\|?*\u0000-\u001f]+$/.test(part) && ![".", "..", ".git", "node_modules", "dist", ".expo"].includes(part) && !/[. ]$/.test(part) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
);
function files(root, prefix = "") {
  return readdirSync(root).sort().flatMap((name) => {
    if (["node_modules", ".git", "dist", ".expo", ".scratch"].includes(name)) return [];
    const path = prefix + name;
    if (!validPath(path)) throw new Error(`invalid path: ${path}`);
    const info = lstatSync(join(root, name));
    if (info.isSymbolicLink()) throw new Error(`symbolic link: ${path}`);
    return info.isDirectory() ? files(join(root, name), `${path}/`) : [path];
  });
}
export function verifyTemplatesCatalog(root, rewrite = false) {
  const problems = [];
  const catalog = JSON.parse(readFileSync(join(root, "templates.json"), "utf8"));
  if (catalog.version !== 1 || !Array.isArray(catalog.packages) || catalog.packages.length > 500)
    return ["invalid template catalog"];
  const ids = new Set();
  for (const entry of catalog.packages) {
    const template = entry.template;
    const fail = (message) => problems.push(`${template?.id ?? "unknown"}: ${message}`);
    if (!template || !/^[a-z][a-z0-9-]{0,159}$/.test(template.id) || ids.has(template.id)) { fail("invalid or duplicate id"); continue; }
    ids.add(template.id);
    if (!["web", "mobile", "slides"].includes(template.kind)) fail("kind");
    for (const field of ["name", "description", "goal"])
      for (const locale of ["pt-BR", "en"])
        if (typeof template[field]?.[locale] !== "string" || !template[field][locale].trim() || template[field][locale].length > 2000) fail(`${field}.${locale}`);
    for (const field of ["adaptation", "license", "origin"])
      if (typeof template[field] !== "string" || !template[field].trim()) fail(field);
    if (!validPath(entry.path) || !validPath(template.entry) || !validPath(template.preview)) { fail("invalid path"); continue; }
    if (template.sourceUrl !== `https://github.com/squados/squados-plugins/tree/main/${entry.path}`) fail("sourceUrl");
    try {
      const names = files(join(root, entry.path));
      const expected = names.map((path) => {
        const bytes = readFileSync(join(root, entry.path, path));
        return { path, size: bytes.length, sha256: hash(bytes) };
      });
      if (rewrite) entry.files = expected;
      if (!Array.isArray(entry.files) || entry.files.some((file) => !validPath(file.path))) { fail("invalid file path"); continue; }
      if (entry.files.length > 2000 || new Set(entry.files.map((file) => file.path.toLowerCase())).size !== entry.files.length) fail("duplicate or excessive files");
      if (JSON.stringify(entry.files) !== JSON.stringify(expected)) fail("package integrity mismatch; run --write after reviewing changes");
      if (!names.includes(template.entry) || !names.includes(template.preview)) fail("missing entry/preview");
      const preview = readFileSync(join(root, entry.path, template.preview));
      if (!preview.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) fail("preview must be PNG");
      if (expected.some((file) => file.size > 128 * 1024 * 1024) || expected.reduce((sum, file) => sum + file.size, 0) > 512 * 1024 * 1024) fail("package size");
    } catch (error) { fail(error.message); }
  }
  if (rewrite && !problems.length) writeFileSync(join(root, "templates.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  return problems;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const problems = verifyTemplatesCatalog(resolve("."), process.argv.includes("--write"));
  if (problems.length) { console.error(problems.join("\n")); process.exitCode = 1; }
  else console.log("Templates validados: catálogo, objetivos, previews, arquivos e hashes.");
}
