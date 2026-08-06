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

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body

    const user = await registerUser(
      fullName,
      email,
      password,
    )

    return created(
      res,
      {
        fullName: user.fullName,
        email: user.email,
      },
      "User registered successfully.",
    )
  } catch (error) {
    next(error)
  }
}

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

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log(req.body)

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