import { VectorStore } from "./base.js";
import { Document } from "../document.js";

export class SupabaseVectorStore extends VectorStore {
constructor(client, embeddings, chatbotId, options = {}) {
    super(embeddings, options); // Pass options to the superclass
    Object.defineProperty(this, "client", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: client
    });
    Object.defineProperty(this, "tableName", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
    });
    Object.defineProperty(this, "queryName", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
    });
    Object.defineProperty(this, "chatbotId", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: chatbotId
    });
    this.tableName = options.tableName || "documents";
    this.queryName = options.queryName || "match_documents_v3";
}


    
    async addDocuments(documents, chatbotId) {
        const texts = documents.map(({ pageContent }) => pageContent);
        return this.addVectors(await this.embeddings.embedDocuments(texts), documents, chatbotId);
    }
    
    async addVectors(vectors, documents, chatbotId) {
        const rows = vectors.map((embedding, idx) => ({
            content: documents[idx].pageContent,
            embedding,
            metadata: documents[idx].metadata,
            chatbot_id: chatbotId, // Add chatbotId here
        }));
        const chunkSize = 500;
        for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            const res = await this.client.from(this.tableName).insert(chunk);
            if (res.error) {
                throw new Error(`Error inserting: ${res.error.message} ${res.status} ${res.statusText}`);
            }
        }
    }
    
    async similaritySearchVectorWithScore(query, k) {
        console.log('hey ', this.chatbotId)
        const matchDocumentsParams = {
            chatbot_id: this.chatbotId,
            query_embedding: query,
            match_count: k,
        };
        const { data: searches, error } = await this.client.rpc(this.queryName, matchDocumentsParams);
if (error) {
    console.error('RPC error:', error); // Log the error object
    throw new Error(`Error searching for documents: ${JSON.stringify(error, null, 2)}`);
}

        const result = searches.map((resp) => [
            new Document({
                metadata: resp.metadata,
                pageContent: resp.content,
            }),
            resp.similarity,
        ]);
        return result;
    }
    
    static async fromTexts(texts, metadatas, embeddings, { client, }) {
        const docs = [];
        for (let i = 0; i < texts.length; i += 1) {
            const newDoc = new Document({
                pageContent: texts[i],
                metadata: metadatas[i],
            });
            docs.push(newDoc);
        }
        return SupabaseVectorStore.fromDocuments(client, docs, embeddings);
    }
    
    static async fromDocuments(client, docs, embeddings, chatbotId) {
        const instance = new this(client, embeddings);
        await instance.addDocuments(docs, chatbotId);
        return instance;
    }
    
static async fromExistingIndex(client, embeddings, chatbotId, options = {}) {
    const instance = new this(client, embeddings, chatbotId, options);
    return instance;
}


}
//# sourceMappingURL=supabase.js.map
