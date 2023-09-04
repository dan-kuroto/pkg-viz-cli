import * as fs from 'fs';
import * as path from 'path';

import { Dependency, PackageJson } from "./model";


export const PACKAGE_JSON_FILENAME = 'package.json';
export const PACKAGE_LOCK_JSON_FILENAME = 'package-lock.json';
export const NODE_MODULES_DIRNAME = 'node_modules';

/**
 * Get dependencies of the project without recursion.
 *
 * If any exception occurs, such as this path is not a npm project,
 * return null.
 */
export function getDependency(pkgDir: string, dependency: Dependency = {}): Dependency | null {
  try {
    const packageJsonPath = path.join(pkgDir, PACKAGE_JSON_FILENAME);
    const data = JSON.parse(
      fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }),
    ) as PackageJson;
    data.dependencies ??= {};
    data.devDependencies ??= {};

    const dependencies: Dependency[] = [];
    for (const name of Object.keys(data.dependencies)) {
      dependencies.push({ name, dev: false });
    }
    for (const name of Object.keys(data.devDependencies)) {
      dependencies.push({ name, dev: true });
    }

    dependency.name ??= data.name;
    dependency.version ??= data.version;
    dependency.dev ??= false;
    if (dependency.dev === true) {
      dependency.path = undefined;
    } else {
      dependency.dependencies ??= dependencies;
      dependency.path ??= pkgDir;
    }
    return dependency;
  } catch (err) {
    // 如果要检验的话，校验点太多没完没了，直接一个try-catch暴力解决
    return null;
  }
}

/**
 * Analyze the project and return the dependencies
 * @returns Dependency of root package, and map of '{name}\n{version}' -> dependency
 */
export function pkgAnalyze(rootDir: string, depth: number = Infinity): [Dependency, Map<string, Dependency>] {
  const visited = new Map<string, Dependency>(); // '{name}\n{version}' -> dependency
  const toVisit: Dependency[] = [{ path: rootDir, depth: 0 }]; // dependency
  const root = toVisit[0];

  while (toVisit.length > 0) {
    const curr = toVisit.shift() as Dependency;

    const dependency = getDependency(curr.path ?? '', curr);
    if (dependency === null) {
      continue;
    }
    const key = `${dependency.name}\n${dependency.version}`;
    if (visited.has(key)) {
      continue;
    }
    visited.set(key, dependency);

    if (dependency.dev === true) {
      continue;
    }
    if (dependency.depth === depth) {
      delete dependency.dependencies;
      continue;
    }
    for (const son of dependency.dependencies ?? []) {
      let sonDir = path.join(curr.path ?? '', NODE_MODULES_DIRNAME, son.name ?? '');
      if (!fs.existsSync(sonDir)) {
        sonDir = path.join(rootDir, NODE_MODULES_DIRNAME, son.name ?? '');
      }
      if (fs.existsSync(sonDir)) {
        son.path = sonDir;
      }
      son.depth = (dependency.depth ?? 0) + 1;
      toVisit.push(son);
    }
  }

  return [root, visited];
}
