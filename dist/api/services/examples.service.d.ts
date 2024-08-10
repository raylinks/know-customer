interface Example {
    id: number;
    name: string;
}
export declare class ExamplesService {
    all(): Promise<Example[]>;
    byId(id: number): Promise<Example>;
    create(name: string): Promise<Example>;
}
declare const _default: ExamplesService;
export default _default;
