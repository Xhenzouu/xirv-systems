import type {
  NextFunction,
  Request,
  Response,
} from "express"

import {
  loginUser,
  registerUser,
  refreshLogin,
  logoutUser,
} from "../services/index.js"

import {
  created,
  ok,
} from "../utils/response.js"

import { deleteRedisPattern } from "../services/redis.service.js"

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *       409:
 *         description: Email already exists
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body

    const user = await registerUser(
      firstName,
      lastName,
      email,
      password,
    )

    await deleteRedisPattern(`admin:users:*`)

    return created(
      res,
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      "User registered successfully.",
    )
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to the platform
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Invalid credentials
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      email,
      password,
    } = req.body

    const result = await loginUser(
      email,
      password,
    )

    return ok(
      res,
      result,
      "Login successful.",
    )
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      refreshToken,
    } = req.body

    const result = await refreshLogin(
      refreshToken,
    )

    return ok(
      res,
      result,
      "Token refreshed successfully.",
    )
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout from the platform
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIs...
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful.
 *                 data:
 *                   type: null
 *       401:
 *         description: Invalid refresh token
 */
export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      refreshToken,
    } = req.body

    await logoutUser(
      refreshToken,
    )

    return ok(
      res,
      null,
      "Logout successful.",
    )
  } catch(error) {
    next(error)
  }
}