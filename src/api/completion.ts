import type { FastifyRequest, FastifyReply } from "fastify"

import { createCompletion } from "../lib/llama-completion"

export default async function Completion(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { text } = request.query as Record<string, string>

  const answer = await createCompletion(text)
  console.log("ANSWER", answer)
  reply.send({ answer })
}
