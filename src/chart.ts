import * as fs from "fs";
import path = require("path");


export function generateChart(templateDir: string, option: any): string {
    // Currently no need to use a template engine
    const template = fs.readFileSync(path.join(templateDir, 'chart.html'), { encoding: 'utf-8' });
    const echartsJsPath = path.join(templateDir, 'js', 'echarts.min.js');
    return template
        .replace('[[title]]', option?.title?.text ?? 'Chart')
        .replace('[[echarts.js]]', `file://${echartsJsPath}`)
        .replace('[[option]]', JSON.stringify(option));
}
