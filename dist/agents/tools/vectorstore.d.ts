import { VectorStore } from "../../vectorstores/index.js";
import { BaseLLM } from "../../llms/index.js";
import { VectorDBQAChain } from "../../chains/index.js";
import { Tool } from "./base.js";
interface VectorStoreTool {
    vectorStore: VectorStore;
    llm: BaseLLM;
}
export declare class VectorStoreQATool extends Tool implements VectorStoreTool {
    vectorStore: VectorStore;
    llm: BaseLLM;
    name: string;
    description: string;
    chain: VectorDBQAChain;
    constructor(name: string, description: string, fields: VectorStoreTool);
    static getDescription(name: string, description: string): string;
    call(input: string): Promise<string>;
}
export {};
