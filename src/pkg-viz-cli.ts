#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { exec } from "child_process";
import { pkgAnalyze } from './utils';
import { generateChart } from './chart';


function toInt(obj: any, defaultValue: number = 0) {
    let value = parseInt(obj, 10);
    if (isNaN(value)) {
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
    .option('-d, --depth <depth>', 'recursion depth')
    .option('--json <file-path>', 'output file path')
    .option('--indent <indent>', 'json indent')
    .parse(process.argv)
    .opts();

const depth = toInt(options.depth, Infinity);
const jsonPath = options.json ? String(options.json) : '';
const indent = toInt(options.indent, 2);
const runPath = path.dirname((path.dirname(process.argv[1])));

const [dependency,] = pkgAnalyze(process.cwd(), depth);
if (jsonPath) {
    fs.writeFileSync(jsonPath, JSON.stringify(
        dependency,
        (key: string, value: any) => key === 'depth' ? undefined : value,
        indent
    ));
} else {
    const chartOption = {
        title: {
            text: 'Basic Graph'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'none',
                symbolSize: 50,
                roam: true,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: 20
                },
                data: [
                    {
                        name: 'Node 1',
                        x: 300,
                        y: 300
                    },
                    {
                        name: 'Node 2',
                        x: 800,
                        y: 300
                    },
                    {
                        name: 'Node 3',
                        x: 550,
                        y: 100
                    },
                    {
                        name: 'Node 4',
                        x: 550,
                        y: 500
                    }
                ],
                // links: [],
                links: [
                    {
                        source: 0,
                        target: 1,
                        symbolSize: [5, 20],
                        label: {
                            show: true
                        },
                        lineStyle: {
                            width: 5,
                            curveness: 0.2
                        }
                    },
                    {
                        source: 'Node 2',
                        target: 'Node 1',
                        label: {
                            show: true
                        },
                        lineStyle: {
                            curveness: 0.2
                        }
                    },
                    {
                        source: 'Node 1',
                        target: 'Node 3'
                    },
                    {
                        source: 'Node 2',
                        target: 'Node 3'
                    },
                    {
                        source: 'Node 2',
                        target: 'Node 4'
                    },
                    {
                        source: 'Node 1',
                        target: 'Node 4'
                    }
                ],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    };

    const chartName = new Date().getTime();
    const chartDir = path.join(os.tmpdir(), 'pkg-viz');
    if (!fs.existsSync(chartDir)) {
        fs.mkdirSync(chartDir);
    }
    const chartPath = path.join(chartDir, `${chartName}.html`);
    fs.writeFileSync(
        chartPath,
        generateChart(
            path.join(runPath, 'src', 'template'),
            chartOption
        ),
        { encoding: 'utf-8' }
    );
    openBrowser(`file://${chartPath}`);
}
