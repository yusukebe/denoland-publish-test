import type { MiddlewareHandler } from 'https://deno.land/x/hono@v3.1.5/mod.ts'

export const hello = (message: string = 'Hello!'): MiddlewareHandler => {
  return async (c, next) => {
    await next()
    c.res.headers.append('X-Message', message)
  }
}
