import {
  afterAll,
} from "vitest"

import {
  disconnectDatabase,
} from "./helpers/database.js"

afterAll(async () => {
  await disconnectDatabase()
})