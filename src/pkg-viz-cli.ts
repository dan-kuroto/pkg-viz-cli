#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";

import { pkgAnalyze } from './utils';


function toInt(obj: any, defaultValue: number = 0) {
    let value = parseInt(obj, 10);
    if (isNaN(value)) {
        value = defaultValue;
    }
    return value;
}

const options = program.version('1.0.0')
    .option('-d, --depth <depth>', 'depth')
    .option('--json <file-path>', 'file-path')
    .parse(process.argv)
    .opts();

const depth = toInt(options.depth, Infinity);
const filePath = options.json ? String(options.json) : '';

const dependency = pkgAnalyze(process.cwd(), depth);
if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(dependency));
} else {
    console.error('convert to gragh (developing ...)');
}
