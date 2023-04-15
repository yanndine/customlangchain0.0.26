import { ChainValues, BaseChain } from "../chains/index.js";
import { Agent, Tool, StoppingMethod } from "./index.js";
import { SerializedLLMChain } from "../chains/llm_chain.js";
type AgentExecutorInput = {
    agent: Agent;
    tools: Tool[];
    returnIntermediateSteps?: boolean;
    maxIterations?: number;
    earlyStoppingMethod?: StoppingMethod;
};
/**
 * A chain managing an agent using tools.
 * @augments BaseChain
 */
export declare class AgentExecutor extends BaseChain {
    agent: Agent;
    tools: Tool[];
    returnIntermediateSteps: boolean;
    maxIterations?: number;
    earlyStoppingMethod: StoppingMethod;
    get inputKeys(): string[];
    constructor(input: AgentExecutorInput);
    /** Create from agent and a list of tools. */
    static fromAgentAndTools(fields: {
        agent: Agent;
        tools: Tool[];
    } & Record<string, any>): AgentExecutor;
    private shouldContinue;
    _call(inputs: ChainValues): Promise<ChainValues>;
    _chainType(): "agent_executor";
    serialize(): SerializedLLMChain;
}
export {};
