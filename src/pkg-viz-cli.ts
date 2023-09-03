#!/usr/bin/env node
import { program } from "commander";

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

const packages = pkgAnalyze(process.cwd(), depth);
