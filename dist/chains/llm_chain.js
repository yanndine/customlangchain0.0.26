import { BaseChain } from "./index.js";
import { BaseLLM } from "../llms/index.js";
import { BufferMemory } from "../memory/index.js";
import { BasePromptTemplate, PromptTemplate, } from "../prompts/index.js";
import { resolveConfigFromFile } from "../util/index.js";
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
export class LLMChain extends BaseChain {
    get inputKeys() {
        return this.prompt.inputVariables;
    }
    constructor(fields) {
        super(fields.memory);
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llm", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "text"
        });
        this.prompt = fields.prompt;
        this.llm = fields.llm;
        this.outputKey = fields.outputKey ?? this.outputKey;
    }
    async _call(values) {
        let stop;
        if ("stop" in values && Array.isArray(values.stop)) {
            stop = values.stop;
        }
        const promptValue = await this.prompt.formatPromptValue(values);
        const { generations } = await this.llm.generatePrompt([promptValue], stop);
        return { [this.outputKey]: generations[0][0].text };
    }
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
    async predict(values) {
        const output = await this.call(values);
        return output[this.outputKey];
    }
    _chainType() {
        return "llm_chain";
    }
    static async deserialize(data) {
        const serializedLLM = await resolveConfigFromFile("llm", data);
        const serializedPrompt = await resolveConfigFromFile("prompt", data);
        return new LLMChain({
            llm: await BaseLLM.deserialize(serializedLLM),
            prompt: await BasePromptTemplate.deserialize(serializedPrompt),
        });
    }
    serialize() {
        return {
            _type: this._chainType(),
            // llm: this.llm.serialize(), TODO fix this now that llm is BaseLanguageModel
            prompt: this.prompt.serialize(),
        };
    }
}
// eslint-disable-next-line max-len
const defaultTemplate = `The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Current conversation:
{history}
Human: {input}
AI:`;
const defaultPrompt = new PromptTemplate({
    template: defaultTemplate,
    inputVariables: ["history", "input"],
});
export class ConversationChain extends LLMChain {
    constructor(fields) {
        super({
            prompt: fields.prompt ?? defaultPrompt,
            llm: fields.llm,
            outputKey: fields.outputKey ?? "response",
        });
        this.memory = fields.memory ?? new BufferMemory();
    }
}
//# sourceMappingURL=llm_chain.js.map