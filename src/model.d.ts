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
        [name: string]: string
    };
    devDependencies?: {
        [name: string]: string
    };
}
