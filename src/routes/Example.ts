import { FastifyApp, Services } from "../types/common";
import { ExampleBodyIRoute } from "../types/ExampleTypes";
import { ExampleBodySchema } from "../schemas/GeneratedSchemas";

export function initExampleRoutes(app: FastifyApp, {}: Services) {
  app.post<{
    //Querystring: LoginRoute
    //Headers: LoginRoute
    Body: ExampleBodyIRoute;
  }>(
    "/route",
    {
      schema: {
        body: ExampleBodySchema,
      },
    },
    async (req, res) => {
      let { example, arr } = req.body;

      return res.send({
        echo: { example, arr },
      });
    }
  );
}
