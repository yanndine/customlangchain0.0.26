import { BaseChain, ChainValues, LLMChain, SerializedLLMChain, SerializedBaseChain } from "./index.js";
export interface StuffDocumentsChainInput {
    /** LLM Wrapper to use after formatting documents */
    llmChain: LLMChain;
    inputKey: string;
    outputKey: string;
    /** Variable name in the LLM chain to put the documents in */
    documentVariableName: string;
}
export type SerializedStuffDocumentsChain = {
    _type: "stuff_documents_chain";
    llm_chain?: SerializedLLMChain;
    llm_chain_path?: string;
};
/**
 * Chain that combines documents by stuffing into context.
 * @augments BaseChain
 * @augments StuffDocumentsChainInput
 */
export declare class StuffDocumentsChain extends BaseChain implements StuffDocumentsChainInput {
    llmChain: LLMChain;
    inputKey: string;
    outputKey: string;
    documentVariableName: string;
    get inputKeys(): string[];
    constructor(fields: {
        llmChain: LLMChain;
        inputKey?: string;
        outputKey?: string;
        documentVariableName?: string;
    });
    _call(values: ChainValues): Promise<ChainValues>;
    _chainType(): "stuff_documents_chain";
    static deserialize(data: SerializedStuffDocumentsChain): Promise<StuffDocumentsChain>;
    serialize(): SerializedStuffDocumentsChain;
}
export type SerializedMapReduceDocumentsChain = {
    _type: "map_reduce_documents_chain";
    llm_chain?: SerializedLLMChain;
    llm_chain_path?: string;
    combine_document_chain?: SerializedBaseChain;
    combine_document_chain_path?: string;
};
export interface MapReduceDocumentsChainInput extends StuffDocumentsChainInput {
    maxTokens: number;
    maxIterations: number;
    combineDocumentsChain: BaseChain;
}
/**
 * Chain that combines documents by stuffing into context.
 * @augments BaseChain
 * @augments StuffDocumentsChainInput
 */
export declare class MapReduceDocumentsChain extends BaseChain implements StuffDocumentsChainInput {
    llmChain: LLMChain;
    inputKey: string;
    outputKey: string;
    documentVariableName: string;
    get inputKeys(): string[];
    maxTokens: number;
    maxIterations: number;
    combineDocumentChain: BaseChain;
    constructor(fields: {
        llmChain: LLMChain;
        combineDocumentChain: BaseChain;
        inputKey?: string;
        outputKey?: string;
        documentVariableName?: string;
        maxTokens?: number;
        maxIterations?: number;
    });
    _call(values: ChainValues): Promise<ChainValues>;
    _chainType(): "map_reduce_documents_chain";
    static deserialize(data: SerializedMapReduceDocumentsChain): Promise<MapReduceDocumentsChain>;
    serialize(): SerializedMapReduceDocumentsChain;
}
