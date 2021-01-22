import { FastifyLoggerInstance } from "fastify";
import { FastifyInstance } from "fastify/types/instance";
import { Server, IncomingMessage, ServerResponse } from "http";

// Helper for fastify, much more compact
export type FastifyApp = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyLoggerInstance
>;

// Helper for Route, considering services
export interface Route {
  init: (app: FastifyApp, services: Services) => void;
  prefix: string;
}

export interface Services {}
