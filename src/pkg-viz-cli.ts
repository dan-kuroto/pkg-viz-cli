#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { exec } from "child_process";
import { pkgAnalyze } from './utils';
import { dependencyMap2ChartNode, generateChartHTML, generateChartOption } from './chart';


/**
 * parse `obj` to int, if `invalidCheck(obj)` is true, result is `defaultValue`.
 */
function toInt(
    obj: any,
    defaultValue: number = 0,
    invalidCheck: (num: number) => boolean = isNaN
) {
    let value = parseInt(obj, 10);
    if (invalidCheck(value)) {
        value = defaultValue;
    }
    return value;
}

function openBrowser(url: string) {
    let command: string;
    switch (os.platform()) {
        case 'win32':
            command = `start ${url}`;
            break;
        case 'linux':
        case 'darwin':
            command = `xdg-open ${url}`;
            break;
        default:
            console.error('Currently, it is not supported to open the browser in this OS');
            return;
    }
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Failed to open browser');
            return;
        }
    });
}

const options = program.version('1.0.0')
    .option('-d, --depth <depth>', 'recursion depth ("Infinity" is valid)', '2')
    .option('--dev', 'show devDependencies', false)
    .option('--json <file-path>', 'output file path')
    .option('--indent <indent>', 'json indent', '2')
    .parse(process.argv)
    .opts();

const depth = toInt(options.depth, 2);
const devShow = Boolean(options.dev);
const jsonPath = options.json ? String(options.json) : '';
const indent = toInt(options.indent, 2, num => isNaN(num) || !isFinite(num));
const runPath = path.dirname((path.dirname(process.argv[1])));

const [dependency, dependencyMap] = pkgAnalyze(process.cwd(), depth, devShow);
if (jsonPath) {
    fs.writeFileSync(jsonPath, JSON.stringify(
        dependency,
        (key: string, value: any) => key === 'depth' ? undefined : value,
        indent
    ));
} else {
    const chartOption = generateChartOption();
    chartOption.title.text = `Dependencies of [${dependency.path}]`;
    [chartOption.series[0].data, chartOption.series[0].links] = dependencyMap2ChartNode(dependencyMap);

    const chartName = new Date().getTime();
    const chartDir = path.join(os.tmpdir(), 'pkg-viz');
    if (!fs.existsSync(chartDir)) {
        fs.mkdirSync(chartDir);
    }
    const chartPath = path.join(chartDir, `${chartName}.html`);
    fs.writeFileSync(
        chartPath,
        generateChartHTML(
            path.join(runPath, 'src', 'template'),
            chartOption
        ),
        { encoding: 'utf-8' }
    );
    openBrowser(`file://${chartPath}`);
}
