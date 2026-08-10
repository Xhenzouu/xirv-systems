import swaggerJSDoc from "swagger-jsdoc"

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "XIRV Systems API",
      version: "1.0.0",
      description: "Enterprise Intelligence Platform API",
      contact: {
        name: "XIRV Systems",
        email: "support@xirv.systems",
      },
      license: {
        name: "Proprietary",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development Server",
      },
      {
        url: "https://api.xirv.systems/api/v1",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Will be filled from JSDoc comments
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Admin", description: "Administrative endpoints" },
    ],
  },
  apis: ["./src/controllers/*.ts", "./src/validation/*.ts"],
}

export const swaggerSpec = swaggerJSDoc(options)