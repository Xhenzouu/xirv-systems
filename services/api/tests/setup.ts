import dotenv from "dotenv"

import {
  beforeEach,
} from "vitest"

import {
  clearDatabase,
} from "./helpers/database.js"

dotenv.config({
  path: ".env.test",
})

beforeEach(async () => {
  await clearDatabase()
})