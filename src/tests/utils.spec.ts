import * as fs from "fs";
import path from "path";
import { test, expect } from "vitest";

import { pkgAnalyze } from "../utils";


test('pkgAnalyze', () => {
    const rootPath = 'D:/JsProjects';
    const projects = fs
        .readdirSync(rootPath)
        .map(name => path.join(rootPath, name));

    for (const project of projects) {
        const dependency = pkgAnalyze(project);
    }
});
