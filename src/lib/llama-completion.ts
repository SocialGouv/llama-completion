import * as dotenv from "dotenv"
dotenv.config()

import path from "path"
import { LLama } from "llama-node"
import { LLamaCpp, LoadConfig } from "llama-node/dist/llm/llama-cpp.js"

if (!process.env.LLAMA_MODEL) {
  throw new Error("process.env.LLAMA_MODEL is undefined")
}

const llama = new LLama(LLamaCpp)

const model = path.resolve(process.cwd(), process.env.LLAMA_MODEL || "")

const config: LoadConfig = {
  path: model,
  enableLogging: true,
  nCtx: 1024,
  nParts: -1,
  seed: 0,
  f16Kv: false,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: false,
  useMmap: true,
}

llama.load(config)

export async function createCompletion(message: string) {
  const prompt = `A chat between a curious human and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the human's questions.

### Human: Hello, Assistant.
### Assistant: Hello. How may I help you today?
### Human: Please tell me the largest city in Europe.
### Assistant: Sure. The largest city in Europe is Moscow, the capital of Russia.
### Human: ${message}`

  console.log("PROMPT:", prompt)

  const params = {
    nThreads: 4,
    nTokPredict: 2048,
    topK: 40,
    topP: 0.1,
    temp: 0.2,
    repeatPenalty: 1,
    prompt,
  }

  return new Promise((resolve) => {
    let result = ""

    llama.createCompletion(params, (response) => {
      console.log("token:", response.token)
      result += response.token
      if (response.completed) {
        resolve(result)
      }
    })
  })
}
