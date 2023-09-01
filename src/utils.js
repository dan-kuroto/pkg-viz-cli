import * as fs from 'fs';
import * as path from 'path';

export const PACKAGE_JSON_FILENAME = 'package.json';
export const PACKAGE_LOCK_JSON_FILENAME = 'package-lock.json';
export const NODE_MODULES_DIRNAME = 'node_modules';

/**
 * Get dependencies of the project without recursion.
 *
 * If any exception occurs, such as this path is not a npm project,
 * return null.
 *
 * @param {string} pkgDir project path
 * @return {?Dependency} dependency
 */
export function getDependency(pkgDir) {
  try {
    const packageJsonPath = path.join(pkgDir, PACKAGE_JSON_FILENAME);
    const data = JSON.parse(
        fs.readFileSync(packageJsonPath, {encoding: 'utf-8'}),
    );
    const dependencies = [];
    for (const name of Object.keys(data.dependencies || {})) {
      dependencies.push({name, version: data.dependencies[name], dev: false});
    }
    for (const name of Object.keys(data.devDependencies || {})) {
      dependencies.push({name, version: data.devDependencies[name], dev: true});
    }
    return {name: data.name, version: data.version, dependencies};
  } catch (err) {
    // 如果要检验的话，校验点太多没完没了，直接一个try-catch暴力解决
    return null;
  }
}

/**
 * Analyze the project and return the dependencies
 * @param {string} pkgDir project path
 * @return {?Dependency} dependency
 */
export function pkgAnalyze(pkgDir) {
  const visited = new Set();
  const toVisit = [pkgDir];
  const dependency = getDependency(pkgDir);
  return dependency;
}
