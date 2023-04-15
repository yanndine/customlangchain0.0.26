import { DirectoryLoader } from "./directory.js";
import { TextLoader } from "./text.js";
export class NotionLoader extends DirectoryLoader {
    constructor(directoryPath) {
        super(directoryPath, {
            ".md": (filePath) => new TextLoader(filePath),
        });
    }
}
//# sourceMappingURL=notion_markdown.js.map