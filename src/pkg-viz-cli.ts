#!/usr/bin/env node
import {pkgAnalyze} from './utils';

const packages = pkgAnalyze(process.cwd());
console.log(packages);
