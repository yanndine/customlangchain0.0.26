import { BaseChain, ChainInputs, ChainValues } from "./index.js";
import { SerializedLLM } from "../llms/index.js";
import { BaseLanguageModel } from "../schema/index.js";
import { BaseMemory } from "../memory/index.js";
import { BasePromptTemplate, SerializedBasePromptTemplate } from "../prompts/index.js";
export interface LLMChainInput extends ChainInputs {
    /** Prompt object to use */
    prompt: BasePromptTemplate;
    /** LLM Wrapper to use */
    llm: BaseLanguageModel;
    /** @ignore */
    outputKey: string;
}
export type SerializedLLMChain = {
    _type: "llm_chain";
    llm?: SerializedLLM;
    llm_path?: string;
    prompt?: SerializedBasePromptTemplate;
    prompt_path?: string;
};
/**
 * Chain to run queries against LLMs.
 * @augments BaseChain
 * @augments LLMChainInput
 *
 * @example
 * ```ts
 * import { LLMChain, OpenAI, PromptTemplate } from "langchain";
 * const prompt = PromptTemplate.fromTemplate("Tell me a {adjective} joke");
 * const llm = LLMChain({ llm: new OpenAI(), prompt });
 * ```
 */
export declare class LLMChain extends BaseChain implements LLMChainInput {
    prompt: BasePromptTemplate;
    llm: BaseLanguageModel;
    outputKey: string;
    get inputKeys(): string[];
    constructor(fields: {
        prompt: BasePromptTemplate;
        llm: BaseLanguageModel;
        outputKey?: string;
        memory?: BaseMemory;
    });
    _call(values: ChainValues): Promise<ChainValues>;
    /**
     * Format prompt with values and pass to LLM
     *
     * @param values - keys to pass to prompt template
     * @returns Completion from LLM.
     *
     * @example
     * ```ts
     * llm.predict({ adjective: "funny" })
     * ```
     */
    predict(values: ChainValues): Promise<string>;
    _chainType(): "llm_chain";
    static deserialize(data: SerializedLLMChain): Promise<LLMChain>;
    serialize(): SerializedLLMChain;
}
export declare class ConversationChain extends LLMChain {
    constructor(fields: {
        llm: BaseLanguageModel;
        prompt?: BasePromptTemplate;
        outputKey?: string;
        memory?: BaseMemory;
    });
}
