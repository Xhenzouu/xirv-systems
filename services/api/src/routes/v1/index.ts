import { Router } from "express"

import authRoutes from "../auth.routes.js"
import userRoutes from "./user.routes.js"
import adminRoutes from "./admin.routes.js"
import documentRoutes from "./documents.routes.js"
import categoryRoutes from "./categories.routes.js"
import tagRoutes from "./tags.routes.js"
import aiRoutes from "./ai.routes.js"
import ragRoutes from "./rag.routes.js"
import workflowRoutes from "./workflow.routes.js"
import invitationRoutes from './invitation.routes.js';

const router = Router()

router.get("/", (_, res) => {
  res.json({
    name: "XIRV Systems API",
    version: "v1",
    status: "online",
  })
})

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/admin", adminRoutes)
router.use("/documents", documentRoutes)
router.use("/categories", categoryRoutes)
router.use("/tags", tagRoutes)
router.use("/ai", aiRoutes)
router.use("/rag", ragRoutes)
router.use("/workflows", workflowRoutes)
router.use('/invitations', invitationRoutes);

export default router