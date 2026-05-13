
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model TestRun
 * 
 */
export type TestRun = $Result.DefaultSelection<Prisma.$TestRunPayload>
/**
 * Model TestCase
 * 
 */
export type TestCase = $Result.DefaultSelection<Prisma.$TestCasePayload>
/**
 * Model ConversationMessage
 * 
 */
export type ConversationMessage = $Result.DefaultSelection<Prisma.$ConversationMessagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Posts
 * const posts = await prisma.post.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Posts
   * const posts = await prisma.post.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.testRun`: Exposes CRUD operations for the **TestRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TestRuns
    * const testRuns = await prisma.testRun.findMany()
    * ```
    */
  get testRun(): Prisma.TestRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.testCase`: Exposes CRUD operations for the **TestCase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TestCases
    * const testCases = await prisma.testCase.findMany()
    * ```
    */
  get testCase(): Prisma.TestCaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversationMessage`: Exposes CRUD operations for the **ConversationMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConversationMessages
    * const conversationMessages = await prisma.conversationMessage.findMany()
    * ```
    */
  get conversationMessage(): Prisma.ConversationMessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Post: 'Post',
    TestRun: 'TestRun',
    TestCase: 'TestCase',
    ConversationMessage: 'ConversationMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "post" | "testRun" | "testCase" | "conversationMessage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      TestRun: {
        payload: Prisma.$TestRunPayload<ExtArgs>
        fields: Prisma.TestRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TestRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TestRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>
          }
          findFirst: {
            args: Prisma.TestRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TestRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>
          }
          findMany: {
            args: Prisma.TestRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>[]
          }
          create: {
            args: Prisma.TestRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>
          }
          createMany: {
            args: Prisma.TestRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TestRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>[]
          }
          delete: {
            args: Prisma.TestRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>
          }
          update: {
            args: Prisma.TestRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>
          }
          deleteMany: {
            args: Prisma.TestRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TestRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TestRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>[]
          }
          upsert: {
            args: Prisma.TestRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestRunPayload>
          }
          aggregate: {
            args: Prisma.TestRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTestRun>
          }
          groupBy: {
            args: Prisma.TestRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<TestRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.TestRunCountArgs<ExtArgs>
            result: $Utils.Optional<TestRunCountAggregateOutputType> | number
          }
        }
      }
      TestCase: {
        payload: Prisma.$TestCasePayload<ExtArgs>
        fields: Prisma.TestCaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TestCaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TestCaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>
          }
          findFirst: {
            args: Prisma.TestCaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TestCaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>
          }
          findMany: {
            args: Prisma.TestCaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>[]
          }
          create: {
            args: Prisma.TestCaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>
          }
          createMany: {
            args: Prisma.TestCaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TestCaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>[]
          }
          delete: {
            args: Prisma.TestCaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>
          }
          update: {
            args: Prisma.TestCaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>
          }
          deleteMany: {
            args: Prisma.TestCaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TestCaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TestCaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>[]
          }
          upsert: {
            args: Prisma.TestCaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestCasePayload>
          }
          aggregate: {
            args: Prisma.TestCaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTestCase>
          }
          groupBy: {
            args: Prisma.TestCaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<TestCaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.TestCaseCountArgs<ExtArgs>
            result: $Utils.Optional<TestCaseCountAggregateOutputType> | number
          }
        }
      }
      ConversationMessage: {
        payload: Prisma.$ConversationMessagePayload<ExtArgs>
        fields: Prisma.ConversationMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          findFirst: {
            args: Prisma.ConversationMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          findMany: {
            args: Prisma.ConversationMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          create: {
            args: Prisma.ConversationMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          createMany: {
            args: Prisma.ConversationMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          delete: {
            args: Prisma.ConversationMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          update: {
            args: Prisma.ConversationMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          deleteMany: {
            args: Prisma.ConversationMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>[]
          }
          upsert: {
            args: Prisma.ConversationMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationMessagePayload>
          }
          aggregate: {
            args: Prisma.ConversationMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversationMessage>
          }
          groupBy: {
            args: Prisma.ConversationMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    post?: PostOmit
    testRun?: TestRunOmit
    testCase?: TestCaseOmit
    conversationMessage?: ConversationMessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TestRunCountOutputType
   */

  export type TestRunCountOutputType = {
    testCases: number
  }

  export type TestRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testCases?: boolean | TestRunCountOutputTypeCountTestCasesArgs
  }

  // Custom InputTypes
  /**
   * TestRunCountOutputType without action
   */
  export type TestRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRunCountOutputType
     */
    select?: TestRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TestRunCountOutputType without action
   */
  export type TestRunCountOutputTypeCountTestCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestCaseWhereInput
  }


  /**
   * Count Type TestCaseCountOutputType
   */

  export type TestCaseCountOutputType = {
    messages: number
  }

  export type TestCaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | TestCaseCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * TestCaseCountOutputType without action
   */
  export type TestCaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCaseCountOutputType
     */
    select?: TestCaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TestCaseCountOutputType without action
   */
  export type TestCaseCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
  }

  export type PostSumAggregateOutputType = {
    id: number | null
  }

  export type PostMinAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["post"]>

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'Int'>
    readonly name: FieldRef<"Post", 'String'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
  }


  /**
   * Model TestRun
   */

  export type AggregateTestRun = {
    _count: TestRunCountAggregateOutputType | null
    _avg: TestRunAvgAggregateOutputType | null
    _sum: TestRunSumAggregateOutputType | null
    _min: TestRunMinAggregateOutputType | null
    _max: TestRunMaxAggregateOutputType | null
  }

  export type TestRunAvgAggregateOutputType = {
    id: number | null
    totalCases: number | null
    tp: number | null
    fp: number | null
    fn: number | null
    precision: number | null
    recall: number | null
    f1: number | null
  }

  export type TestRunSumAggregateOutputType = {
    id: number | null
    totalCases: number | null
    tp: number | null
    fp: number | null
    fn: number | null
    precision: number | null
    recall: number | null
    f1: number | null
  }

  export type TestRunMinAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    totalCases: number | null
    tp: number | null
    fp: number | null
    fn: number | null
    precision: number | null
    recall: number | null
    f1: number | null
    datasetType: string | null
  }

  export type TestRunMaxAggregateOutputType = {
    id: number | null
    createdAt: Date | null
    totalCases: number | null
    tp: number | null
    fp: number | null
    fn: number | null
    precision: number | null
    recall: number | null
    f1: number | null
    datasetType: string | null
  }

  export type TestRunCountAggregateOutputType = {
    id: number
    createdAt: number
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType: number
    _all: number
  }


  export type TestRunAvgAggregateInputType = {
    id?: true
    totalCases?: true
    tp?: true
    fp?: true
    fn?: true
    precision?: true
    recall?: true
    f1?: true
  }

  export type TestRunSumAggregateInputType = {
    id?: true
    totalCases?: true
    tp?: true
    fp?: true
    fn?: true
    precision?: true
    recall?: true
    f1?: true
  }

  export type TestRunMinAggregateInputType = {
    id?: true
    createdAt?: true
    totalCases?: true
    tp?: true
    fp?: true
    fn?: true
    precision?: true
    recall?: true
    f1?: true
    datasetType?: true
  }

  export type TestRunMaxAggregateInputType = {
    id?: true
    createdAt?: true
    totalCases?: true
    tp?: true
    fp?: true
    fn?: true
    precision?: true
    recall?: true
    f1?: true
    datasetType?: true
  }

  export type TestRunCountAggregateInputType = {
    id?: true
    createdAt?: true
    totalCases?: true
    tp?: true
    fp?: true
    fn?: true
    precision?: true
    recall?: true
    f1?: true
    datasetType?: true
    _all?: true
  }

  export type TestRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestRun to aggregate.
     */
    where?: TestRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestRuns to fetch.
     */
    orderBy?: TestRunOrderByWithRelationInput | TestRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TestRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TestRuns
    **/
    _count?: true | TestRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TestRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TestRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TestRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TestRunMaxAggregateInputType
  }

  export type GetTestRunAggregateType<T extends TestRunAggregateArgs> = {
        [P in keyof T & keyof AggregateTestRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTestRun[P]>
      : GetScalarType<T[P], AggregateTestRun[P]>
  }




  export type TestRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestRunWhereInput
    orderBy?: TestRunOrderByWithAggregationInput | TestRunOrderByWithAggregationInput[]
    by: TestRunScalarFieldEnum[] | TestRunScalarFieldEnum
    having?: TestRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TestRunCountAggregateInputType | true
    _avg?: TestRunAvgAggregateInputType
    _sum?: TestRunSumAggregateInputType
    _min?: TestRunMinAggregateInputType
    _max?: TestRunMaxAggregateInputType
  }

  export type TestRunGroupByOutputType = {
    id: number
    createdAt: Date
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType: string
    _count: TestRunCountAggregateOutputType | null
    _avg: TestRunAvgAggregateOutputType | null
    _sum: TestRunSumAggregateOutputType | null
    _min: TestRunMinAggregateOutputType | null
    _max: TestRunMaxAggregateOutputType | null
  }

  type GetTestRunGroupByPayload<T extends TestRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TestRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TestRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TestRunGroupByOutputType[P]>
            : GetScalarType<T[P], TestRunGroupByOutputType[P]>
        }
      >
    >


  export type TestRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    totalCases?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    precision?: boolean
    recall?: boolean
    f1?: boolean
    datasetType?: boolean
    testCases?: boolean | TestRun$testCasesArgs<ExtArgs>
    _count?: boolean | TestRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testRun"]>

  export type TestRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    totalCases?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    precision?: boolean
    recall?: boolean
    f1?: boolean
    datasetType?: boolean
  }, ExtArgs["result"]["testRun"]>

  export type TestRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    totalCases?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    precision?: boolean
    recall?: boolean
    f1?: boolean
    datasetType?: boolean
  }, ExtArgs["result"]["testRun"]>

  export type TestRunSelectScalar = {
    id?: boolean
    createdAt?: boolean
    totalCases?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    precision?: boolean
    recall?: boolean
    f1?: boolean
    datasetType?: boolean
  }

  export type TestRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "totalCases" | "tp" | "fp" | "fn" | "precision" | "recall" | "f1" | "datasetType", ExtArgs["result"]["testRun"]>
  export type TestRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testCases?: boolean | TestRun$testCasesArgs<ExtArgs>
    _count?: boolean | TestRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TestRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TestRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TestRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TestRun"
    objects: {
      testCases: Prisma.$TestCasePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      createdAt: Date
      totalCases: number
      tp: number
      fp: number
      fn: number
      precision: number
      recall: number
      f1: number
      datasetType: string
    }, ExtArgs["result"]["testRun"]>
    composites: {}
  }

  type TestRunGetPayload<S extends boolean | null | undefined | TestRunDefaultArgs> = $Result.GetResult<Prisma.$TestRunPayload, S>

  type TestRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TestRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TestRunCountAggregateInputType | true
    }

  export interface TestRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TestRun'], meta: { name: 'TestRun' } }
    /**
     * Find zero or one TestRun that matches the filter.
     * @param {TestRunFindUniqueArgs} args - Arguments to find a TestRun
     * @example
     * // Get one TestRun
     * const testRun = await prisma.testRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TestRunFindUniqueArgs>(args: SelectSubset<T, TestRunFindUniqueArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TestRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TestRunFindUniqueOrThrowArgs} args - Arguments to find a TestRun
     * @example
     * // Get one TestRun
     * const testRun = await prisma.testRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TestRunFindUniqueOrThrowArgs>(args: SelectSubset<T, TestRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TestRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunFindFirstArgs} args - Arguments to find a TestRun
     * @example
     * // Get one TestRun
     * const testRun = await prisma.testRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TestRunFindFirstArgs>(args?: SelectSubset<T, TestRunFindFirstArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TestRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunFindFirstOrThrowArgs} args - Arguments to find a TestRun
     * @example
     * // Get one TestRun
     * const testRun = await prisma.testRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TestRunFindFirstOrThrowArgs>(args?: SelectSubset<T, TestRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TestRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TestRuns
     * const testRuns = await prisma.testRun.findMany()
     * 
     * // Get first 10 TestRuns
     * const testRuns = await prisma.testRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const testRunWithIdOnly = await prisma.testRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TestRunFindManyArgs>(args?: SelectSubset<T, TestRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TestRun.
     * @param {TestRunCreateArgs} args - Arguments to create a TestRun.
     * @example
     * // Create one TestRun
     * const TestRun = await prisma.testRun.create({
     *   data: {
     *     // ... data to create a TestRun
     *   }
     * })
     * 
     */
    create<T extends TestRunCreateArgs>(args: SelectSubset<T, TestRunCreateArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TestRuns.
     * @param {TestRunCreateManyArgs} args - Arguments to create many TestRuns.
     * @example
     * // Create many TestRuns
     * const testRun = await prisma.testRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TestRunCreateManyArgs>(args?: SelectSubset<T, TestRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TestRuns and returns the data saved in the database.
     * @param {TestRunCreateManyAndReturnArgs} args - Arguments to create many TestRuns.
     * @example
     * // Create many TestRuns
     * const testRun = await prisma.testRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TestRuns and only return the `id`
     * const testRunWithIdOnly = await prisma.testRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TestRunCreateManyAndReturnArgs>(args?: SelectSubset<T, TestRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TestRun.
     * @param {TestRunDeleteArgs} args - Arguments to delete one TestRun.
     * @example
     * // Delete one TestRun
     * const TestRun = await prisma.testRun.delete({
     *   where: {
     *     // ... filter to delete one TestRun
     *   }
     * })
     * 
     */
    delete<T extends TestRunDeleteArgs>(args: SelectSubset<T, TestRunDeleteArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TestRun.
     * @param {TestRunUpdateArgs} args - Arguments to update one TestRun.
     * @example
     * // Update one TestRun
     * const testRun = await prisma.testRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TestRunUpdateArgs>(args: SelectSubset<T, TestRunUpdateArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TestRuns.
     * @param {TestRunDeleteManyArgs} args - Arguments to filter TestRuns to delete.
     * @example
     * // Delete a few TestRuns
     * const { count } = await prisma.testRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TestRunDeleteManyArgs>(args?: SelectSubset<T, TestRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TestRuns
     * const testRun = await prisma.testRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TestRunUpdateManyArgs>(args: SelectSubset<T, TestRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestRuns and returns the data updated in the database.
     * @param {TestRunUpdateManyAndReturnArgs} args - Arguments to update many TestRuns.
     * @example
     * // Update many TestRuns
     * const testRun = await prisma.testRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TestRuns and only return the `id`
     * const testRunWithIdOnly = await prisma.testRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TestRunUpdateManyAndReturnArgs>(args: SelectSubset<T, TestRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TestRun.
     * @param {TestRunUpsertArgs} args - Arguments to update or create a TestRun.
     * @example
     * // Update or create a TestRun
     * const testRun = await prisma.testRun.upsert({
     *   create: {
     *     // ... data to create a TestRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TestRun we want to update
     *   }
     * })
     */
    upsert<T extends TestRunUpsertArgs>(args: SelectSubset<T, TestRunUpsertArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TestRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunCountArgs} args - Arguments to filter TestRuns to count.
     * @example
     * // Count the number of TestRuns
     * const count = await prisma.testRun.count({
     *   where: {
     *     // ... the filter for the TestRuns we want to count
     *   }
     * })
    **/
    count<T extends TestRunCountArgs>(
      args?: Subset<T, TestRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TestRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TestRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TestRunAggregateArgs>(args: Subset<T, TestRunAggregateArgs>): Prisma.PrismaPromise<GetTestRunAggregateType<T>>

    /**
     * Group by TestRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TestRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TestRunGroupByArgs['orderBy'] }
        : { orderBy?: TestRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TestRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTestRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TestRun model
   */
  readonly fields: TestRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TestRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TestRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    testCases<T extends TestRun$testCasesArgs<ExtArgs> = {}>(args?: Subset<T, TestRun$testCasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TestRun model
   */
  interface TestRunFieldRefs {
    readonly id: FieldRef<"TestRun", 'Int'>
    readonly createdAt: FieldRef<"TestRun", 'DateTime'>
    readonly totalCases: FieldRef<"TestRun", 'Int'>
    readonly tp: FieldRef<"TestRun", 'Int'>
    readonly fp: FieldRef<"TestRun", 'Int'>
    readonly fn: FieldRef<"TestRun", 'Int'>
    readonly precision: FieldRef<"TestRun", 'Float'>
    readonly recall: FieldRef<"TestRun", 'Float'>
    readonly f1: FieldRef<"TestRun", 'Float'>
    readonly datasetType: FieldRef<"TestRun", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TestRun findUnique
   */
  export type TestRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * Filter, which TestRun to fetch.
     */
    where: TestRunWhereUniqueInput
  }

  /**
   * TestRun findUniqueOrThrow
   */
  export type TestRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * Filter, which TestRun to fetch.
     */
    where: TestRunWhereUniqueInput
  }

  /**
   * TestRun findFirst
   */
  export type TestRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * Filter, which TestRun to fetch.
     */
    where?: TestRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestRuns to fetch.
     */
    orderBy?: TestRunOrderByWithRelationInput | TestRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestRuns.
     */
    cursor?: TestRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestRuns.
     */
    distinct?: TestRunScalarFieldEnum | TestRunScalarFieldEnum[]
  }

  /**
   * TestRun findFirstOrThrow
   */
  export type TestRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * Filter, which TestRun to fetch.
     */
    where?: TestRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestRuns to fetch.
     */
    orderBy?: TestRunOrderByWithRelationInput | TestRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestRuns.
     */
    cursor?: TestRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestRuns.
     */
    distinct?: TestRunScalarFieldEnum | TestRunScalarFieldEnum[]
  }

  /**
   * TestRun findMany
   */
  export type TestRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * Filter, which TestRuns to fetch.
     */
    where?: TestRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestRuns to fetch.
     */
    orderBy?: TestRunOrderByWithRelationInput | TestRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TestRuns.
     */
    cursor?: TestRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestRuns.
     */
    skip?: number
    distinct?: TestRunScalarFieldEnum | TestRunScalarFieldEnum[]
  }

  /**
   * TestRun create
   */
  export type TestRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * The data needed to create a TestRun.
     */
    data: XOR<TestRunCreateInput, TestRunUncheckedCreateInput>
  }

  /**
   * TestRun createMany
   */
  export type TestRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TestRuns.
     */
    data: TestRunCreateManyInput | TestRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TestRun createManyAndReturn
   */
  export type TestRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * The data used to create many TestRuns.
     */
    data: TestRunCreateManyInput | TestRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TestRun update
   */
  export type TestRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * The data needed to update a TestRun.
     */
    data: XOR<TestRunUpdateInput, TestRunUncheckedUpdateInput>
    /**
     * Choose, which TestRun to update.
     */
    where: TestRunWhereUniqueInput
  }

  /**
   * TestRun updateMany
   */
  export type TestRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TestRuns.
     */
    data: XOR<TestRunUpdateManyMutationInput, TestRunUncheckedUpdateManyInput>
    /**
     * Filter which TestRuns to update
     */
    where?: TestRunWhereInput
    /**
     * Limit how many TestRuns to update.
     */
    limit?: number
  }

  /**
   * TestRun updateManyAndReturn
   */
  export type TestRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * The data used to update TestRuns.
     */
    data: XOR<TestRunUpdateManyMutationInput, TestRunUncheckedUpdateManyInput>
    /**
     * Filter which TestRuns to update
     */
    where?: TestRunWhereInput
    /**
     * Limit how many TestRuns to update.
     */
    limit?: number
  }

  /**
   * TestRun upsert
   */
  export type TestRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * The filter to search for the TestRun to update in case it exists.
     */
    where: TestRunWhereUniqueInput
    /**
     * In case the TestRun found by the `where` argument doesn't exist, create a new TestRun with this data.
     */
    create: XOR<TestRunCreateInput, TestRunUncheckedCreateInput>
    /**
     * In case the TestRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TestRunUpdateInput, TestRunUncheckedUpdateInput>
  }

  /**
   * TestRun delete
   */
  export type TestRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
    /**
     * Filter which TestRun to delete.
     */
    where: TestRunWhereUniqueInput
  }

  /**
   * TestRun deleteMany
   */
  export type TestRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestRuns to delete
     */
    where?: TestRunWhereInput
    /**
     * Limit how many TestRuns to delete.
     */
    limit?: number
  }

  /**
   * TestRun.testCases
   */
  export type TestRun$testCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    where?: TestCaseWhereInput
    orderBy?: TestCaseOrderByWithRelationInput | TestCaseOrderByWithRelationInput[]
    cursor?: TestCaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TestCaseScalarFieldEnum | TestCaseScalarFieldEnum[]
  }

  /**
   * TestRun without action
   */
  export type TestRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestRun
     */
    select?: TestRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestRun
     */
    omit?: TestRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestRunInclude<ExtArgs> | null
  }


  /**
   * Model TestCase
   */

  export type AggregateTestCase = {
    _count: TestCaseCountAggregateOutputType | null
    _avg: TestCaseAvgAggregateOutputType | null
    _sum: TestCaseSumAggregateOutputType | null
    _min: TestCaseMinAggregateOutputType | null
    _max: TestCaseMaxAggregateOutputType | null
  }

  export type TestCaseAvgAggregateOutputType = {
    id: number | null
    testRunId: number | null
    caseIndex: number | null
    tp: number | null
    fp: number | null
    fn: number | null
  }

  export type TestCaseSumAggregateOutputType = {
    id: number | null
    testRunId: number | null
    caseIndex: number | null
    tp: number | null
    fp: number | null
    fn: number | null
  }

  export type TestCaseMinAggregateOutputType = {
    id: number | null
    testRunId: number | null
    caseIndex: number | null
    problemText: string | null
    hasMismatch: boolean | null
    tp: number | null
    fp: number | null
    fn: number | null
    groundTruth: string | null
    predicted: string | null
  }

  export type TestCaseMaxAggregateOutputType = {
    id: number | null
    testRunId: number | null
    caseIndex: number | null
    problemText: string | null
    hasMismatch: boolean | null
    tp: number | null
    fp: number | null
    fn: number | null
    groundTruth: string | null
    predicted: string | null
  }

  export type TestCaseCountAggregateOutputType = {
    id: number
    testRunId: number
    caseIndex: number
    problemText: number
    hasMismatch: number
    tp: number
    fp: number
    fn: number
    groundTruth: number
    predicted: number
    _all: number
  }


  export type TestCaseAvgAggregateInputType = {
    id?: true
    testRunId?: true
    caseIndex?: true
    tp?: true
    fp?: true
    fn?: true
  }

  export type TestCaseSumAggregateInputType = {
    id?: true
    testRunId?: true
    caseIndex?: true
    tp?: true
    fp?: true
    fn?: true
  }

  export type TestCaseMinAggregateInputType = {
    id?: true
    testRunId?: true
    caseIndex?: true
    problemText?: true
    hasMismatch?: true
    tp?: true
    fp?: true
    fn?: true
    groundTruth?: true
    predicted?: true
  }

  export type TestCaseMaxAggregateInputType = {
    id?: true
    testRunId?: true
    caseIndex?: true
    problemText?: true
    hasMismatch?: true
    tp?: true
    fp?: true
    fn?: true
    groundTruth?: true
    predicted?: true
  }

  export type TestCaseCountAggregateInputType = {
    id?: true
    testRunId?: true
    caseIndex?: true
    problemText?: true
    hasMismatch?: true
    tp?: true
    fp?: true
    fn?: true
    groundTruth?: true
    predicted?: true
    _all?: true
  }

  export type TestCaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestCase to aggregate.
     */
    where?: TestCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestCases to fetch.
     */
    orderBy?: TestCaseOrderByWithRelationInput | TestCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TestCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TestCases
    **/
    _count?: true | TestCaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TestCaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TestCaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TestCaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TestCaseMaxAggregateInputType
  }

  export type GetTestCaseAggregateType<T extends TestCaseAggregateArgs> = {
        [P in keyof T & keyof AggregateTestCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTestCase[P]>
      : GetScalarType<T[P], AggregateTestCase[P]>
  }




  export type TestCaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestCaseWhereInput
    orderBy?: TestCaseOrderByWithAggregationInput | TestCaseOrderByWithAggregationInput[]
    by: TestCaseScalarFieldEnum[] | TestCaseScalarFieldEnum
    having?: TestCaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TestCaseCountAggregateInputType | true
    _avg?: TestCaseAvgAggregateInputType
    _sum?: TestCaseSumAggregateInputType
    _min?: TestCaseMinAggregateInputType
    _max?: TestCaseMaxAggregateInputType
  }

  export type TestCaseGroupByOutputType = {
    id: number
    testRunId: number
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
    _count: TestCaseCountAggregateOutputType | null
    _avg: TestCaseAvgAggregateOutputType | null
    _sum: TestCaseSumAggregateOutputType | null
    _min: TestCaseMinAggregateOutputType | null
    _max: TestCaseMaxAggregateOutputType | null
  }

  type GetTestCaseGroupByPayload<T extends TestCaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TestCaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TestCaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TestCaseGroupByOutputType[P]>
            : GetScalarType<T[P], TestCaseGroupByOutputType[P]>
        }
      >
    >


  export type TestCaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testRunId?: boolean
    caseIndex?: boolean
    problemText?: boolean
    hasMismatch?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    groundTruth?: boolean
    predicted?: boolean
    testRun?: boolean | TestRunDefaultArgs<ExtArgs>
    messages?: boolean | TestCase$messagesArgs<ExtArgs>
    _count?: boolean | TestCaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testCase"]>

  export type TestCaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testRunId?: boolean
    caseIndex?: boolean
    problemText?: boolean
    hasMismatch?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    groundTruth?: boolean
    predicted?: boolean
    testRun?: boolean | TestRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testCase"]>

  export type TestCaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testRunId?: boolean
    caseIndex?: boolean
    problemText?: boolean
    hasMismatch?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    groundTruth?: boolean
    predicted?: boolean
    testRun?: boolean | TestRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testCase"]>

  export type TestCaseSelectScalar = {
    id?: boolean
    testRunId?: boolean
    caseIndex?: boolean
    problemText?: boolean
    hasMismatch?: boolean
    tp?: boolean
    fp?: boolean
    fn?: boolean
    groundTruth?: boolean
    predicted?: boolean
  }

  export type TestCaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "testRunId" | "caseIndex" | "problemText" | "hasMismatch" | "tp" | "fp" | "fn" | "groundTruth" | "predicted", ExtArgs["result"]["testCase"]>
  export type TestCaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testRun?: boolean | TestRunDefaultArgs<ExtArgs>
    messages?: boolean | TestCase$messagesArgs<ExtArgs>
    _count?: boolean | TestCaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TestCaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testRun?: boolean | TestRunDefaultArgs<ExtArgs>
  }
  export type TestCaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testRun?: boolean | TestRunDefaultArgs<ExtArgs>
  }

  export type $TestCasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TestCase"
    objects: {
      testRun: Prisma.$TestRunPayload<ExtArgs>
      messages: Prisma.$ConversationMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      testRunId: number
      caseIndex: number
      problemText: string
      hasMismatch: boolean
      tp: number
      fp: number
      fn: number
      groundTruth: string
      predicted: string
    }, ExtArgs["result"]["testCase"]>
    composites: {}
  }

  type TestCaseGetPayload<S extends boolean | null | undefined | TestCaseDefaultArgs> = $Result.GetResult<Prisma.$TestCasePayload, S>

  type TestCaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TestCaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TestCaseCountAggregateInputType | true
    }

  export interface TestCaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TestCase'], meta: { name: 'TestCase' } }
    /**
     * Find zero or one TestCase that matches the filter.
     * @param {TestCaseFindUniqueArgs} args - Arguments to find a TestCase
     * @example
     * // Get one TestCase
     * const testCase = await prisma.testCase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TestCaseFindUniqueArgs>(args: SelectSubset<T, TestCaseFindUniqueArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TestCase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TestCaseFindUniqueOrThrowArgs} args - Arguments to find a TestCase
     * @example
     * // Get one TestCase
     * const testCase = await prisma.testCase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TestCaseFindUniqueOrThrowArgs>(args: SelectSubset<T, TestCaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TestCase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseFindFirstArgs} args - Arguments to find a TestCase
     * @example
     * // Get one TestCase
     * const testCase = await prisma.testCase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TestCaseFindFirstArgs>(args?: SelectSubset<T, TestCaseFindFirstArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TestCase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseFindFirstOrThrowArgs} args - Arguments to find a TestCase
     * @example
     * // Get one TestCase
     * const testCase = await prisma.testCase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TestCaseFindFirstOrThrowArgs>(args?: SelectSubset<T, TestCaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TestCases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TestCases
     * const testCases = await prisma.testCase.findMany()
     * 
     * // Get first 10 TestCases
     * const testCases = await prisma.testCase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const testCaseWithIdOnly = await prisma.testCase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TestCaseFindManyArgs>(args?: SelectSubset<T, TestCaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TestCase.
     * @param {TestCaseCreateArgs} args - Arguments to create a TestCase.
     * @example
     * // Create one TestCase
     * const TestCase = await prisma.testCase.create({
     *   data: {
     *     // ... data to create a TestCase
     *   }
     * })
     * 
     */
    create<T extends TestCaseCreateArgs>(args: SelectSubset<T, TestCaseCreateArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TestCases.
     * @param {TestCaseCreateManyArgs} args - Arguments to create many TestCases.
     * @example
     * // Create many TestCases
     * const testCase = await prisma.testCase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TestCaseCreateManyArgs>(args?: SelectSubset<T, TestCaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TestCases and returns the data saved in the database.
     * @param {TestCaseCreateManyAndReturnArgs} args - Arguments to create many TestCases.
     * @example
     * // Create many TestCases
     * const testCase = await prisma.testCase.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TestCases and only return the `id`
     * const testCaseWithIdOnly = await prisma.testCase.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TestCaseCreateManyAndReturnArgs>(args?: SelectSubset<T, TestCaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TestCase.
     * @param {TestCaseDeleteArgs} args - Arguments to delete one TestCase.
     * @example
     * // Delete one TestCase
     * const TestCase = await prisma.testCase.delete({
     *   where: {
     *     // ... filter to delete one TestCase
     *   }
     * })
     * 
     */
    delete<T extends TestCaseDeleteArgs>(args: SelectSubset<T, TestCaseDeleteArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TestCase.
     * @param {TestCaseUpdateArgs} args - Arguments to update one TestCase.
     * @example
     * // Update one TestCase
     * const testCase = await prisma.testCase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TestCaseUpdateArgs>(args: SelectSubset<T, TestCaseUpdateArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TestCases.
     * @param {TestCaseDeleteManyArgs} args - Arguments to filter TestCases to delete.
     * @example
     * // Delete a few TestCases
     * const { count } = await prisma.testCase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TestCaseDeleteManyArgs>(args?: SelectSubset<T, TestCaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestCases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TestCases
     * const testCase = await prisma.testCase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TestCaseUpdateManyArgs>(args: SelectSubset<T, TestCaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestCases and returns the data updated in the database.
     * @param {TestCaseUpdateManyAndReturnArgs} args - Arguments to update many TestCases.
     * @example
     * // Update many TestCases
     * const testCase = await prisma.testCase.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TestCases and only return the `id`
     * const testCaseWithIdOnly = await prisma.testCase.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TestCaseUpdateManyAndReturnArgs>(args: SelectSubset<T, TestCaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TestCase.
     * @param {TestCaseUpsertArgs} args - Arguments to update or create a TestCase.
     * @example
     * // Update or create a TestCase
     * const testCase = await prisma.testCase.upsert({
     *   create: {
     *     // ... data to create a TestCase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TestCase we want to update
     *   }
     * })
     */
    upsert<T extends TestCaseUpsertArgs>(args: SelectSubset<T, TestCaseUpsertArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TestCases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseCountArgs} args - Arguments to filter TestCases to count.
     * @example
     * // Count the number of TestCases
     * const count = await prisma.testCase.count({
     *   where: {
     *     // ... the filter for the TestCases we want to count
     *   }
     * })
    **/
    count<T extends TestCaseCountArgs>(
      args?: Subset<T, TestCaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TestCaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TestCase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TestCaseAggregateArgs>(args: Subset<T, TestCaseAggregateArgs>): Prisma.PrismaPromise<GetTestCaseAggregateType<T>>

    /**
     * Group by TestCase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TestCaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TestCaseGroupByArgs['orderBy'] }
        : { orderBy?: TestCaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TestCaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTestCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TestCase model
   */
  readonly fields: TestCaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TestCase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TestCaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    testRun<T extends TestRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TestRunDefaultArgs<ExtArgs>>): Prisma__TestRunClient<$Result.GetResult<Prisma.$TestRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends TestCase$messagesArgs<ExtArgs> = {}>(args?: Subset<T, TestCase$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TestCase model
   */
  interface TestCaseFieldRefs {
    readonly id: FieldRef<"TestCase", 'Int'>
    readonly testRunId: FieldRef<"TestCase", 'Int'>
    readonly caseIndex: FieldRef<"TestCase", 'Int'>
    readonly problemText: FieldRef<"TestCase", 'String'>
    readonly hasMismatch: FieldRef<"TestCase", 'Boolean'>
    readonly tp: FieldRef<"TestCase", 'Int'>
    readonly fp: FieldRef<"TestCase", 'Int'>
    readonly fn: FieldRef<"TestCase", 'Int'>
    readonly groundTruth: FieldRef<"TestCase", 'String'>
    readonly predicted: FieldRef<"TestCase", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TestCase findUnique
   */
  export type TestCaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * Filter, which TestCase to fetch.
     */
    where: TestCaseWhereUniqueInput
  }

  /**
   * TestCase findUniqueOrThrow
   */
  export type TestCaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * Filter, which TestCase to fetch.
     */
    where: TestCaseWhereUniqueInput
  }

  /**
   * TestCase findFirst
   */
  export type TestCaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * Filter, which TestCase to fetch.
     */
    where?: TestCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestCases to fetch.
     */
    orderBy?: TestCaseOrderByWithRelationInput | TestCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestCases.
     */
    cursor?: TestCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestCases.
     */
    distinct?: TestCaseScalarFieldEnum | TestCaseScalarFieldEnum[]
  }

  /**
   * TestCase findFirstOrThrow
   */
  export type TestCaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * Filter, which TestCase to fetch.
     */
    where?: TestCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestCases to fetch.
     */
    orderBy?: TestCaseOrderByWithRelationInput | TestCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestCases.
     */
    cursor?: TestCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestCases.
     */
    distinct?: TestCaseScalarFieldEnum | TestCaseScalarFieldEnum[]
  }

  /**
   * TestCase findMany
   */
  export type TestCaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * Filter, which TestCases to fetch.
     */
    where?: TestCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestCases to fetch.
     */
    orderBy?: TestCaseOrderByWithRelationInput | TestCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TestCases.
     */
    cursor?: TestCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestCases.
     */
    skip?: number
    distinct?: TestCaseScalarFieldEnum | TestCaseScalarFieldEnum[]
  }

  /**
   * TestCase create
   */
  export type TestCaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * The data needed to create a TestCase.
     */
    data: XOR<TestCaseCreateInput, TestCaseUncheckedCreateInput>
  }

  /**
   * TestCase createMany
   */
  export type TestCaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TestCases.
     */
    data: TestCaseCreateManyInput | TestCaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TestCase createManyAndReturn
   */
  export type TestCaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * The data used to create many TestCases.
     */
    data: TestCaseCreateManyInput | TestCaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TestCase update
   */
  export type TestCaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * The data needed to update a TestCase.
     */
    data: XOR<TestCaseUpdateInput, TestCaseUncheckedUpdateInput>
    /**
     * Choose, which TestCase to update.
     */
    where: TestCaseWhereUniqueInput
  }

  /**
   * TestCase updateMany
   */
  export type TestCaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TestCases.
     */
    data: XOR<TestCaseUpdateManyMutationInput, TestCaseUncheckedUpdateManyInput>
    /**
     * Filter which TestCases to update
     */
    where?: TestCaseWhereInput
    /**
     * Limit how many TestCases to update.
     */
    limit?: number
  }

  /**
   * TestCase updateManyAndReturn
   */
  export type TestCaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * The data used to update TestCases.
     */
    data: XOR<TestCaseUpdateManyMutationInput, TestCaseUncheckedUpdateManyInput>
    /**
     * Filter which TestCases to update
     */
    where?: TestCaseWhereInput
    /**
     * Limit how many TestCases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TestCase upsert
   */
  export type TestCaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * The filter to search for the TestCase to update in case it exists.
     */
    where: TestCaseWhereUniqueInput
    /**
     * In case the TestCase found by the `where` argument doesn't exist, create a new TestCase with this data.
     */
    create: XOR<TestCaseCreateInput, TestCaseUncheckedCreateInput>
    /**
     * In case the TestCase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TestCaseUpdateInput, TestCaseUncheckedUpdateInput>
  }

  /**
   * TestCase delete
   */
  export type TestCaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
    /**
     * Filter which TestCase to delete.
     */
    where: TestCaseWhereUniqueInput
  }

  /**
   * TestCase deleteMany
   */
  export type TestCaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestCases to delete
     */
    where?: TestCaseWhereInput
    /**
     * Limit how many TestCases to delete.
     */
    limit?: number
  }

  /**
   * TestCase.messages
   */
  export type TestCase$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    where?: ConversationMessageWhereInput
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    cursor?: ConversationMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * TestCase without action
   */
  export type TestCaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCase
     */
    select?: TestCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestCase
     */
    omit?: TestCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestCaseInclude<ExtArgs> | null
  }


  /**
   * Model ConversationMessage
   */

  export type AggregateConversationMessage = {
    _count: ConversationMessageCountAggregateOutputType | null
    _avg: ConversationMessageAvgAggregateOutputType | null
    _sum: ConversationMessageSumAggregateOutputType | null
    _min: ConversationMessageMinAggregateOutputType | null
    _max: ConversationMessageMaxAggregateOutputType | null
  }

  export type ConversationMessageAvgAggregateOutputType = {
    id: number | null
    testCaseId: number | null
    msgOrder: number | null
  }

  export type ConversationMessageSumAggregateOutputType = {
    id: number | null
    testCaseId: number | null
    msgOrder: number | null
  }

  export type ConversationMessageMinAggregateOutputType = {
    id: number | null
    testCaseId: number | null
    msgOrder: number | null
    role: string | null
    content: string | null
  }

  export type ConversationMessageMaxAggregateOutputType = {
    id: number | null
    testCaseId: number | null
    msgOrder: number | null
    role: string | null
    content: string | null
  }

  export type ConversationMessageCountAggregateOutputType = {
    id: number
    testCaseId: number
    msgOrder: number
    role: number
    content: number
    _all: number
  }


  export type ConversationMessageAvgAggregateInputType = {
    id?: true
    testCaseId?: true
    msgOrder?: true
  }

  export type ConversationMessageSumAggregateInputType = {
    id?: true
    testCaseId?: true
    msgOrder?: true
  }

  export type ConversationMessageMinAggregateInputType = {
    id?: true
    testCaseId?: true
    msgOrder?: true
    role?: true
    content?: true
  }

  export type ConversationMessageMaxAggregateInputType = {
    id?: true
    testCaseId?: true
    msgOrder?: true
    role?: true
    content?: true
  }

  export type ConversationMessageCountAggregateInputType = {
    id?: true
    testCaseId?: true
    msgOrder?: true
    role?: true
    content?: true
    _all?: true
  }

  export type ConversationMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationMessage to aggregate.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConversationMessages
    **/
    _count?: true | ConversationMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConversationMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConversationMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationMessageMaxAggregateInputType
  }

  export type GetConversationMessageAggregateType<T extends ConversationMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateConversationMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversationMessage[P]>
      : GetScalarType<T[P], AggregateConversationMessage[P]>
  }




  export type ConversationMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationMessageWhereInput
    orderBy?: ConversationMessageOrderByWithAggregationInput | ConversationMessageOrderByWithAggregationInput[]
    by: ConversationMessageScalarFieldEnum[] | ConversationMessageScalarFieldEnum
    having?: ConversationMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationMessageCountAggregateInputType | true
    _avg?: ConversationMessageAvgAggregateInputType
    _sum?: ConversationMessageSumAggregateInputType
    _min?: ConversationMessageMinAggregateInputType
    _max?: ConversationMessageMaxAggregateInputType
  }

  export type ConversationMessageGroupByOutputType = {
    id: number
    testCaseId: number
    msgOrder: number
    role: string
    content: string
    _count: ConversationMessageCountAggregateOutputType | null
    _avg: ConversationMessageAvgAggregateOutputType | null
    _sum: ConversationMessageSumAggregateOutputType | null
    _min: ConversationMessageMinAggregateOutputType | null
    _max: ConversationMessageMaxAggregateOutputType | null
  }

  type GetConversationMessageGroupByPayload<T extends ConversationMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationMessageGroupByOutputType[P]>
        }
      >
    >


  export type ConversationMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testCaseId?: boolean
    msgOrder?: boolean
    role?: boolean
    content?: boolean
    testCase?: boolean | TestCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testCaseId?: boolean
    msgOrder?: boolean
    role?: boolean
    content?: boolean
    testCase?: boolean | TestCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    testCaseId?: boolean
    msgOrder?: boolean
    role?: boolean
    content?: boolean
    testCase?: boolean | TestCaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationMessage"]>

  export type ConversationMessageSelectScalar = {
    id?: boolean
    testCaseId?: boolean
    msgOrder?: boolean
    role?: boolean
    content?: boolean
  }

  export type ConversationMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "testCaseId" | "msgOrder" | "role" | "content", ExtArgs["result"]["conversationMessage"]>
  export type ConversationMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testCase?: boolean | TestCaseDefaultArgs<ExtArgs>
  }
  export type ConversationMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testCase?: boolean | TestCaseDefaultArgs<ExtArgs>
  }
  export type ConversationMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    testCase?: boolean | TestCaseDefaultArgs<ExtArgs>
  }

  export type $ConversationMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConversationMessage"
    objects: {
      testCase: Prisma.$TestCasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      testCaseId: number
      msgOrder: number
      role: string
      content: string
    }, ExtArgs["result"]["conversationMessage"]>
    composites: {}
  }

  type ConversationMessageGetPayload<S extends boolean | null | undefined | ConversationMessageDefaultArgs> = $Result.GetResult<Prisma.$ConversationMessagePayload, S>

  type ConversationMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationMessageCountAggregateInputType | true
    }

  export interface ConversationMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConversationMessage'], meta: { name: 'ConversationMessage' } }
    /**
     * Find zero or one ConversationMessage that matches the filter.
     * @param {ConversationMessageFindUniqueArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationMessageFindUniqueArgs>(args: SelectSubset<T, ConversationMessageFindUniqueArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConversationMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationMessageFindUniqueOrThrowArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindFirstArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationMessageFindFirstArgs>(args?: SelectSubset<T, ConversationMessageFindFirstArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindFirstOrThrowArgs} args - Arguments to find a ConversationMessage
     * @example
     * // Get one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConversationMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConversationMessages
     * const conversationMessages = await prisma.conversationMessage.findMany()
     * 
     * // Get first 10 ConversationMessages
     * const conversationMessages = await prisma.conversationMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationMessageFindManyArgs>(args?: SelectSubset<T, ConversationMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConversationMessage.
     * @param {ConversationMessageCreateArgs} args - Arguments to create a ConversationMessage.
     * @example
     * // Create one ConversationMessage
     * const ConversationMessage = await prisma.conversationMessage.create({
     *   data: {
     *     // ... data to create a ConversationMessage
     *   }
     * })
     * 
     */
    create<T extends ConversationMessageCreateArgs>(args: SelectSubset<T, ConversationMessageCreateArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConversationMessages.
     * @param {ConversationMessageCreateManyArgs} args - Arguments to create many ConversationMessages.
     * @example
     * // Create many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationMessageCreateManyArgs>(args?: SelectSubset<T, ConversationMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConversationMessages and returns the data saved in the database.
     * @param {ConversationMessageCreateManyAndReturnArgs} args - Arguments to create many ConversationMessages.
     * @example
     * // Create many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConversationMessages and only return the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConversationMessage.
     * @param {ConversationMessageDeleteArgs} args - Arguments to delete one ConversationMessage.
     * @example
     * // Delete one ConversationMessage
     * const ConversationMessage = await prisma.conversationMessage.delete({
     *   where: {
     *     // ... filter to delete one ConversationMessage
     *   }
     * })
     * 
     */
    delete<T extends ConversationMessageDeleteArgs>(args: SelectSubset<T, ConversationMessageDeleteArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConversationMessage.
     * @param {ConversationMessageUpdateArgs} args - Arguments to update one ConversationMessage.
     * @example
     * // Update one ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationMessageUpdateArgs>(args: SelectSubset<T, ConversationMessageUpdateArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConversationMessages.
     * @param {ConversationMessageDeleteManyArgs} args - Arguments to filter ConversationMessages to delete.
     * @example
     * // Delete a few ConversationMessages
     * const { count } = await prisma.conversationMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationMessageDeleteManyArgs>(args?: SelectSubset<T, ConversationMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationMessageUpdateManyArgs>(args: SelectSubset<T, ConversationMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationMessages and returns the data updated in the database.
     * @param {ConversationMessageUpdateManyAndReturnArgs} args - Arguments to update many ConversationMessages.
     * @example
     * // Update many ConversationMessages
     * const conversationMessage = await prisma.conversationMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConversationMessages and only return the `id`
     * const conversationMessageWithIdOnly = await prisma.conversationMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConversationMessage.
     * @param {ConversationMessageUpsertArgs} args - Arguments to update or create a ConversationMessage.
     * @example
     * // Update or create a ConversationMessage
     * const conversationMessage = await prisma.conversationMessage.upsert({
     *   create: {
     *     // ... data to create a ConversationMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConversationMessage we want to update
     *   }
     * })
     */
    upsert<T extends ConversationMessageUpsertArgs>(args: SelectSubset<T, ConversationMessageUpsertArgs<ExtArgs>>): Prisma__ConversationMessageClient<$Result.GetResult<Prisma.$ConversationMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConversationMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageCountArgs} args - Arguments to filter ConversationMessages to count.
     * @example
     * // Count the number of ConversationMessages
     * const count = await prisma.conversationMessage.count({
     *   where: {
     *     // ... the filter for the ConversationMessages we want to count
     *   }
     * })
    **/
    count<T extends ConversationMessageCountArgs>(
      args?: Subset<T, ConversationMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationMessageAggregateArgs>(args: Subset<T, ConversationMessageAggregateArgs>): Prisma.PrismaPromise<GetConversationMessageAggregateType<T>>

    /**
     * Group by ConversationMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationMessageGroupByArgs['orderBy'] }
        : { orderBy?: ConversationMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConversationMessage model
   */
  readonly fields: ConversationMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConversationMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    testCase<T extends TestCaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TestCaseDefaultArgs<ExtArgs>>): Prisma__TestCaseClient<$Result.GetResult<Prisma.$TestCasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConversationMessage model
   */
  interface ConversationMessageFieldRefs {
    readonly id: FieldRef<"ConversationMessage", 'Int'>
    readonly testCaseId: FieldRef<"ConversationMessage", 'Int'>
    readonly msgOrder: FieldRef<"ConversationMessage", 'Int'>
    readonly role: FieldRef<"ConversationMessage", 'String'>
    readonly content: FieldRef<"ConversationMessage", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ConversationMessage findUnique
   */
  export type ConversationMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage findUniqueOrThrow
   */
  export type ConversationMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage findFirst
   */
  export type ConversationMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationMessages.
     */
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage findFirstOrThrow
   */
  export type ConversationMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessage to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationMessages.
     */
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage findMany
   */
  export type ConversationMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter, which ConversationMessages to fetch.
     */
    where?: ConversationMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationMessages to fetch.
     */
    orderBy?: ConversationMessageOrderByWithRelationInput | ConversationMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConversationMessages.
     */
    cursor?: ConversationMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationMessages.
     */
    skip?: number
    distinct?: ConversationMessageScalarFieldEnum | ConversationMessageScalarFieldEnum[]
  }

  /**
   * ConversationMessage create
   */
  export type ConversationMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ConversationMessage.
     */
    data: XOR<ConversationMessageCreateInput, ConversationMessageUncheckedCreateInput>
  }

  /**
   * ConversationMessage createMany
   */
  export type ConversationMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConversationMessages.
     */
    data: ConversationMessageCreateManyInput | ConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConversationMessage createManyAndReturn
   */
  export type ConversationMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ConversationMessages.
     */
    data: ConversationMessageCreateManyInput | ConversationMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationMessage update
   */
  export type ConversationMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ConversationMessage.
     */
    data: XOR<ConversationMessageUpdateInput, ConversationMessageUncheckedUpdateInput>
    /**
     * Choose, which ConversationMessage to update.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage updateMany
   */
  export type ConversationMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConversationMessages.
     */
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConversationMessages to update
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to update.
     */
    limit?: number
  }

  /**
   * ConversationMessage updateManyAndReturn
   */
  export type ConversationMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * The data used to update ConversationMessages.
     */
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyInput>
    /**
     * Filter which ConversationMessages to update
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationMessage upsert
   */
  export type ConversationMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ConversationMessage to update in case it exists.
     */
    where: ConversationMessageWhereUniqueInput
    /**
     * In case the ConversationMessage found by the `where` argument doesn't exist, create a new ConversationMessage with this data.
     */
    create: XOR<ConversationMessageCreateInput, ConversationMessageUncheckedCreateInput>
    /**
     * In case the ConversationMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationMessageUpdateInput, ConversationMessageUncheckedUpdateInput>
  }

  /**
   * ConversationMessage delete
   */
  export type ConversationMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
    /**
     * Filter which ConversationMessage to delete.
     */
    where: ConversationMessageWhereUniqueInput
  }

  /**
   * ConversationMessage deleteMany
   */
  export type ConversationMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationMessages to delete
     */
    where?: ConversationMessageWhereInput
    /**
     * Limit how many ConversationMessages to delete.
     */
    limit?: number
  }

  /**
   * ConversationMessage without action
   */
  export type ConversationMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationMessage
     */
    select?: ConversationMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationMessage
     */
    omit?: ConversationMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationMessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PostScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const TestRunScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    totalCases: 'totalCases',
    tp: 'tp',
    fp: 'fp',
    fn: 'fn',
    precision: 'precision',
    recall: 'recall',
    f1: 'f1',
    datasetType: 'datasetType'
  };

  export type TestRunScalarFieldEnum = (typeof TestRunScalarFieldEnum)[keyof typeof TestRunScalarFieldEnum]


  export const TestCaseScalarFieldEnum: {
    id: 'id',
    testRunId: 'testRunId',
    caseIndex: 'caseIndex',
    problemText: 'problemText',
    hasMismatch: 'hasMismatch',
    tp: 'tp',
    fp: 'fp',
    fn: 'fn',
    groundTruth: 'groundTruth',
    predicted: 'predicted'
  };

  export type TestCaseScalarFieldEnum = (typeof TestCaseScalarFieldEnum)[keyof typeof TestCaseScalarFieldEnum]


  export const ConversationMessageScalarFieldEnum: {
    id: 'id',
    testCaseId: 'testCaseId',
    msgOrder: 'msgOrder',
    role: 'role',
    content: 'content'
  };

  export type ConversationMessageScalarFieldEnum = (typeof ConversationMessageScalarFieldEnum)[keyof typeof ConversationMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: IntFilter<"Post"> | number
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Post"> | number
    name?: StringWithAggregatesFilter<"Post"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type TestRunWhereInput = {
    AND?: TestRunWhereInput | TestRunWhereInput[]
    OR?: TestRunWhereInput[]
    NOT?: TestRunWhereInput | TestRunWhereInput[]
    id?: IntFilter<"TestRun"> | number
    createdAt?: DateTimeFilter<"TestRun"> | Date | string
    totalCases?: IntFilter<"TestRun"> | number
    tp?: IntFilter<"TestRun"> | number
    fp?: IntFilter<"TestRun"> | number
    fn?: IntFilter<"TestRun"> | number
    precision?: FloatFilter<"TestRun"> | number
    recall?: FloatFilter<"TestRun"> | number
    f1?: FloatFilter<"TestRun"> | number
    datasetType?: StringFilter<"TestRun"> | string
    testCases?: TestCaseListRelationFilter
  }

  export type TestRunOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
    datasetType?: SortOrder
    testCases?: TestCaseOrderByRelationAggregateInput
  }

  export type TestRunWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TestRunWhereInput | TestRunWhereInput[]
    OR?: TestRunWhereInput[]
    NOT?: TestRunWhereInput | TestRunWhereInput[]
    createdAt?: DateTimeFilter<"TestRun"> | Date | string
    totalCases?: IntFilter<"TestRun"> | number
    tp?: IntFilter<"TestRun"> | number
    fp?: IntFilter<"TestRun"> | number
    fn?: IntFilter<"TestRun"> | number
    precision?: FloatFilter<"TestRun"> | number
    recall?: FloatFilter<"TestRun"> | number
    f1?: FloatFilter<"TestRun"> | number
    datasetType?: StringFilter<"TestRun"> | string
    testCases?: TestCaseListRelationFilter
  }, "id">

  export type TestRunOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
    datasetType?: SortOrder
    _count?: TestRunCountOrderByAggregateInput
    _avg?: TestRunAvgOrderByAggregateInput
    _max?: TestRunMaxOrderByAggregateInput
    _min?: TestRunMinOrderByAggregateInput
    _sum?: TestRunSumOrderByAggregateInput
  }

  export type TestRunScalarWhereWithAggregatesInput = {
    AND?: TestRunScalarWhereWithAggregatesInput | TestRunScalarWhereWithAggregatesInput[]
    OR?: TestRunScalarWhereWithAggregatesInput[]
    NOT?: TestRunScalarWhereWithAggregatesInput | TestRunScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TestRun"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TestRun"> | Date | string
    totalCases?: IntWithAggregatesFilter<"TestRun"> | number
    tp?: IntWithAggregatesFilter<"TestRun"> | number
    fp?: IntWithAggregatesFilter<"TestRun"> | number
    fn?: IntWithAggregatesFilter<"TestRun"> | number
    precision?: FloatWithAggregatesFilter<"TestRun"> | number
    recall?: FloatWithAggregatesFilter<"TestRun"> | number
    f1?: FloatWithAggregatesFilter<"TestRun"> | number
    datasetType?: StringWithAggregatesFilter<"TestRun"> | string
  }

  export type TestCaseWhereInput = {
    AND?: TestCaseWhereInput | TestCaseWhereInput[]
    OR?: TestCaseWhereInput[]
    NOT?: TestCaseWhereInput | TestCaseWhereInput[]
    id?: IntFilter<"TestCase"> | number
    testRunId?: IntFilter<"TestCase"> | number
    caseIndex?: IntFilter<"TestCase"> | number
    problemText?: StringFilter<"TestCase"> | string
    hasMismatch?: BoolFilter<"TestCase"> | boolean
    tp?: IntFilter<"TestCase"> | number
    fp?: IntFilter<"TestCase"> | number
    fn?: IntFilter<"TestCase"> | number
    groundTruth?: StringFilter<"TestCase"> | string
    predicted?: StringFilter<"TestCase"> | string
    testRun?: XOR<TestRunScalarRelationFilter, TestRunWhereInput>
    messages?: ConversationMessageListRelationFilter
  }

  export type TestCaseOrderByWithRelationInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    problemText?: SortOrder
    hasMismatch?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    groundTruth?: SortOrder
    predicted?: SortOrder
    testRun?: TestRunOrderByWithRelationInput
    messages?: ConversationMessageOrderByRelationAggregateInput
  }

  export type TestCaseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TestCaseWhereInput | TestCaseWhereInput[]
    OR?: TestCaseWhereInput[]
    NOT?: TestCaseWhereInput | TestCaseWhereInput[]
    testRunId?: IntFilter<"TestCase"> | number
    caseIndex?: IntFilter<"TestCase"> | number
    problemText?: StringFilter<"TestCase"> | string
    hasMismatch?: BoolFilter<"TestCase"> | boolean
    tp?: IntFilter<"TestCase"> | number
    fp?: IntFilter<"TestCase"> | number
    fn?: IntFilter<"TestCase"> | number
    groundTruth?: StringFilter<"TestCase"> | string
    predicted?: StringFilter<"TestCase"> | string
    testRun?: XOR<TestRunScalarRelationFilter, TestRunWhereInput>
    messages?: ConversationMessageListRelationFilter
  }, "id">

  export type TestCaseOrderByWithAggregationInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    problemText?: SortOrder
    hasMismatch?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    groundTruth?: SortOrder
    predicted?: SortOrder
    _count?: TestCaseCountOrderByAggregateInput
    _avg?: TestCaseAvgOrderByAggregateInput
    _max?: TestCaseMaxOrderByAggregateInput
    _min?: TestCaseMinOrderByAggregateInput
    _sum?: TestCaseSumOrderByAggregateInput
  }

  export type TestCaseScalarWhereWithAggregatesInput = {
    AND?: TestCaseScalarWhereWithAggregatesInput | TestCaseScalarWhereWithAggregatesInput[]
    OR?: TestCaseScalarWhereWithAggregatesInput[]
    NOT?: TestCaseScalarWhereWithAggregatesInput | TestCaseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TestCase"> | number
    testRunId?: IntWithAggregatesFilter<"TestCase"> | number
    caseIndex?: IntWithAggregatesFilter<"TestCase"> | number
    problemText?: StringWithAggregatesFilter<"TestCase"> | string
    hasMismatch?: BoolWithAggregatesFilter<"TestCase"> | boolean
    tp?: IntWithAggregatesFilter<"TestCase"> | number
    fp?: IntWithAggregatesFilter<"TestCase"> | number
    fn?: IntWithAggregatesFilter<"TestCase"> | number
    groundTruth?: StringWithAggregatesFilter<"TestCase"> | string
    predicted?: StringWithAggregatesFilter<"TestCase"> | string
  }

  export type ConversationMessageWhereInput = {
    AND?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    OR?: ConversationMessageWhereInput[]
    NOT?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    id?: IntFilter<"ConversationMessage"> | number
    testCaseId?: IntFilter<"ConversationMessage"> | number
    msgOrder?: IntFilter<"ConversationMessage"> | number
    role?: StringFilter<"ConversationMessage"> | string
    content?: StringFilter<"ConversationMessage"> | string
    testCase?: XOR<TestCaseScalarRelationFilter, TestCaseWhereInput>
  }

  export type ConversationMessageOrderByWithRelationInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
    role?: SortOrder
    content?: SortOrder
    testCase?: TestCaseOrderByWithRelationInput
  }

  export type ConversationMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    OR?: ConversationMessageWhereInput[]
    NOT?: ConversationMessageWhereInput | ConversationMessageWhereInput[]
    testCaseId?: IntFilter<"ConversationMessage"> | number
    msgOrder?: IntFilter<"ConversationMessage"> | number
    role?: StringFilter<"ConversationMessage"> | string
    content?: StringFilter<"ConversationMessage"> | string
    testCase?: XOR<TestCaseScalarRelationFilter, TestCaseWhereInput>
  }, "id">

  export type ConversationMessageOrderByWithAggregationInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
    role?: SortOrder
    content?: SortOrder
    _count?: ConversationMessageCountOrderByAggregateInput
    _avg?: ConversationMessageAvgOrderByAggregateInput
    _max?: ConversationMessageMaxOrderByAggregateInput
    _min?: ConversationMessageMinOrderByAggregateInput
    _sum?: ConversationMessageSumOrderByAggregateInput
  }

  export type ConversationMessageScalarWhereWithAggregatesInput = {
    AND?: ConversationMessageScalarWhereWithAggregatesInput | ConversationMessageScalarWhereWithAggregatesInput[]
    OR?: ConversationMessageScalarWhereWithAggregatesInput[]
    NOT?: ConversationMessageScalarWhereWithAggregatesInput | ConversationMessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ConversationMessage"> | number
    testCaseId?: IntWithAggregatesFilter<"ConversationMessage"> | number
    msgOrder?: IntWithAggregatesFilter<"ConversationMessage"> | number
    role?: StringWithAggregatesFilter<"ConversationMessage"> | string
    content?: StringWithAggregatesFilter<"ConversationMessage"> | string
  }

  export type PostCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUncheckedCreateInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TestRunCreateInput = {
    createdAt?: Date | string
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType?: string
    testCases?: TestCaseCreateNestedManyWithoutTestRunInput
  }

  export type TestRunUncheckedCreateInput = {
    id?: number
    createdAt?: Date | string
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType?: string
    testCases?: TestCaseUncheckedCreateNestedManyWithoutTestRunInput
  }

  export type TestRunUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCases?: IntFieldUpdateOperationsInput | number
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    precision?: FloatFieldUpdateOperationsInput | number
    recall?: FloatFieldUpdateOperationsInput | number
    f1?: FloatFieldUpdateOperationsInput | number
    datasetType?: StringFieldUpdateOperationsInput | string
    testCases?: TestCaseUpdateManyWithoutTestRunNestedInput
  }

  export type TestRunUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCases?: IntFieldUpdateOperationsInput | number
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    precision?: FloatFieldUpdateOperationsInput | number
    recall?: FloatFieldUpdateOperationsInput | number
    f1?: FloatFieldUpdateOperationsInput | number
    datasetType?: StringFieldUpdateOperationsInput | string
    testCases?: TestCaseUncheckedUpdateManyWithoutTestRunNestedInput
  }

  export type TestRunCreateManyInput = {
    id?: number
    createdAt?: Date | string
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType?: string
  }

  export type TestRunUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCases?: IntFieldUpdateOperationsInput | number
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    precision?: FloatFieldUpdateOperationsInput | number
    recall?: FloatFieldUpdateOperationsInput | number
    f1?: FloatFieldUpdateOperationsInput | number
    datasetType?: StringFieldUpdateOperationsInput | string
  }

  export type TestRunUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCases?: IntFieldUpdateOperationsInput | number
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    precision?: FloatFieldUpdateOperationsInput | number
    recall?: FloatFieldUpdateOperationsInput | number
    f1?: FloatFieldUpdateOperationsInput | number
    datasetType?: StringFieldUpdateOperationsInput | string
  }

  export type TestCaseCreateInput = {
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
    testRun: TestRunCreateNestedOneWithoutTestCasesInput
    messages?: ConversationMessageCreateNestedManyWithoutTestCaseInput
  }

  export type TestCaseUncheckedCreateInput = {
    id?: number
    testRunId: number
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
    messages?: ConversationMessageUncheckedCreateNestedManyWithoutTestCaseInput
  }

  export type TestCaseUpdateInput = {
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
    testRun?: TestRunUpdateOneRequiredWithoutTestCasesNestedInput
    messages?: ConversationMessageUpdateManyWithoutTestCaseNestedInput
  }

  export type TestCaseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    testRunId?: IntFieldUpdateOperationsInput | number
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
    messages?: ConversationMessageUncheckedUpdateManyWithoutTestCaseNestedInput
  }

  export type TestCaseCreateManyInput = {
    id?: number
    testRunId: number
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
  }

  export type TestCaseUpdateManyMutationInput = {
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
  }

  export type TestCaseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    testRunId?: IntFieldUpdateOperationsInput | number
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageCreateInput = {
    msgOrder: number
    role: string
    content: string
    testCase: TestCaseCreateNestedOneWithoutMessagesInput
  }

  export type ConversationMessageUncheckedCreateInput = {
    id?: number
    testCaseId: number
    msgOrder: number
    role: string
    content: string
  }

  export type ConversationMessageUpdateInput = {
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    testCase?: TestCaseUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ConversationMessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    testCaseId?: IntFieldUpdateOperationsInput | number
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageCreateManyInput = {
    id?: number
    testCaseId: number
    msgOrder: number
    role: string
    content: string
  }

  export type ConversationMessageUpdateManyMutationInput = {
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    testCaseId?: IntFieldUpdateOperationsInput | number
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TestCaseListRelationFilter = {
    every?: TestCaseWhereInput
    some?: TestCaseWhereInput
    none?: TestCaseWhereInput
  }

  export type TestCaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TestRunCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
    datasetType?: SortOrder
  }

  export type TestRunAvgOrderByAggregateInput = {
    id?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
  }

  export type TestRunMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
    datasetType?: SortOrder
  }

  export type TestRunMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
    datasetType?: SortOrder
  }

  export type TestRunSumOrderByAggregateInput = {
    id?: SortOrder
    totalCases?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    precision?: SortOrder
    recall?: SortOrder
    f1?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TestRunScalarRelationFilter = {
    is?: TestRunWhereInput
    isNot?: TestRunWhereInput
  }

  export type ConversationMessageListRelationFilter = {
    every?: ConversationMessageWhereInput
    some?: ConversationMessageWhereInput
    none?: ConversationMessageWhereInput
  }

  export type ConversationMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TestCaseCountOrderByAggregateInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    problemText?: SortOrder
    hasMismatch?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    groundTruth?: SortOrder
    predicted?: SortOrder
  }

  export type TestCaseAvgOrderByAggregateInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
  }

  export type TestCaseMaxOrderByAggregateInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    problemText?: SortOrder
    hasMismatch?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    groundTruth?: SortOrder
    predicted?: SortOrder
  }

  export type TestCaseMinOrderByAggregateInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    problemText?: SortOrder
    hasMismatch?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
    groundTruth?: SortOrder
    predicted?: SortOrder
  }

  export type TestCaseSumOrderByAggregateInput = {
    id?: SortOrder
    testRunId?: SortOrder
    caseIndex?: SortOrder
    tp?: SortOrder
    fp?: SortOrder
    fn?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TestCaseScalarRelationFilter = {
    is?: TestCaseWhereInput
    isNot?: TestCaseWhereInput
  }

  export type ConversationMessageCountOrderByAggregateInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
    role?: SortOrder
    content?: SortOrder
  }

  export type ConversationMessageAvgOrderByAggregateInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
  }

  export type ConversationMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
    role?: SortOrder
    content?: SortOrder
  }

  export type ConversationMessageMinOrderByAggregateInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
    role?: SortOrder
    content?: SortOrder
  }

  export type ConversationMessageSumOrderByAggregateInput = {
    id?: SortOrder
    testCaseId?: SortOrder
    msgOrder?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TestCaseCreateNestedManyWithoutTestRunInput = {
    create?: XOR<TestCaseCreateWithoutTestRunInput, TestCaseUncheckedCreateWithoutTestRunInput> | TestCaseCreateWithoutTestRunInput[] | TestCaseUncheckedCreateWithoutTestRunInput[]
    connectOrCreate?: TestCaseCreateOrConnectWithoutTestRunInput | TestCaseCreateOrConnectWithoutTestRunInput[]
    createMany?: TestCaseCreateManyTestRunInputEnvelope
    connect?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
  }

  export type TestCaseUncheckedCreateNestedManyWithoutTestRunInput = {
    create?: XOR<TestCaseCreateWithoutTestRunInput, TestCaseUncheckedCreateWithoutTestRunInput> | TestCaseCreateWithoutTestRunInput[] | TestCaseUncheckedCreateWithoutTestRunInput[]
    connectOrCreate?: TestCaseCreateOrConnectWithoutTestRunInput | TestCaseCreateOrConnectWithoutTestRunInput[]
    createMany?: TestCaseCreateManyTestRunInputEnvelope
    connect?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TestCaseUpdateManyWithoutTestRunNestedInput = {
    create?: XOR<TestCaseCreateWithoutTestRunInput, TestCaseUncheckedCreateWithoutTestRunInput> | TestCaseCreateWithoutTestRunInput[] | TestCaseUncheckedCreateWithoutTestRunInput[]
    connectOrCreate?: TestCaseCreateOrConnectWithoutTestRunInput | TestCaseCreateOrConnectWithoutTestRunInput[]
    upsert?: TestCaseUpsertWithWhereUniqueWithoutTestRunInput | TestCaseUpsertWithWhereUniqueWithoutTestRunInput[]
    createMany?: TestCaseCreateManyTestRunInputEnvelope
    set?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    disconnect?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    delete?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    connect?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    update?: TestCaseUpdateWithWhereUniqueWithoutTestRunInput | TestCaseUpdateWithWhereUniqueWithoutTestRunInput[]
    updateMany?: TestCaseUpdateManyWithWhereWithoutTestRunInput | TestCaseUpdateManyWithWhereWithoutTestRunInput[]
    deleteMany?: TestCaseScalarWhereInput | TestCaseScalarWhereInput[]
  }

  export type TestCaseUncheckedUpdateManyWithoutTestRunNestedInput = {
    create?: XOR<TestCaseCreateWithoutTestRunInput, TestCaseUncheckedCreateWithoutTestRunInput> | TestCaseCreateWithoutTestRunInput[] | TestCaseUncheckedCreateWithoutTestRunInput[]
    connectOrCreate?: TestCaseCreateOrConnectWithoutTestRunInput | TestCaseCreateOrConnectWithoutTestRunInput[]
    upsert?: TestCaseUpsertWithWhereUniqueWithoutTestRunInput | TestCaseUpsertWithWhereUniqueWithoutTestRunInput[]
    createMany?: TestCaseCreateManyTestRunInputEnvelope
    set?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    disconnect?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    delete?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    connect?: TestCaseWhereUniqueInput | TestCaseWhereUniqueInput[]
    update?: TestCaseUpdateWithWhereUniqueWithoutTestRunInput | TestCaseUpdateWithWhereUniqueWithoutTestRunInput[]
    updateMany?: TestCaseUpdateManyWithWhereWithoutTestRunInput | TestCaseUpdateManyWithWhereWithoutTestRunInput[]
    deleteMany?: TestCaseScalarWhereInput | TestCaseScalarWhereInput[]
  }

  export type TestRunCreateNestedOneWithoutTestCasesInput = {
    create?: XOR<TestRunCreateWithoutTestCasesInput, TestRunUncheckedCreateWithoutTestCasesInput>
    connectOrCreate?: TestRunCreateOrConnectWithoutTestCasesInput
    connect?: TestRunWhereUniqueInput
  }

  export type ConversationMessageCreateNestedManyWithoutTestCaseInput = {
    create?: XOR<ConversationMessageCreateWithoutTestCaseInput, ConversationMessageUncheckedCreateWithoutTestCaseInput> | ConversationMessageCreateWithoutTestCaseInput[] | ConversationMessageUncheckedCreateWithoutTestCaseInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutTestCaseInput | ConversationMessageCreateOrConnectWithoutTestCaseInput[]
    createMany?: ConversationMessageCreateManyTestCaseInputEnvelope
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
  }

  export type ConversationMessageUncheckedCreateNestedManyWithoutTestCaseInput = {
    create?: XOR<ConversationMessageCreateWithoutTestCaseInput, ConversationMessageUncheckedCreateWithoutTestCaseInput> | ConversationMessageCreateWithoutTestCaseInput[] | ConversationMessageUncheckedCreateWithoutTestCaseInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutTestCaseInput | ConversationMessageCreateOrConnectWithoutTestCaseInput[]
    createMany?: ConversationMessageCreateManyTestCaseInputEnvelope
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TestRunUpdateOneRequiredWithoutTestCasesNestedInput = {
    create?: XOR<TestRunCreateWithoutTestCasesInput, TestRunUncheckedCreateWithoutTestCasesInput>
    connectOrCreate?: TestRunCreateOrConnectWithoutTestCasesInput
    upsert?: TestRunUpsertWithoutTestCasesInput
    connect?: TestRunWhereUniqueInput
    update?: XOR<XOR<TestRunUpdateToOneWithWhereWithoutTestCasesInput, TestRunUpdateWithoutTestCasesInput>, TestRunUncheckedUpdateWithoutTestCasesInput>
  }

  export type ConversationMessageUpdateManyWithoutTestCaseNestedInput = {
    create?: XOR<ConversationMessageCreateWithoutTestCaseInput, ConversationMessageUncheckedCreateWithoutTestCaseInput> | ConversationMessageCreateWithoutTestCaseInput[] | ConversationMessageUncheckedCreateWithoutTestCaseInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutTestCaseInput | ConversationMessageCreateOrConnectWithoutTestCaseInput[]
    upsert?: ConversationMessageUpsertWithWhereUniqueWithoutTestCaseInput | ConversationMessageUpsertWithWhereUniqueWithoutTestCaseInput[]
    createMany?: ConversationMessageCreateManyTestCaseInputEnvelope
    set?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    disconnect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    delete?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    update?: ConversationMessageUpdateWithWhereUniqueWithoutTestCaseInput | ConversationMessageUpdateWithWhereUniqueWithoutTestCaseInput[]
    updateMany?: ConversationMessageUpdateManyWithWhereWithoutTestCaseInput | ConversationMessageUpdateManyWithWhereWithoutTestCaseInput[]
    deleteMany?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
  }

  export type ConversationMessageUncheckedUpdateManyWithoutTestCaseNestedInput = {
    create?: XOR<ConversationMessageCreateWithoutTestCaseInput, ConversationMessageUncheckedCreateWithoutTestCaseInput> | ConversationMessageCreateWithoutTestCaseInput[] | ConversationMessageUncheckedCreateWithoutTestCaseInput[]
    connectOrCreate?: ConversationMessageCreateOrConnectWithoutTestCaseInput | ConversationMessageCreateOrConnectWithoutTestCaseInput[]
    upsert?: ConversationMessageUpsertWithWhereUniqueWithoutTestCaseInput | ConversationMessageUpsertWithWhereUniqueWithoutTestCaseInput[]
    createMany?: ConversationMessageCreateManyTestCaseInputEnvelope
    set?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    disconnect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    delete?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    connect?: ConversationMessageWhereUniqueInput | ConversationMessageWhereUniqueInput[]
    update?: ConversationMessageUpdateWithWhereUniqueWithoutTestCaseInput | ConversationMessageUpdateWithWhereUniqueWithoutTestCaseInput[]
    updateMany?: ConversationMessageUpdateManyWithWhereWithoutTestCaseInput | ConversationMessageUpdateManyWithWhereWithoutTestCaseInput[]
    deleteMany?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
  }

  export type TestCaseCreateNestedOneWithoutMessagesInput = {
    create?: XOR<TestCaseCreateWithoutMessagesInput, TestCaseUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: TestCaseCreateOrConnectWithoutMessagesInput
    connect?: TestCaseWhereUniqueInput
  }

  export type TestCaseUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<TestCaseCreateWithoutMessagesInput, TestCaseUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: TestCaseCreateOrConnectWithoutMessagesInput
    upsert?: TestCaseUpsertWithoutMessagesInput
    connect?: TestCaseWhereUniqueInput
    update?: XOR<XOR<TestCaseUpdateToOneWithWhereWithoutMessagesInput, TestCaseUpdateWithoutMessagesInput>, TestCaseUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TestCaseCreateWithoutTestRunInput = {
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
    messages?: ConversationMessageCreateNestedManyWithoutTestCaseInput
  }

  export type TestCaseUncheckedCreateWithoutTestRunInput = {
    id?: number
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
    messages?: ConversationMessageUncheckedCreateNestedManyWithoutTestCaseInput
  }

  export type TestCaseCreateOrConnectWithoutTestRunInput = {
    where: TestCaseWhereUniqueInput
    create: XOR<TestCaseCreateWithoutTestRunInput, TestCaseUncheckedCreateWithoutTestRunInput>
  }

  export type TestCaseCreateManyTestRunInputEnvelope = {
    data: TestCaseCreateManyTestRunInput | TestCaseCreateManyTestRunInput[]
    skipDuplicates?: boolean
  }

  export type TestCaseUpsertWithWhereUniqueWithoutTestRunInput = {
    where: TestCaseWhereUniqueInput
    update: XOR<TestCaseUpdateWithoutTestRunInput, TestCaseUncheckedUpdateWithoutTestRunInput>
    create: XOR<TestCaseCreateWithoutTestRunInput, TestCaseUncheckedCreateWithoutTestRunInput>
  }

  export type TestCaseUpdateWithWhereUniqueWithoutTestRunInput = {
    where: TestCaseWhereUniqueInput
    data: XOR<TestCaseUpdateWithoutTestRunInput, TestCaseUncheckedUpdateWithoutTestRunInput>
  }

  export type TestCaseUpdateManyWithWhereWithoutTestRunInput = {
    where: TestCaseScalarWhereInput
    data: XOR<TestCaseUpdateManyMutationInput, TestCaseUncheckedUpdateManyWithoutTestRunInput>
  }

  export type TestCaseScalarWhereInput = {
    AND?: TestCaseScalarWhereInput | TestCaseScalarWhereInput[]
    OR?: TestCaseScalarWhereInput[]
    NOT?: TestCaseScalarWhereInput | TestCaseScalarWhereInput[]
    id?: IntFilter<"TestCase"> | number
    testRunId?: IntFilter<"TestCase"> | number
    caseIndex?: IntFilter<"TestCase"> | number
    problemText?: StringFilter<"TestCase"> | string
    hasMismatch?: BoolFilter<"TestCase"> | boolean
    tp?: IntFilter<"TestCase"> | number
    fp?: IntFilter<"TestCase"> | number
    fn?: IntFilter<"TestCase"> | number
    groundTruth?: StringFilter<"TestCase"> | string
    predicted?: StringFilter<"TestCase"> | string
  }

  export type TestRunCreateWithoutTestCasesInput = {
    createdAt?: Date | string
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType?: string
  }

  export type TestRunUncheckedCreateWithoutTestCasesInput = {
    id?: number
    createdAt?: Date | string
    totalCases: number
    tp: number
    fp: number
    fn: number
    precision: number
    recall: number
    f1: number
    datasetType?: string
  }

  export type TestRunCreateOrConnectWithoutTestCasesInput = {
    where: TestRunWhereUniqueInput
    create: XOR<TestRunCreateWithoutTestCasesInput, TestRunUncheckedCreateWithoutTestCasesInput>
  }

  export type ConversationMessageCreateWithoutTestCaseInput = {
    msgOrder: number
    role: string
    content: string
  }

  export type ConversationMessageUncheckedCreateWithoutTestCaseInput = {
    id?: number
    msgOrder: number
    role: string
    content: string
  }

  export type ConversationMessageCreateOrConnectWithoutTestCaseInput = {
    where: ConversationMessageWhereUniqueInput
    create: XOR<ConversationMessageCreateWithoutTestCaseInput, ConversationMessageUncheckedCreateWithoutTestCaseInput>
  }

  export type ConversationMessageCreateManyTestCaseInputEnvelope = {
    data: ConversationMessageCreateManyTestCaseInput | ConversationMessageCreateManyTestCaseInput[]
    skipDuplicates?: boolean
  }

  export type TestRunUpsertWithoutTestCasesInput = {
    update: XOR<TestRunUpdateWithoutTestCasesInput, TestRunUncheckedUpdateWithoutTestCasesInput>
    create: XOR<TestRunCreateWithoutTestCasesInput, TestRunUncheckedCreateWithoutTestCasesInput>
    where?: TestRunWhereInput
  }

  export type TestRunUpdateToOneWithWhereWithoutTestCasesInput = {
    where?: TestRunWhereInput
    data: XOR<TestRunUpdateWithoutTestCasesInput, TestRunUncheckedUpdateWithoutTestCasesInput>
  }

  export type TestRunUpdateWithoutTestCasesInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCases?: IntFieldUpdateOperationsInput | number
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    precision?: FloatFieldUpdateOperationsInput | number
    recall?: FloatFieldUpdateOperationsInput | number
    f1?: FloatFieldUpdateOperationsInput | number
    datasetType?: StringFieldUpdateOperationsInput | string
  }

  export type TestRunUncheckedUpdateWithoutTestCasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCases?: IntFieldUpdateOperationsInput | number
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    precision?: FloatFieldUpdateOperationsInput | number
    recall?: FloatFieldUpdateOperationsInput | number
    f1?: FloatFieldUpdateOperationsInput | number
    datasetType?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageUpsertWithWhereUniqueWithoutTestCaseInput = {
    where: ConversationMessageWhereUniqueInput
    update: XOR<ConversationMessageUpdateWithoutTestCaseInput, ConversationMessageUncheckedUpdateWithoutTestCaseInput>
    create: XOR<ConversationMessageCreateWithoutTestCaseInput, ConversationMessageUncheckedCreateWithoutTestCaseInput>
  }

  export type ConversationMessageUpdateWithWhereUniqueWithoutTestCaseInput = {
    where: ConversationMessageWhereUniqueInput
    data: XOR<ConversationMessageUpdateWithoutTestCaseInput, ConversationMessageUncheckedUpdateWithoutTestCaseInput>
  }

  export type ConversationMessageUpdateManyWithWhereWithoutTestCaseInput = {
    where: ConversationMessageScalarWhereInput
    data: XOR<ConversationMessageUpdateManyMutationInput, ConversationMessageUncheckedUpdateManyWithoutTestCaseInput>
  }

  export type ConversationMessageScalarWhereInput = {
    AND?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
    OR?: ConversationMessageScalarWhereInput[]
    NOT?: ConversationMessageScalarWhereInput | ConversationMessageScalarWhereInput[]
    id?: IntFilter<"ConversationMessage"> | number
    testCaseId?: IntFilter<"ConversationMessage"> | number
    msgOrder?: IntFilter<"ConversationMessage"> | number
    role?: StringFilter<"ConversationMessage"> | string
    content?: StringFilter<"ConversationMessage"> | string
  }

  export type TestCaseCreateWithoutMessagesInput = {
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
    testRun: TestRunCreateNestedOneWithoutTestCasesInput
  }

  export type TestCaseUncheckedCreateWithoutMessagesInput = {
    id?: number
    testRunId: number
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
  }

  export type TestCaseCreateOrConnectWithoutMessagesInput = {
    where: TestCaseWhereUniqueInput
    create: XOR<TestCaseCreateWithoutMessagesInput, TestCaseUncheckedCreateWithoutMessagesInput>
  }

  export type TestCaseUpsertWithoutMessagesInput = {
    update: XOR<TestCaseUpdateWithoutMessagesInput, TestCaseUncheckedUpdateWithoutMessagesInput>
    create: XOR<TestCaseCreateWithoutMessagesInput, TestCaseUncheckedCreateWithoutMessagesInput>
    where?: TestCaseWhereInput
  }

  export type TestCaseUpdateToOneWithWhereWithoutMessagesInput = {
    where?: TestCaseWhereInput
    data: XOR<TestCaseUpdateWithoutMessagesInput, TestCaseUncheckedUpdateWithoutMessagesInput>
  }

  export type TestCaseUpdateWithoutMessagesInput = {
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
    testRun?: TestRunUpdateOneRequiredWithoutTestCasesNestedInput
  }

  export type TestCaseUncheckedUpdateWithoutMessagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    testRunId?: IntFieldUpdateOperationsInput | number
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
  }

  export type TestCaseCreateManyTestRunInput = {
    id?: number
    caseIndex: number
    problemText: string
    hasMismatch: boolean
    tp: number
    fp: number
    fn: number
    groundTruth: string
    predicted: string
  }

  export type TestCaseUpdateWithoutTestRunInput = {
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
    messages?: ConversationMessageUpdateManyWithoutTestCaseNestedInput
  }

  export type TestCaseUncheckedUpdateWithoutTestRunInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
    messages?: ConversationMessageUncheckedUpdateManyWithoutTestCaseNestedInput
  }

  export type TestCaseUncheckedUpdateManyWithoutTestRunInput = {
    id?: IntFieldUpdateOperationsInput | number
    caseIndex?: IntFieldUpdateOperationsInput | number
    problemText?: StringFieldUpdateOperationsInput | string
    hasMismatch?: BoolFieldUpdateOperationsInput | boolean
    tp?: IntFieldUpdateOperationsInput | number
    fp?: IntFieldUpdateOperationsInput | number
    fn?: IntFieldUpdateOperationsInput | number
    groundTruth?: StringFieldUpdateOperationsInput | string
    predicted?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageCreateManyTestCaseInput = {
    id?: number
    msgOrder: number
    role: string
    content: string
  }

  export type ConversationMessageUpdateWithoutTestCaseInput = {
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageUncheckedUpdateWithoutTestCaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }

  export type ConversationMessageUncheckedUpdateManyWithoutTestCaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    msgOrder?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}