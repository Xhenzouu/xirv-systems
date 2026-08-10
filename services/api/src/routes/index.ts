import { Router } from "express"

import v1Routes from "./v1/index.js"
import swaggerRoutes from "./swagger.routes.js"

const router = Router()

// API routes
router.use("/api/v1", v1Routes)

// Documentation routes
router.use("/api", swaggerRoutes)

export default router