import type { AnyRouter } from 'node:@trpc/server'
import type { FetchHandlerRequestOptions } from 'node:@trpc/server/adapters/fetch'
import { fetchRequestHandler } from 'node:@trpc/server/adapters/fetch'
import type { MiddlewareHandler } from 'https://deno.land/x/hono@v3.1.5/mod.ts'

type tRPCOptions = Omit<FetchHandlerRequestOptions<AnyRouter>, 'req' | 'endpoint'> &
  Partial<Pick<FetchHandlerRequestOptions<AnyRouter>, 'endpoint'>>

export const trpcServer = ({ endpoint = '/trpc', ...rest }: tRPCOptions): MiddlewareHandler => {
  return async (c) => {
    const res = fetchRequestHandler({
      ...rest,
      endpoint,
      req: c.req.raw,
    })
    return res
  }
}
