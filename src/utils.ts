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
export function getDependency(pkgDir: string): Dependency | null {
  try {
    const packageJsonPath = path.join(pkgDir, PACKAGE_JSON_FILENAME);
    const data = JSON.parse(
      fs.readFileSync(packageJsonPath, { encoding: 'utf-8' }),
    ) as PackageJson;
    data.dependencies ??= {};
    data.devDependencies ??= {};

    const dependencies: Dependency[] = [];
    for (const name of Object.keys(data.dependencies)) {
      dependencies.push({ name, version: data.dependencies[name], dev: false });
    }
    for (const name of Object.keys(data.devDependencies)) {
      dependencies.push({ name, version: data.devDependencies[name], dev: true });
    }

    return { name: data.name, version: data.version, dependencies, dev: false };
  } catch (err) {
    // 如果要检验的话，校验点太多没完没了，直接一个try-catch暴力解决
    return null;
  }
}

/**
 * Analyze the project and return the dependencies
 */
export function pkgAnalyze(rootDir: string, depth: number = Infinity): Dependency[] {
  const visited = new Map<string, Dependency>(); // '{name}\n{version}' -> dependency
  const toVisit = [rootDir]; // dependency path to visit

  while (toVisit.length > 0) {
    const currPath = toVisit.shift() as string;

    const dependency = getDependency(currPath);
    // TODO: package.json里的版本不准确，可能有^和*之类的特殊符号表示模糊的区间
    if (dependency === null) {
      continue;
    }
    visited.set(`${dependency.name}\n${dependency.version}`, dependency);
    for (const son of dependency.dependencies ?? []) {
      const key = `${son.name}\n${son.version}`;
      if (!visited.has(key)) {
        if (!son.dev) {
          let sonDir = path.join(currPath, NODE_MODULES_DIRNAME, son.name);
          if (!fs.existsSync(sonDir)) {
            sonDir = path.join(rootDir, NODE_MODULES_DIRNAME, son.name);
          }
          toVisit.push(sonDir);
        }
        visited.set(key, son);
      }
    }
  }

  return [...visited.values()];
}
