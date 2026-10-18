import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { verifyTemplatesCatalog } from "../scripts/templates-catalog.mjs";

test("every published template has complete files, preview, goals and matching hashes", () => {
  assert.deepEqual(verifyTemplatesCatalog(resolve(".")), []);
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
