# node-ts-fastify-boilerplate

Boilerplate for starting node.js and typescript servers already with yarn.

_Current Node version targeted, v14+._

## Why?

I really hate boilerplates that throw a lot of stuff that you need to learn in, I like boilerplates that just stay out of the way and organize only what's really a pain in the ass. I hope this to be it.

## What's in the package!

- fastify 🚀
- fastify-swagger 📚
- **(NEW!)** Auto-documentation generated from typescript types! `generateSchemasFromTS.ts`
  - `yarn gen:schema`

## Installing

`npx degit pedropalhari/node-ts-fastify-boilerplate project_name`

## Commands

- `yarn start`: runs the distributed copy on `dist/index.js`
- `yarn dev`: starts the typescript compiler on watch mode (`tsc -w`)
  - in `tsconfig.json` you can set the properties on `outDir` and `rootDir`
- `yarn build`: builds the code, incrementally
- `yarn gen:schema`: generates JSON schema to be used for validation.

## How to use it!

To use this boilerplate fully, there's only a few rules to abide by:

### Creating a new **route**!

- Create a new file in `routes/`.

```ts
// routes/Example.ts
import { FastifyApp } from "../types/common";

export function initExampleRoutes(app: FastifyApp, service: {}) {
  app.post("/route", async (req, res) => {
    return res.send({
      echo: "not yet",
    });
  });
}
```

- Add it to `index.ts` to the `Router` with the prefix you want.

```ts
/**
 * Route array with prefixes
 */
const Routes = [
  {
    init: initExampleRoutes,
    prefix: "/user",
  },
];
```

### Creating validation for this route!

- Create a type in the `types/` folder. **The type must end in `IRoute!**
  - I'm using [typescript-json-schema](https://github.com/YousefED/typescript-json-schema), that is a little bit heavy on generating JSON schemas.

```ts
// types/ExampleTypes.d.ts
export interface Example {
  exampleParam: string;
}

export interface ExampleBodyIRoute {
  example: User;

  arr: string[];
}
```

- Run `yarn gen:schema`

  - For each `IRoute` type it will create a `.json` file on `schemas/`
  - It also compiles all schemas into `schemas/definitions.json` so we can use any types from the project, not any from the `types/` folder.

- Add the type and generated schema to the route:

```ts
// routes/Example.ts
import { FastifyApp } from "../types/common";
import { ExampleBodyIRoute } from "../types/ExampleTypes"; // Here!
import ExampleBodySchema from "../schemas/ExampleBody.json"; // Here!

export function initExampleRoutes(app: FastifyApp, service: {}) {
  app.post<{
    Body: ExampleBodyIRoute; // Here!
  }>(
    "/route",
    {
      schema: {
        body: ExampleBodySchema, // Here!
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
```

### **Tã dã!**

## Credits

_Made by me, for me, so I can build services faster. Feel free to use, expand and contact me!_
