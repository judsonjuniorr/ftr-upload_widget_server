import { env } from '@/env'
import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.validation })
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: '*' })

server.register(uploadImageRoute)

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server running!')
})
