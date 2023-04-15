export type LLMCallbackManager = {
    handleStart?: (llm: {
        name: string;
    }, prompts: string[], verbose?: boolean) => void;
    handleNewToken?: (token: string, verbose?: boolean) => void;
    handleError?: (err: string, verbose?: boolean) => void;
    handleEnd?: (output: LLMResult, verbose?: boolean) => void;
};
/**
 * Output of a single generation.
 */
export interface Generation {
    /**
     * Generated text output
     */
    text: string;
    /**
     * Raw generation info response from the provider.
     * May include things like reason for finishing (e.g. in {@link OpenAI})
     */
    generationInfo?: Record<string, any>;
}
/**
 * Contains all relevant information returned by an LLM.
 */
export type LLMResult = {
    /**
     * List of the things generated. Each input could have multiple {@link Generation | generations}, hence this is a list of lists.
     */
    generations: Generation[][];
    /**
     * Dictionary of arbitrary LLM-provider specific output.
     */
    llmOutput?: Record<string, any>;
};
export type MessageType = "human" | "ai" | "generic" | "system";
export declare abstract class BaseChatMessage {
    /** The text of the message. */
    text: string;
    /** The type of the message. */
    abstract _getType(): MessageType;
    constructor(text: string);
}
export declare class HumanChatMessage extends BaseChatMessage {
    _getType(): MessageType;
}
export declare class AIChatMessage extends BaseChatMessage {
    _getType(): MessageType;
}
export declare class SystemChatMessage extends BaseChatMessage {
    _getType(): MessageType;
}
export declare class ChatMessage extends BaseChatMessage {
    role: string;
    constructor(text: string, role: string);
    _getType(): MessageType;
}
export interface ChatGeneration extends Generation {
    message: BaseChatMessage;
}
export interface ChatResult {
    generations: ChatGeneration[];
    llmOutput?: Record<string, any>;
}
/**
 * Base PromptValue class. All prompt values should extend this class.
 */
export declare abstract class BasePromptValue {
    abstract toString(): string;
    abstract toChatMessages(): BaseChatMessage[];
}
/**
 * Base class for language models.
 */
export declare abstract class BaseLanguageModel {
    abstract generatePrompt(promptValues: BasePromptValue[], stop?: string[]): Promise<LLMResult>;
    abstract _modelType(): string;
    abstract getNumTokens(text: string): number;
}
