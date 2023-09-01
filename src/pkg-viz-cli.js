#!/usr/bin/env node
import {pkgAnalyze} from './utils.js';

const packages = pkgAnalyze(process.cwd());
console.log(packages);
