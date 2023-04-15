import PQueue from "p-queue";
import { BaseLanguageModel, BasePromptValue, LLMCallbackManager, LLMResult } from "../schema/index.js";
export type SerializedLLM = {
    _model: string;
    _type: string;
} & Record<string, any>;
/**
 * LLM Wrapper. Provides an {@link call} (an {@link generate}) function that takes in a prompt (or prompts) and returns a string.
 */
export declare abstract class BaseLLM extends BaseLanguageModel {
    /**
     * The name of the LLM class
     */
    name: string;
    cache?: boolean;
    callbackManager: LLMCallbackManager;
    /**
     * Maximum number of concurrent calls to this chain,
     * additional calls are queued up. Defaults to Infinity.
     */
    concurrency?: number;
    protected queue: PQueue;
    /**
     * Whether to print out response text.
     */
    verbose?: boolean;
    constructor(callbackManager?: LLMCallbackManager, verbose?: boolean, concurrency?: number, cache?: boolean);
    generatePrompt(promptValues: BasePromptValue[], stop?: string[]): Promise<LLMResult>;
    /**
     * Run the LLM on the given prompts and input.
     */
    abstract _generate(prompts: string[], stop?: string[]): Promise<LLMResult>;
    /** @ignore */
    _generateUncached(prompts: string[], stop?: string[]): Promise<LLMResult>;
    /**
     * Run the LLM on the given propmts an input, handling caching.
     */
    generate(prompts: string[], stop?: string[]): Promise<LLMResult>;
    /**
     * Convenience wrapper for {@link generate} that takes in a single string prompt and returns a single string output.
     */
    call(prompt: string, stop?: string[]): Promise<string>;
    /**
     * Get the identifying parameters of the LLM.
     */
    _identifyingParams(): Record<string, any>;
    /**
     * Return the string type key uniquely identifying this class of LLM.
     */
    abstract _llmType(): string;
    /**
     * Return a json-like object representing this LLM.
     */
    serialize(): SerializedLLM;
    _modelType(): string;
    /**
     * Load an LLM from a json-like object describing it.
     */
    static deserialize(data: SerializedLLM): Promise<BaseLLM>;
    private _tokenizer?;
    getNumTokens(text: string): number;
}
/**
 * LLM class that provides a simpler interface to subclass than {@link BaseLLM}.
 *
 * Requires only implementing a simpler {@link _call} method instead of {@link _generate}.
 *
 * @augments BaseLLM
 */
export declare abstract class LLM extends BaseLLM {
    /**
     * Run the LLM on the given prompt and input.
     */
    abstract _call(prompt: string, stop?: string[]): Promise<string>;
    _generate(prompts: string[], stop?: string[]): Promise<LLMResult>;
}
