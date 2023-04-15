import type { LLMChain, StuffDocumentsChain, VectorDBQAChain, ChatVectorDBQAChain, MapReduceDocumentsChain, AnalyzeDocumentChain } from "./index.js";
import { BaseMemory } from "../memory/index.js";
import { SqlDatabaseChain } from "./sql_db/sql_db_chain.js";
export type ChainValues = Record<string, any>;
export type LoadValues = Record<string, any>;
export type SerializedBaseChain = ReturnType<InstanceType<typeof LLMChain | typeof StuffDocumentsChain | typeof VectorDBQAChain | typeof ChatVectorDBQAChain | typeof MapReduceDocumentsChain | typeof AnalyzeDocumentChain | typeof SqlDatabaseChain>["serialize"]>;
export interface ChainInputs {
    memory?: BaseMemory;
}
/**
 * Base interface that all chains must implement.
 */
export declare abstract class BaseChain implements ChainInputs {
    memory?: BaseMemory;
    constructor(memory?: BaseMemory);
    /**
     * Run the core logic of this chain and return the output
     */
    abstract _call(values: ChainValues): Promise<ChainValues>;
    /**
     * Return the string type key uniquely identifying this class of chain.
     */
    abstract _chainType(): string;
    /**
     * Return a json-like object representing this chain.
     */
    abstract serialize(): SerializedBaseChain;
    abstract get inputKeys(): string[];
    run(input: any): Promise<string>;
    /**
     * Run the core logic of this chain and add to output if desired.
     *
     * Wraps {@link _call} and handles memory.
     */
    call(values: ChainValues): Promise<ChainValues>;
    /**
     * Call the chain on all inputs in the list
     */
    apply(inputs: ChainValues[]): Promise<ChainValues>;
    /**
     * Load a chain from a json-like object describing it.
     */
    static deserialize(data: SerializedBaseChain, values?: LoadValues): Promise<BaseChain>;
}
