import { BaseChain, ChainValues, SerializedBaseChain } from "./index.js";
import { TextSplitter } from "../text_splitter.js";
export type LoadValues = Record<string, any>;
export type SerializedAnalyzeDocumentChain = {
    _type: "analyze_document_chain";
    combine_document_chain?: SerializedBaseChain;
    combine_document_chain_path?: string;
};
export interface AnalyzeDocumentChainInput {
    textSplitter: TextSplitter;
    combineDocumentsChain: BaseChain;
}
/**
 * Chain that combines documents by stuffing into context.
 * @augments BaseChain
 * @augments StuffDocumentsChainInput
 */
export declare class AnalyzeDocumentChain extends BaseChain implements AnalyzeDocumentChainInput {
    inputKey: string;
    outputKey: string;
    combineDocumentsChain: BaseChain;
    textSplitter: TextSplitter;
    constructor(fields: {
        combineDocumentsChain: BaseChain;
        inputKey?: string;
        outputKey?: string;
        textSplitter?: TextSplitter;
    });
    get inputKeys(): string[];
    _call(values: ChainValues): Promise<ChainValues>;
    _chainType(): "analyze_document_chain";
    static deserialize(data: SerializedAnalyzeDocumentChain, values: LoadValues): Promise<AnalyzeDocumentChain>;
    serialize(): SerializedAnalyzeDocumentChain;
}
