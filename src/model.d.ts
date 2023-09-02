export interface Dependency {
    name: string;
    version: string;
    dev: boolean;
    dependencies?: Dependency[];
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
