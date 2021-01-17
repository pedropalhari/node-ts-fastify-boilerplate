/**
 * For constructing schemas, check:
 * @see https://github.com/YousefED/typescript-json-schema/blob/master/api.md
 */

/**
 * This Example interface can be anywhere in your project
 */
export interface Example {
  exampleParam: string;
}

export interface ExampleBodyIRoute {
  example: Example;

  arr: string[];
}
