# Factory Demo

Run `npm run test` to run the tests.

The _Factory_ is a helper builder to spin up objects very quickly for Testing.
Each child factory can define itself and have stateful overrides to help with readability.

The Factories are loosly based on Laravel's factory.

### Definition

The definition is the blueprint of the object you wish to build. This will be an object and should contain all the fields of your model.

The definition will always return the same data throughout your tests. If you need a specific value to test against, you can pass in `overrides` to the `make`, `makeOne`, `create` or `createOne` methods.

```ts
const example = ExampleFactory.make({ name: "Updated Name" });
```

### Make / Create

To spin up a factory, we can call `make`, `makeOne`, `create`, and `createOne`. These methods will be the last in the call chain.

`make` will create a single model and return it in an array.
`makeOne` calls `make` under the hood, but returns the first model in the array.

`create` will create a single model and store it in the database directly. This too will be an array. (WORK IN PROGRESS)
`createOne` calls `create` under the hood and returns the first model in the array. (WORK IN PROGRESS)

> ! WARNING: `create` and `createOne` do not currently work and will throw an error when using them

### Count

Sometimes you would want to spin up multiple of the same object. This is where `count` can set the number of models the factory spits out.

```ts
const examples = ExampleFactory.count(3).make(); // [{...}, {...}, {...}] (3 objects)
```

### States

States are functions to call that helps with readability. Instead of directly updating the values through the `make` or `create` methods, we can call readable "State" functions.

Imagine we have a `validatedAt` column that we store a date on. This field would have a default value of `Date.now()` or something similar. But if we wished to test against models that were validated, and others that were not validated, the code could look like this:

```ts
// Validated Example
const example1 = ExampleFactory.make(); // validatedAt: 2024_01_23

// Unvalidated Example
const example2 = ExampleFactory.make({ validatedAt: null }); // validatedAt: null
```

A state could make this a little more readable and quicker to implement in tests going forward

```ts
// Validated Example
const example1 = ExampleFactory.make(); // validatedAt: 2024_01_23

// Unvalidated Example
const example2 = ExampleFactory.unvalidated().make(); // validatedAt: null
```
