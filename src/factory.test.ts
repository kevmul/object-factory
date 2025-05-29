import { describe, expect, expectTypeOf, test } from 'vitest';
import { Factory } from './factory.js';

/** A test factory interface */
interface ITestFactory {
  example: string;
  state?: string;
}

/** Spin up a test factory for this test */
class TestFactoryClass extends Factory<ITestFactory> {
  /** The blueprint for our TestFactory */
  protected definition(): ITestFactory {
    return {
      example: 'I AM AN EXAMPLE',
    };
  }

  /** A test state for our TestFactory */
  public exampleState() {
    return this.state((attributes: ITestFactory) => {
      return Object.assign(attributes, {
        state: 'This was an example state!',
      });
    });
  }
}

/** Instantiate the TestFactoryClass */
const TestFactory = new TestFactoryClass();

describe('Factory', () => {
  test('the base factory class can not be called directly', () => {
    /** @ts-expect-error | Abstract class should not be called directly */
    expect(() => new Factory()).toThrow(
      'Abstract class cannot be instantiated directly.'
    );
  });

  describe('Make', () => {
    test('a factory can make a model', () => {
      expect(TestFactory.makeOne()).toEqual({
        example: 'I AM AN EXAMPLE',
      });
    });

    test('a factory can be given overrides', () => {
      expect(TestFactory.makeOne({ example: 'FooBar' })).toEqual({
        example: 'FooBar',
      });
    });
  });

  describe('Count', () => {
    test('a factory can make several models', () => {
      const models = TestFactory.count(3).make();
      expect(models).toHaveLength(3);
    });

    test('throws error for invalid count', () => {
      expect(() => TestFactory.count(0).make()).toThrow(
        'Count must be greater than 0'
      );
    });
  });

  describe('State', () => {
    test('a factory can create a State for common test scenarios', () => {
      const model = TestFactory.exampleState().makeOne();
      expect(model.state).toEqual('This was an example state!');
    });

    test('states are cleared after make', () => {
      TestFactory.exampleState().makeOne();
      const model = TestFactory.makeOne();
      expect(model.state).toBeUndefined();
    });
  });

  describe('Type', () => {
    test('a factory should know its own type', () => {
      const model = TestFactory.makeOne();
      expectTypeOf(model).toEqualTypeOf<ITestFactory>();
    });
  });
});
