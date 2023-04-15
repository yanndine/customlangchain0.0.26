import { ChainValues } from "../chains/index.js";
import { SerializedZeroShotAgent, AgentAction, AgentFinish, AgentStep, StoppingMethod, Tool } from "./index.js";
import { BaseLLM } from "../llms/index.js";
import { LLMChain } from "../chains/llm_chain.js";
import { BasePromptTemplate } from "../prompts/index.js";
export interface StaticAgent {
    /**
     * Create a prompt for this class
     *
     * @param tools - List of tools the agent will have access to, used to format the prompt.
     * @param fields - Additional fields used to format the prompt.
     *
     * @returns A PromptTemplate assembled from the given tools and fields.
     * */
    createPrompt(tools: Tool[], fields?: Record<string, any>): BasePromptTemplate;
    /** Construct an agent from an LLM and a list of tools */
    fromLLMAndTools(llm: BaseLLM, tools: Tool[], args?: Record<string, any>): Agent;
    validateTools(_: Tool[]): void;
}
export declare const staticImplements: <T>(_: T) => void;
type SerializedAgent = SerializedZeroShotAgent;
export interface AgentInput {
    llmChain: LLMChain;
    allowedTools?: string[];
}
/**
 * Class responsible for calling a language model and deciding an action.
 *
 * @remarks This is driven by an LLMChain. The prompt in the LLMChain *must*
 * include a variable called "agent_scratchpad" where the agent can put its
 * intermediary work.
 */
export declare abstract class Agent {
    llmChain: LLMChain;
    allowedTools?: string[];
    returnValues: string[];
    get inputKeys(): string[];
    constructor(input: AgentInput);
    /**
     * Extract tool and tool input from LLM output.
     */
    abstract extractToolAndInput(input: string): {
        tool: string;
        input: string;
    } | null;
    /**
     * Prefix to append the observation with.
     */
    abstract observationPrefix(): string;
    /**
     * Prefix to append the LLM call with.
     */
    abstract llmPrefix(): string;
    /**
     * Return the string type key uniquely identifying this class of agent.
     */
    abstract _agentType(): string;
    /**
     * Prepare the agent for a new call, if needed
     */
    prepareForNewCall(): void;
    /**
     * Validate that appropriate tools are passed in
     */
    static validateTools(_: Tool[]): void;
    _stop(): string[];
    /**
     * Name of tool to use to terminate the chain.
     */
    finishToolName(): string;
    /**
     * Construct a scratchpad to let the agent continue its thought process
     */
    constructScratchPad(steps: AgentStep[]): string;
    private _plan;
    /**
     * Decide what to do given some input.
     *
     * @param steps - Steps the LLM has taken so far, along with observations from each.
     * @param inputs - User inputs.
     *
     * @returns Action specifying what tool to use.
     */
    plan(steps: AgentStep[], inputs: ChainValues): Promise<AgentAction | AgentFinish>;
    /**
     * Return response when agent has been stopped due to max iterations
     */
    returnStoppedResponse(earlyStoppingMethod: StoppingMethod, steps: AgentStep[], inputs: ChainValues): Promise<AgentFinish>;
    /**
     * Load an agent from a json-like object describing it.
     */
    static deserialize(data: SerializedAgent & {
        llm?: BaseLLM;
        tools?: Tool[];
    }): Promise<Agent>;
}
export {};
