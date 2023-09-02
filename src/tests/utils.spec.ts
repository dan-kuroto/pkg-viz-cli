import * as fs from "fs";
import { test, expect } from "vitest";

import { pkgAnalyze } from "../utils";
import path from "path";


test('pkgAnalyze', () => {
    const rootPath = 'D:/JsProjects';
    const projects = fs.readdirSync(rootPath);

    for (const project of projects) {
        const projectDir = path.join(rootPath, project);
        console.log(projectDir);
        pkgAnalyze(projectDir);
    }
});
