#!/usr/bin/env node
import { program } from "commander";
import * as fs from "fs";
import * as echarts from "echarts";
import * as os from "os";
import * as path from "path";
import open from "open";
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
const jsonPath = options.json ? String(options.json) : '';
const indent = toInt(options.indent, 2);

const [dependency,] = pkgAnalyze(process.cwd(), depth);
if (jsonPath) {
    fs.writeFileSync(jsonPath, JSON.stringify(
        dependency,
        (key: string, value: any) => key === 'depth' ? undefined : value,
        indent
    ));
} else {
    const chartName = new Date().getTime();
    const chartPath = path.join(os.tmpdir(), 'pkg-viz', `${chartName}.html`);
    const chart = echarts.init(document.createElement('div'));
    // 暂时用echarts给的示例，先测出能不能正常生成HTML=>保存=>打开浏览器
    chart.setOption({
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
    });
    fs.writeFileSync(
        chartPath,
        chart.getDom().outerHTML
    );
    console.log(chartPath);
    open(`file://${chartPath}`);
}
