import { initTRPC } from 'node:@trpc/server'
import { Hono } from 'https://deno.land/x/hono@v3.1.5/mod.ts'
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts'
import { trpcServer } from '../src/index.ts'

describe('tRPC Adapter Middleware', () => {
  const t = initTRPC.create()

  const publicProcedure = t.procedure
  const router = t.router

  const appRouter = router({
    hello: publicProcedure.input(z.string().nullish()).query(({ input }) => {
      return `Hello ${input ?? 'World'}`
    }),
  })

  const app = new Hono()

  app.use(
    '/trpc/*',
    trpcServer({
      router: appRouter,
    })
  )

  it('Should return 200 response', async () => {
    const searchParams = new URLSearchParams({
      input: JSON.stringify({ '0': 'Hono' }),
      batch: '1',
    })
    const req = new Request(`http://localhost/trpc/hello?${searchParams.toString()}`)
    const res = await app.request(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([
      {
        result: {
          data: 'Hello Hono',
        },
      },
    ])
  })
})
