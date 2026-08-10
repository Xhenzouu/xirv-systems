import { Router } from "express"
import swaggerUi from "swagger-ui-express"

import { swaggerSpec } from "../config/swagger.js"

const router = Router()

// Serve Swagger UI
router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "XIRV Systems API Docs",
  }),
)

// Serve OpenAPI spec as JSON
router.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})

export default router