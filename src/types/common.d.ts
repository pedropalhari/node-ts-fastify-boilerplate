import { FastifyLoggerInstance } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import { Server, IncomingMessage, ServerResponse } from "http";

export type FastifyApp = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
>;

