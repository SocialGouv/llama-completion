import * as dotenv from "dotenv"
dotenv.config()

import Fastify from "fastify"
import Completion from "./api/completion"

const fastify = Fastify({
  logger: true,
})

fastify.get("/api/completion", Completion)
fastify.get("/api/healthz", async () => ({ success: true }))

const port = parseInt(process.env.PORT || "") || 3000

fastify.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) throw err
  console.log(`✅ API running on port ${port}`)
})
