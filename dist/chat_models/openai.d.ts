import { CreateChatCompletionRequest, ConfigurationParameters } from "openai";
import { BaseChatModel } from "./base.js";
import { BaseChatMessage, ChatResult, LLMCallbackManager } from "../schema/index.js";
interface ModelParams {
    /** Sampling temperature to use, between 0 and 2, defaults to 1 */
    temperature: number;
    /** Total probability mass of tokens to consider at each step, between 0 and 1, defaults to 1 */
    topP: number;
    /** Penalizes repeated tokens according to frequency */
    frequencyPenalty: number;
    /** Penalizes repeated tokens */
    presencePenalty: number;
    /** Number of chat completions to generate for each prompt */
    n: number;
    /** Dictionary used to adjust the probability of specific tokens being generated */
    logitBias?: Record<string, number>;
    /** Whether to stream the results or not */
    streaming: boolean;
    /**
     * Maximum number of tokens to generate in the completion. -1 returns as many
     * tokens as possible given the prompt and the model's maximum context size.
     */
    maxTokens: number;
}
/**
 * Input to OpenAI class.
 * @augments ModelParams
 */
interface OpenAIInput extends ModelParams {
    /** Model name to use */
    modelName: string;
    /** Holds any additional parameters that are valid to pass to {@link
     * https://platform.openai.com/docs/api-reference/completions/create |
     * `openai.create`} that are not explicitly specified on this class.
     */
    modelKwargs?: Kwargs;
    /** Maximum number of retries to make when generating */
    maxRetries: number;
    /** List of stop words to use when generating */
    stop?: string[];
}
type Kwargs = Record<string, any>;
/**
 * Wrapper around OpenAI large language models that use the Chat endpoint.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://platform.openai.com/docs/api-reference/chat/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 *
 * @augments BaseLLM
 * @augments OpenAIInput
 */
export declare class ChatOpenAI extends BaseChatModel implements OpenAIInput {
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    n: number;
    logitBias?: Record<string, number>;
    modelName: string;
    modelKwargs?: Kwargs;
    maxRetries: number;
    stop?: string[];
    streaming: boolean;
    maxTokens: number;
    private batchClient;
    private streamingClient;
    private clientConfig;
    constructor(fields?: Partial<OpenAIInput> & {
        callbackManager?: LLMCallbackManager;
        concurrency?: number;
        cache?: boolean;
        verbose?: boolean;
        openAIApiKey?: string;
    }, configuration?: ConfigurationParameters);
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams(): Omit<CreateChatCompletionRequest, "messages"> & Kwargs;
    _identifyingParams(): {
        apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
        organization?: string | undefined;
        username?: string | undefined;
        password?: string | undefined;
        accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: string[] | undefined) => string) | ((name?: string | undefined, scopes?: string[] | undefined) => Promise<string>) | undefined;
        basePath?: string | undefined;
        baseOptions?: any;
        formDataCtor?: (new () => any) | undefined;
        stop?: import("openai").CreateChatCompletionRequestStop | undefined;
        model: string;
        temperature?: number | null | undefined;
        top_p?: number | null | undefined;
        n?: number | null | undefined;
        stream?: boolean | null | undefined;
        max_tokens?: number | undefined;
        presence_penalty?: number | null | undefined;
        frequency_penalty?: number | null | undefined;
        logit_bias?: object | null | undefined;
        user?: string | undefined;
        model_name: string;
    };
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams(): {
        apiKey?: string | Promise<string> | ((name: string) => string) | ((name: string) => Promise<string>) | undefined;
        organization?: string | undefined;
        username?: string | undefined;
        password?: string | undefined;
        accessToken?: string | Promise<string> | ((name?: string | undefined, scopes?: string[] | undefined) => string) | ((name?: string | undefined, scopes?: string[] | undefined) => Promise<string>) | undefined;
        basePath?: string | undefined;
        baseOptions?: any;
        formDataCtor?: (new () => any) | undefined;
        stop?: import("openai").CreateChatCompletionRequestStop | undefined;
        model: string;
        temperature?: number | null | undefined;
        top_p?: number | null | undefined;
        n?: number | null | undefined;
        stream?: boolean | null | undefined;
        max_tokens?: number | undefined;
        presence_penalty?: number | null | undefined;
        frequency_penalty?: number | null | undefined;
        logit_bias?: object | null | undefined;
        user?: string | undefined;
        model_name: string;
    };
    /**
     * Call out to OpenAI's endpoint with k unique prompts
     *
     * @param messages - The messages to pass into the model.
     * @param [stop] - Optional list of stop words to use when generating.
     *
     * @returns The full LLM output.
     *
     * @example
     * ```ts
     * import { OpenAI } from "langchain/llms";
     * const openai = new OpenAI();
     * const response = await openai.generate(["Tell me a joke."]);
     * ```
     */
    _generate(messages: BaseChatMessage[], stop?: string[]): Promise<ChatResult>;
    /** @ignore */
    completionWithRetry(request: CreateChatCompletionRequest): Promise<import("axios").AxiosResponse<import("openai").CreateChatCompletionResponse, any>>;
    _llmType(): string;
}
export {};
