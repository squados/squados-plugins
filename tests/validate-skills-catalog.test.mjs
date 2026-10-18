import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { validateSkillsCatalog } from "../scripts/validate-skills-catalog.mjs";

test("the published catalog has complete bilingual editorial content and real covers", () => {
  assert.deepEqual(validateSkillsCatalog(resolve(".")), []);
});

test("a third-party source cannot reenter the official specialist catalog", () => {
  const root = mkdtempSync(resolve(".scratch/catalog-origin-"));
  try {
    for (const name of ["gallery.json", "curation.json", "assets"])
      cpSync(resolve(name), join(root, name), { recursive: true });
    const catalog = JSON.parse(readFileSync(join(root, "gallery.json"), "utf8"));
    catalog.items[0].source = {
      type: "github",
      identifier: "anthropics/skills/skills/brand-guidelines",
    };
    writeFileSync(join(root, "gallery.json"), JSON.stringify(catalog));
    assert.ok(validateSkillsCatalog(root).some((problem) => problem.includes("SquadOS source")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("malformed content, duplicate identity and escaping image paths cannot be published", () => {
  const root = mkdtempSync(resolve(".scratch/catalog-validation-"));
  try {
    for (const name of ["gallery.json", "curation.json", "assets"])
      cpSync(resolve(name), join(root, name), { recursive: true });
    const catalog = JSON.parse(readFileSync(join(root, "gallery.json"), "utf8"));
    catalog.items[0].editorial.presentation.overview.en = " ";
    catalog.items[0].editorial.presentation.image.path = "../secret.webp";
    catalog.items.push(catalog.items[0]);
    writeFileSync(join(root, "gallery.json"), JSON.stringify(catalog));
    const problems = validateSkillsCatalog(root);
    assert.ok(problems.some((problem) => problem.includes("overview.en")));
    assert.ok(problems.some((problem) => problem.includes("image.path")));
    assert.ok(problems.some((problem) => problem.includes("duplicate")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
