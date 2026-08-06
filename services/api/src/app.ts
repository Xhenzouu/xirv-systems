import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"

import routes from "./routes/index.js"

import {
  errorHandler,
  notFound,
  httpLogger,
  requestId,
} from "./middleware/index.js"

const app = express()

app.use(helmet())
app.use(compression())
app.use(requestId)
app.use(cors())
app.use(express.json())
app.use(httpLogger)

app.use("/", routes)

app.use(notFound)
app.use(errorHandler)

export default app