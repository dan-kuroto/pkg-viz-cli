#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";
import * as echarts from "echarts";
import * as os from "os";
import * as path from "path";
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

const [dependency,] = pkgAnalyze(process.cwd(), depth);
if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(
        dependency,
        (key: string, value: any) => key === 'depth' ? undefined : value,
        indent
    ));
} else {
    const chart = echarts.init(document.createElement('div'));
    chart.setOption({});
    
    // TODO: 还是不要用tmpdir了，在自己的目录下创建一个tmp，然后每次运行时删除超过一天的
    // fs.writeFileSync(
    //     path.join(os.tmpdir(), `${new Date().getTime}.html`),
    //     chart.getDom().outerHTML
    // );
}
