import { Embeddings } from "./base.js";
interface ModelParams {
    modelName: string;
}
export declare class OpenAIEmbeddings extends Embeddings implements ModelParams {
    modelName: string;
    batchSize: number;
    maxRetries: number;
    private apiKey;
    private client;
    constructor(fields?: Partial<ModelParams> & {
        verbose?: boolean;
        batchSize?: number;
        maxRetries?: number;
        openAIApiKey?: string;
    });
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
    private embeddingWithRetry;
}
export {};
