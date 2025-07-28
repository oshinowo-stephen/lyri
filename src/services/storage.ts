import {
  Prisma,
  GuildPlayer,
  PrismaClient,
} from '.prisma/client'

const prisma = new PrismaClient()

type PrismaMethods =
  | '$on'
  | '$connect'
  | '$disconnect'
  | '$use'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$transaction'

type PrismaModelsDelegate = {
  [K in Extract<keyof PrismaClient, string>]: PrismaClient[K] extends { create: Function }
    ? K
    : never
}[Extract<keyof PrismaClient, string>]

type Models = Exclude<Extract<keyof PrismaClient, string>, PrismaMethods>

type PrismaModels = PrismaModelsDelegate & Models

type PrismaData = GuildPlayer | GuildPlayer[]
type PrismaCreateArgs = Prisma.GuildPlayerCreateArgs
type PrimsaUpdateArgs = Prisma.GuildPlayerUpdateArgs
type PrismaFindArgs = Prisma.GuildPlayerFindFirstArgs
type PrismaFindManyArgs = Prisma.GuildPlayerFindManyArgs

export class PrismaError extends Error {
  type: 'OTHER'
    | 'INSERT'
    | 'FETCH'
    | 'UPDATE'
    | 'DELETE'
  reason: string

  constructor(
    message: string,
    error: Error,
    type?: 'INSERT'
      | 'FETCH'
      | 'UPDATE'
      | 'DELETE'
  ) {
    super(message)
    this.message = message
    this.type = type ?? 'OTHER'
    this.name = 'PRISMA_ERROR'
    this.reason = error.message
  }
}

export const insert = async <
  T extends PrismaModels,
  A extends PrismaCreateArgs
>(model: T, args: A): Promise<void> => {
  try {
    if (prisma[model] !== undefined) await prisma[model].create(args)
  } catch (error) {
    throw new PrismaError('Unable to insert data.', (error as Error), 'INSERT')
  }
}

export const fetch = async<
  T extends PrismaModels,
  A extends PrismaFindArgs,
  D extends PrismaData
>(model: T, args: A): Promise<D> => {
  try {
    return (await prisma[model].findFirstOrThrow(args)) as D
  } catch(error) {
    throw new PrismaError('Unable to fetch data.', (error as Error), 'FETCH')
  }
}

export const fetchAll = async <
  T extends PrismaModels,
  A extends PrismaFindManyArgs,
  D extends PrismaData
>(model: T, args: A): Promise<D> => {
  try {
    return (await prisma[model].findMany(args)) as D
  } catch (error) {
    throw new PrismaError('Unable to fetchAll data.', (error as Error), 'FETCH')
  }
}

export const update = async<
  T extends PrismaModels,
  A extends PrimsaUpdateArgs,
>(model: T, args: A): Promise<void> => {
  try {
    await prisma[model].update(args)
  } catch (error) {
    throw new PrismaError('Unable to update.', (error as Error), 'UPDATE')
  }
}

export const initialize = async <M extends PrismaModels, D extends PrismaData>(model: M, data: D): Promise<void> => {
  try {
    await insert(model, { data: data as any })
  } catch(error) {
    throw new PrismaError('Unable to initalize guild-player', (error as Error))
  }
}
