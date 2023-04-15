import { TextLoader } from "./text.js";
export declare class JSONLinesLoader extends TextLoader {
    pointer: string;
    constructor(filePath: string, pointer: string);
    protected parse(raw: string): Promise<string[]>;
}
