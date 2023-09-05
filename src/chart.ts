import * as fs from "fs";
import path = require("path");
import { ChartNodeData, ChartNodeLink, ChartOption, Dependency } from "./model";


export function generateChartHTML(templateDir: string, option: any): string {
    // Currently no need to use a template engine
    const template = fs.readFileSync(path.join(templateDir, 'chart.html'), { encoding: 'utf-8' });
    const echartsJsPath = path.join(templateDir, 'js', 'echarts.min.js');
    return template
        .replace('[[title]]', option?.title?.text ?? 'Chart')
        .replace('[[echarts.js]]', `file://${echartsJsPath}`)
        .replace('[[option]]', JSON.stringify(option));
}

export function generateChartOption(option?: ChartOption): ChartOption {
    return {
        title: {
            text: option?.title?.text ?? 'Chart'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                layout: 'force',
                force: {
                    // 设置节点间的斥力，值越大越分散
                    repulsion: 1200,
                    // 设置节点的吸引力，值越大越靠近中心
                    gravity: 0.1,
                    // 设置是否开启节点的位置修正，可以防止节点重叠
                    edgeLength: 100,
                    // 设置布局刷新的迭代次数
                    iterations: 100,
                },
                symbolSize: 50,
                roam: true,
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [5, 15],
                edgeLabel: {
                    fontSize: 20
                },
                symbol: 'rect',
                data: option?.data ?? [],
                links: option?.links ?? [],
                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                }
            }
        ]
    };
}

function getChartNodeNameByDependency(dependency: Dependency): string {
    if (dependency.dev === true) {
        return `${dependency.name}\n${dependency.version}\n(dev)`;
    } else {
        return `${dependency.name}\n${dependency.version}`;
    }
}

export function dependencyMap2ChartNode(map: Map<string, Dependency>): [ChartNodeData[], ChartNodeLink[]] {
    const data: ChartNodeData[] = [];
    const links: ChartNodeLink[] = [];
    for (const dependency of map.values()) {
        const sourceName = getChartNodeNameByDependency(dependency);
        data.push({
            name: sourceName,
            draggable: true,
        });
        for (const son of dependency.dependencies ?? []) {
            links.push({ source: sourceName, target: getChartNodeNameByDependency(son) });
        }
    }
    return [data, links];
}
