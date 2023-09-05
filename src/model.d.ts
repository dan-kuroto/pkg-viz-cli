export interface Dependency {
    name?: string;
    version?: string;
    dev?: boolean;
    path?: string;
    dependencies?: Dependency[];
    depth?: number;
}

export interface PackageJson {
    name: string;
    version: string;
    dependencies?: {
        [name: string]: string;
    };
    devDependencies?: {
        [name: string]: string;
    };
}

export interface ChartOption {
    title: {
        text?: string;
    };
    series: ChartSeries[];
    [name: string]: any;
}

export interface ChartSeries {
    data: ChartNodeData[];
    links: ChartNodeLink[];
    [name: string]: any;
}

export interface ChartNodeData {
    name: string;
    draggable?: boolean;
}

export interface ChartNodeLink {
    source: number | string;
    target: number | string;
}
