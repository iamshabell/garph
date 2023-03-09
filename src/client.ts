import { Infer, AnyInput, AnyInterface, AnyString, AnyID, AnyBoolean, AnyNumber, AnyList, AnyOptional, AnyArgs, AnyUnion, AnyEnum, AnyScalar, AnyRef, AnyObject } from './index'
import { ExpandRecursively } from './utils'

export type ClientTypes = {
  query: AnyObject
  mutation?: AnyObject
  subscription?: AnyObject
}

export type InferClient<T extends ClientTypes> = {
  [K in keyof T]: InferClientTypes<T[K]>
}

export type InferClientTypes<T> = ExpandRecursively<InferClientTypesRaw<T>>
export type InferClientTypesRaw<T> = T extends AnyInput | AnyObject | AnyInterface ? {
  __typename: T['_name']
} & {
  [K in keyof T['_shape'] as T['_shape'][K] extends AnyOptional ? never : K]: InferClientTypesRaw<T['_shape'][K]>
} & {
  [K in keyof T['_shape'] as T['_shape'][K] extends AnyOptional ? K : never]?: InferClientTypesRaw<T['_shape'][K]>
}: InferClientTypesShallow<T>

export type InferClientTypesShallow<T> =
  T extends AnyString | AnyID | AnyNumber | AnyBoolean ? T['_shape'] :
  T extends AnyScalar ? T['_output'] :
  T extends AnyEnum ? T['_inner'] :
  T extends AnyUnion ? {
    $on: {
      __typename: keyof {
        [K in keyof T['_inner'] as T['_inner'][K]['_name']]: never
      }
    } & {
      [K in keyof T['_inner'] as T['_inner'][K]['_name']]: InferClientTypesRaw<T['_inner'][K]>
    }
  } :
  T extends AnyList ? InferClientTypesRaw<T['_shape']>[] :
  T extends AnyOptional ? InferClientTypesRaw<T['_shape']> | null | undefined :
  T extends AnyArgs ? (args?: InferClientTypesArgs<T>) => InferClientTypes<T['_shape']> :
  T extends AnyRef ? InferClientTypesRaw<ReturnType<T['_shape']>> :
  T

export type InferClientTypesArgs<T> = ExpandRecursively<InferClientTypesArgsRaw<T>>
export type InferClientTypesArgsRaw<T> = T extends AnyArgs ? {
  [K in keyof T['_args'] as T['_args'][K] extends AnyOptional ? never : K]: Infer<T['_args'][K]>
} & {
  [K in keyof T['_args'] as T['_args'][K] extends AnyOptional ? K : never]?: Infer<T['_args'][K]>
}: never
