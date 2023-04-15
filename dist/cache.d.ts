import { Generation } from "./schema/index.js";
export declare const getKey: (...strings: string[]) => string;
export declare abstract class BaseCache<T = Generation[]> {
    abstract lookup(key: string): T | undefined;
    abstract update(key: string, value: T): void;
}
export declare class InMemoryCache<T = Generation[]> extends BaseCache<T> {
    private cache;
    constructor();
    lookup(key: string): T;
    update(key: string, value: T): void;
}
