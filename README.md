# node-ts-fastify-boilerplate

Boilerplate for starting node.js and typescript servers already with yarn.

_Current Node version targeted, v14+._

## Why?

I really hate boilerplates that throw a lot of stuff that you need to learn in, I like boilerplates that just stay out of the way and organize only what's really a pain in the ass. I hope this to be it.

## What's in the package!

- fastify 🚀
- fastify-swagger 📚
- **(NEW!)** Auto-documentation generated from typescript types! `generateSchemasFromTS.ts` 🤯
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
// index.ts
/**
 * Route array with prefixes
 */
const Routes: Route[] = [
  {
    init: initExampleRoutes,
    prefix: "/example",
  },
];
```

### Creating validation for this route!

- Create a type in the `types/` folder. **The type must end in `IRoute`!**
  - I'm using [typescript-json-schema](https://github.com/YousefED/typescript-json-schema), that is a little bit heavy on generating JSON schemas.

```ts
// types/ExampleTypes.d.ts
export interface Example {
  exampleParam: string;
}

export interface ExampleBodyIRoute {
  example: Example;

  arr: string[];
}
```

- Run `yarn gen:schema`

  - For each `IRoute` type it will create a `.json` file on `schemas/`
  - It also compiles all schemas into `schemas/definitions.json` so we can use any types from the project, not any from the `types/` folder.
  - And for the last part it adds a nice import map so you can do `{type}Schema` and autocomplete.

- Add the type and generated schema to the route:

```ts
// routes/Example.ts
import { FastifyApp } from "../types/common";
import { ExampleBodyIRoute } from "../types/ExampleTypes"; // <-- Here!
import { ExampleBodySchema } from "../schemas/GeneratedSchemas";

export function initExampleRoutes(app: FastifyApp, {}: Services) {
  app.post<{
    Body: ExampleBodyIRoute; // <-- Here!
  }>(
    "/route",
    {
      schema: {
        body: ExampleBodySchema, // <-- Here!
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

## Useful `services`

### MongoDB

```ts
// services/Mongo.ts
import { Collection, MongoClient } from "mongodb";

// Connection URL
const URL = "mongodb://localhost:27017";

// Database Name
const dbName = "myproject";

interface User {
  username: string;
  password: string;
}

interface Email {
  recipient: string;
  delay: number;
}

export interface DBCollections {
  user: Collection<User>;
  emails: Collection<Email>;
}

export async function initMongoDB(): Promise<DBCollections> {
  // Create a new MongoClient
  const client = new MongoClient(URL);
  await client.connect();
  const db = client.db(dbName);

  return {
    user: db.collection("user"),
    emails: db.collection("email"),
  };
}
```

Then on `types/common.d.ts`, `index.ts` and the `routes/*.ts`

```ts
//types/common.d.ts
export interface Services {
  db: DBCollections;
}

//index.ts
async function main() {
  initDocumentation(app, API_VERSION);
  let db = await initMongoDB(); // <-- Here!

  //...
  // Initialize all the routes in the array, passing the db for
  // operations and the app for creating handlers
  Routes.forEach((route) => {
    app.register((app, opts, done) => {
      route.init(app, { db }); // <-- Here!
      //...
    });
  });
}

// routes/*.ts
export function initExampleRoutes(app: FastifyApp, { db }: Services) {
  //...
  let queryResult = await db.user.findOne({});
}
```

## Credits

_Made by me, for me, so I can build services faster. Feel free to use, expand and contact me!_
