import dotenv from "dotenv"

dotenv.config({
  path: ".env.test",
})

// Don't clear database automatically - let each test handle its own setup
// This prevents conflicts between tests