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
    .option('-d, --depth <depth>', 'recursion depth')
    .option('--json <file-path>', 'output file path')
    .option('--indent <indent>', 'json indent')
    .parse(process.argv)
    .opts();

const depth = toInt(options.depth, Infinity);
const filePath = options.json ? String(options.json) : '';
const indent = toInt(options.indent, 2);

const dependency = pkgAnalyze(process.cwd(), depth);
if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(
        dependency,
        (key: string, value: any) => key === 'depth' ? undefined : value,
        indent
    ));
} else {
    console.error('convert to gragh (developing ...)');
}
