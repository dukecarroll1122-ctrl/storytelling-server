import { defineConfig } from 'prisma/config'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    url: process.env.DATABASE_URL,
  },
  datasource: {
    adapter: () => {
      const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      })
      return new PrismaPg(pool)
    },
  },
})