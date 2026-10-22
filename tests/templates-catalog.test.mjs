import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { verifyTemplatesCatalog } from "../scripts/templates-catalog.mjs";

test("every published template has complete files, preview, goals and matching hashes", () => {
  assert.deepEqual(verifyTemplatesCatalog(resolve(".")), []);
});

test("website and application packages include their runnable preview", () => {
  const root = resolve(".");
  const catalog = JSON.parse(readFileSync(join(root, "templates.json"), "utf8"));
  const interfaces = catalog.packages.filter(({ template }) =>
    template.kind === "web" && ["website", "app"].includes(template.category),
  );
  assert.equal(interfaces.length, 13);
  for (const entry of interfaces) {
    assert.ok(entry.files.some(({ path }) => path === "demo/index.html"), `${entry.template.id}: runnable preview missing`);
    const html = readFileSync(join(root, entry.path, "demo/index.html"), "utf8");
    const resources = [...html.matchAll(/(?:src|href)=["'](\.\/[^"']+)["']/g)].map((match) => `demo/${match[1].slice(2)}`);
    assert.ok(resources.some((path) => path.endsWith(".js")), `${entry.template.id}: JavaScript entry missing`);
    for (const path of resources) {
      assert.ok(entry.files.some((file) => file.path === path), `${entry.template.id}: undeclared demo resource ${path}`);
    }
  }
});
test("a changed package or escaping path cannot be published", () => {
  mkdirSync(".scratch", { recursive: true });
  const root = mkdtempSync(resolve(".scratch/template-catalog-"));
  try {
    const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const descriptor = { path: "preview.png", size: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
    const entry = { template: {
      id: "specimen", kind: "slides", name: { en: "Example", "pt-BR": "Exemplo" },
      description: { en: "Description", "pt-BR": "Descrição" }, goal: { en: "Create", "pt-BR": "Criar" },
      entry: "preview.png", preview: "preview.png", adaptation: "Adapt a copy", license: "MIT", origin: "SquadOS",
      sourceUrl: "https://github.com/squados/squados-plugins/tree/main/templates/specimen",
    }, path: "templates/specimen", files: [descriptor] };
    mkdirSync(join(root, entry.path), { recursive: true });
    writeFileSync(join(root, entry.path, "preview.png"), bytes);
    const save = () => writeFileSync(join(root, "templates.json"), JSON.stringify({ version: 1, packages: [entry] }));
    save();
    assert.deepEqual(verifyTemplatesCatalog(root), []);
    writeFileSync(join(root, entry.path, "preview.png"), "changed");
    assert.ok(verifyTemplatesCatalog(root).some((problem) => problem.includes("integrity")));
    descriptor.path = "../private";
    save();
    assert.ok(verifyTemplatesCatalog(root).some((problem) => problem.includes("path")));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
