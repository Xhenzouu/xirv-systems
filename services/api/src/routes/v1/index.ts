import { Router } from "express"

import authRoutes from "../auth.routes.js"
import userRoutes from "./user.routes.js"
import adminRoutes from "./admin.routes.js"


const router = Router()


router.get("/", (_, res) => {
  res.json({
    name: "XIRV Systems API",
    version: "v1",
    status: "online",
  })
})


router.use(
  "/auth",
  authRoutes,
)

router.use(
  "/users",
  userRoutes,
)

router.use(
  "/admin",
  adminRoutes,
)


export default router