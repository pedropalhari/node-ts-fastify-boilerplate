import swagger from "fastify-swagger";
import { FastifyApp } from "../types/common";
import * as fastify from "fastify";

// Compiled definitions
import definitionsSchema from "../schemas/definitions.json";

export function initDocumentation(app: FastifyApp, version: string) {
  app.register(swagger, {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "Auth API",
        description: "Documentation for the Auth API",
        version,
      },
      // host: "localhost",
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      /**
       * Inject compiled definitions here!
       */
      definitions: {
        ...(definitionsSchema.definitions as {
          [definitionsName: string]: fastify.FastifySchema;
        }),
      },
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
      },
    },
    exposeRoute: true,
  });

  console.log(`Documentation started at /docs!`);
}
