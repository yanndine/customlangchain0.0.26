import { getBufferString } from "./base.js";
import { BaseChatMemory } from "./chat_memory.js";
export class BufferWindowMemory extends BaseChatMemory {
    constructor(fields) {
        super({ returnMessages: fields?.returnMessages ?? false });
        Object.defineProperty(this, "humanPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Human"
        });
        Object.defineProperty(this, "aiPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AI"
        });
        Object.defineProperty(this, "memoryKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "history"
        });
        Object.defineProperty(this, "k", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        this.humanPrefix = fields?.humanPrefix ?? this.humanPrefix;
        this.aiPrefix = fields?.aiPrefix ?? this.aiPrefix;
        this.memoryKey = fields?.memoryKey ?? this.memoryKey;
        this.k = fields?.k ?? this.k;
    }
    async loadMemoryVariables(_values) {
        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: this.chatHistory.messages.slice(-this.k * 2),
            };
            return result;
        }
        const result = {
            [this.memoryKey]: getBufferString(this.chatHistory.messages.slice(-this.k * 2)),
        };
        return result;
    }
}
//# sourceMappingURL=buffer_window_memory.js.map