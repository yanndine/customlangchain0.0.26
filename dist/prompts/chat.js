import { BasePromptTemplate, } from "./base.js";
import { DEFAULT_FORMATTER_MAPPING } from "./template.js";
import { AIChatMessage, BasePromptValue, ChatMessage, HumanChatMessage, SystemChatMessage, } from "../schema/index.js";
import { PromptTemplate } from "./prompt.js";
export class BaseMessagePromptTemplate {
}
export class MessagesPlaceholder extends BaseMessagePromptTemplate {
    constructor(variableName) {
        super();
        Object.defineProperty(this, "variableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.variableName = variableName;
    }
    get inputVariables() {
        return [this.variableName];
    }
    formatMessages(values) {
        return Promise.resolve(values[this.variableName]);
    }
}
export class BaseMessageStringPromptTemplate extends BaseMessagePromptTemplate {
    constructor(prompt) {
        super();
        Object.defineProperty(this, "prompt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.prompt = prompt;
    }
    get inputVariables() {
        return this.prompt.inputVariables;
    }
    async formatMessages(values) {
        return [await this.format(values)];
    }
}
export class ChatMessagePromptTemplate extends BaseMessageStringPromptTemplate {
    async format(values) {
        return new ChatMessage(await this.prompt.format(values), this.role);
    }
    constructor(prompt, role) {
        super(prompt);
        Object.defineProperty(this, "role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.role = role;
    }
    static fromTemplate(template, role) {
        return new this(PromptTemplate.fromTemplate(template), role);
    }
}
export class HumanMessagePromptTemplate extends BaseMessageStringPromptTemplate {
    async format(values) {
        return new HumanChatMessage(await this.prompt.format(values));
    }
    constructor(prompt) {
        super(prompt);
    }
    static fromTemplate(template) {
        return new this(PromptTemplate.fromTemplate(template));
    }
}
export class AIMessagePromptTemplate extends BaseMessageStringPromptTemplate {
    async format(values) {
        return new AIChatMessage(await this.prompt.format(values));
    }
    constructor(prompt) {
        super(prompt);
    }
    static fromTemplate(template) {
        return new this(PromptTemplate.fromTemplate(template));
    }
}
export class SystemMessagePromptTemplate extends BaseMessageStringPromptTemplate {
    async format(values) {
        return new SystemChatMessage(await this.prompt.format(values));
    }
    constructor(prompt) {
        super(prompt);
    }
    static fromTemplate(template) {
        return new this(PromptTemplate.fromTemplate(template));
    }
}
export class ChatPromptValue extends BasePromptValue {
    constructor(messages) {
        super();
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.messages = messages;
    }
    toString() {
        return JSON.stringify(this.messages);
    }
    toChatMessages() {
        return this.messages;
    }
}
export class ChatPromptTemplate extends BasePromptTemplate {
    constructor(input) {
        super(input);
        Object.defineProperty(this, "promptMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "templateFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "f-string"
        });
        Object.defineProperty(this, "validateTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.assign(this, input);
        if (this.validateTemplate) {
            if (!(this.templateFormat in DEFAULT_FORMATTER_MAPPING)) {
                const validFormats = Object.keys(DEFAULT_FORMATTER_MAPPING);
                throw new Error(`Invalid template format. Got \`${this.templateFormat}\`;
                         should be one of ${validFormats}`);
            }
            const inputVariables = new Set();
            for (const promptMessage of this.promptMessages) {
                for (const inputVariable of promptMessage.inputVariables) {
                    inputVariables.add(inputVariable);
                }
            }
            const difference = new Set([...this.inputVariables].filter((x) => !inputVariables.has(x)));
            if (difference.size > 0) {
                throw new Error(`Input variables \`${[
                    ...difference,
                ]}\` are not used in any of the prompt messages.`);
            }
            const thisInputVariables = new Set(this.inputVariables);
            const otherDifference = new Set([...inputVariables].filter((x) => !thisInputVariables.has(x)));
            if (otherDifference.size > 0) {
                throw new Error(`Input variables \`${[
                    ...otherDifference,
                ]}\` are used in prompt messages but not in the prompt template.`);
            }
        }
    }
    _getPromptType() {
        return "chat";
    }
    async format(values) {
        return (await this.formatPromptValue(values)).toString();
    }
    async formatPromptValue(values) {
        let resultMessages = [];
        for (const promptMessage of this.promptMessages) {
            const inputValues = {};
            for (const inputVariable of promptMessage.inputVariables) {
                if (!(inputVariable in values)) {
                    throw new Error(`Missing value for input variable \`${inputVariable}\``);
                }
                inputValues[inputVariable] = values[inputVariable];
            }
            const message = await promptMessage.formatMessages(inputValues);
            resultMessages = resultMessages.concat(message);
        }
        return new ChatPromptValue(resultMessages);
    }
    serialize() {
        return {
            input_variables: this.inputVariables,
            output_parser: this.outputParser?.serialize(),
            template_format: this.templateFormat,
            prompt_messages: this.promptMessages,
        };
    }
    async partial(_) {
        throw new Error("ChatPromptTemplate.partial() not yet implemented");
    }
    static fromPromptMessages(promptMessages) {
        const inputVariables = new Set();
        for (const promptMessage of promptMessages) {
            for (const inputVariable of promptMessage.inputVariables) {
                inputVariables.add(inputVariable);
            }
        }
        return new ChatPromptTemplate({
            inputVariables: [...inputVariables],
            promptMessages,
        });
    }
}
//# sourceMappingURL=chat.js.map