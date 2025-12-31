import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/storage/memory.ts
class MemoryTokenStorage {
  tokens = null;
  async load() {
    return this.tokens;
  }
  async save(tokens) {
    this.tokens = tokens;
  }
  async clear() {
    this.tokens = null;
  }
}
// src/storage/file.ts
class FileTokenStorage {
  filePath;
  constructor(filePath) {
    this.filePath = filePath;
  }
  async load() {
    const fs = await import("node:fs/promises");
    try {
      const content = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  async save(tokens) {
    const fs = await import("node:fs/promises");
    await fs.writeFile(this.filePath, JSON.stringify(tokens, null, 2));
  }
  async clear() {
    const fs = await import("node:fs/promises");
    try {
      await fs.unlink(this.filePath);
    } catch {}
  }
}
export {
  MemoryTokenStorage,
  FileTokenStorage
};
