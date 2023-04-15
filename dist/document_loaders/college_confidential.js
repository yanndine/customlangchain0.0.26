import { Document } from "../document.js";
import { CheerioWebBaseLoader } from "./cheerio_web_base.js";
export class CollegeConfidentialLoader extends CheerioWebBaseLoader {
    constructor(webPath) {
        super(webPath);
    }
    async load() {
        const $ = await this.scrape();
        const text = $("main[class='skin-handler']").text();
        const metadata = { source: this.webPath };
        return [new Document({ pageContent: text, metadata })];
    }
}
//# sourceMappingURL=college_confidential.js.map