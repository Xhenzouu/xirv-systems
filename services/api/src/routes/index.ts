import { Router } from "express"

import v1Routes from "./v1/index.js"
import healthRoutes from "./health.routes.js"

const router = Router()

router.use("/health", healthRoutes)
router.use("/api/v1", v1Routes)

export default router