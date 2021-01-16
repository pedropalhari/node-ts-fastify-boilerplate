import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import fs from "fs/promises";
import rimraf from "rimraf";

/**
 * File that reads *IRoute types from types/
 * and generates schemas for it
 */

const BASE_PATH = "./src/types";

(async () => {
  // Read all files on base_path, there should be only router files
  let allTypeFiles = await fs.readdir(BASE_PATH);
  allTypeFiles = allTypeFiles.filter((file) => file.endsWith(".ts"));

  // Create a runner and a generator for transforming .ts into json schemas
  // pass, all .ts files into it
  const TJSProgram = TJS.getProgramFromFiles(
    allTypeFiles.map((fileName) => resolve(`${BASE_PATH}/${fileName}`)),
    //typescript compiler flags so we can traverse any module
    {
      resolveJsonModule: true,
      esModuleInterop: true,
    }
  );

  const TJSGenerator = TJS.buildGenerator(
    TJSProgram,
    {}
  ) as TJS.JsonSchemaGenerator;

  // Get all the symbols and filter them to only generate schemas
  // from Route symbols
  let TJSSymbols = TJSGenerator.getUserSymbols();
  let symbolsFiltered = TJSSymbols.filter((s) => s.endsWith("IRoute"));

  // Temporary folder for schemas
  await fs.mkdir("./src/schemas_temp");

  // Generate all the schemas
  await Promise.all(
    symbolsFiltered.map(async (s) => {
      let schema = TJSGenerator.getSchemaForSymbol(s);

      let schemaName = s.replace("IRoute", "");

      console.log(`Generated ${schemaName}.json`);

      await fs.writeFile(
        `./src/schemas_temp/${schemaName}.json`,
        JSON.stringify(schema)
      );
    })
  );

  /**
   * For fastify-swagger we need to put definitions on the initialization, that's why we merge all
   * types and inject them in a .json to be used in the initialization of the service.
   *
   * In that way, referencing types from $ref work nicely!
   */
  let allSchemas = TJSGenerator.getSchemaForSymbols(symbolsFiltered);
  await fs.writeFile(
    `./src/schemas_temp/definitions.json`,
    JSON.stringify(allSchemas)
  );

  // Delete all schemas and move temporary folder as main folder
  await new Promise((res) => rimraf("./src/schemas", res));
  await fs.rename("./src/schemas_temp", "./src/schemas");
})();
