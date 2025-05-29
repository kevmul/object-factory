/**
 * The Factory class allows for quick repeatable Model (objects)
 * to be instantiated quickly for testing purposes.
 *
 * To use, extend this class and include a `definition` function.
 * The `definition` will act as the blueprint for your Model.
 * You can then override any of the fields when calling `make` or `create`.
 *
 * @example
 * ```typescript
 * class UserFactory extends Factory<User> {
 *   definition(): User {
 *     return {
 *       name: 'John Doe',
 *       email: 'john@example.com'
 *     };
 *   }
 * }
 * ```
 * @type Model Generic type. Include this when creating a child factory.
 */
export abstract class Factory<Model> {
  private stateCallbacks: Array<(model: Model) => Model> = [];
  private instances: number = 1;

  constructor() {
    if (new.target === Factory) {
      throw new Error('Abstract class cannot be instantiated directly.');
    }
  }

  /**
   * Set the number of instances you wish to instantiate.
   */
  public count(amount: number): this {
    if (amount < 1) {
      throw new Error('Count must be greater than 0');
    }
    this.instances = amount;
    return this;
  }

  /**
   * Make a set number of factory made models.
   *
   * @param overrides Pass in an object to override the blueprint
   * @returns Model[]
   */
  public make(overrides: Partial<Model> = {}): Model[] {
    try {
      const output: Model[] = [];
      for (let i = 0; i < this.instances; i++) {
        const model = Object.assign<Partial<Model>, Partial<Model>>(
          this.definition() as Model,
          overrides
        );

        // Apply state callbacks in order
        const finalModel = this.stateCallbacks.reduce(
          (acc, callback) => callback(acc),
          model as Model
        );

        output.push(finalModel);
      }

      // Reset state callbacks after making instances
      this.stateCallbacks = [];
      this.instances = 1;

      return output;
    } catch (error) {
      throw new Error(
        `Failed to make model: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Make a single instance and return it directly instead of in an array
   */
  public makeOne(overrides: Partial<Model> = {}): Model {
    return this.make(overrides)[0];
  }

  /**
   * Create and store within a database a set number of factory made models.
   *
   * @param overrides Pass in an object to override the blueprint
   * @returns Model[]
   */
  public create(_overrides: Partial<Model> = {}): Model[] {
    throw new Error('Must implement the DB layer to use Create.');
  }

  /**
   * Create a single instance and store it in the database
   */
  public createOne(overrides: Partial<Model> = {}): Model {
    return this.create(overrides)[0];
  }

  /**
   * Override a state with a custom callback
   */
  public state(callback: (attributes: Model) => Model): this {
    this.stateCallbacks.push(callback);
    return this;
  }

  /**
   * This method must be defined in your child class.
   * The returned Model object should be a blueprint
   * for the model being instantiated.
   */
  protected abstract definition(): Model;
}

/* ===============================================
 * New Factory Template
 * =============================================*/

// import { Factory } from './factory.js';
// import { faker } from '@faker-js/faker';

// class <your-factory>FactoryClass extends Factory<your-interface> {
//   /**
//    * This is the blueprint for the factory to default to.
//    * When not passing any overrides within `make` or `create`
//    * The factory will use these values when instanciating the objects
//    */
//   public definition(): <your-interface> {
//     return {
//       // <your-key-value-pairs>
//     };
//   }

//   /**
//    * Setup a state to quickly override the definition.
//    * This is just an example.
//    */
//   public newState() {
//     return this.state((attributes: <your-interface>) => {
//       return Object.assign(attributes, {
//         <your-key>: <your-value>,
//       });
//     });
//   }
// }

// /**
//  * Export the class here so we don't need the `.prototype`
//  */
// export const <your-factory>Factory = new <your-factory>FactoryClass();
