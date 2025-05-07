import { Router } from "express";
import { signIn, signOut, signUp } from "../Controllers/auth.controller.js";

const authRouter = Router()

// (POST) URL: /api/v1/auth/signUp
authRouter.post('/sign-up', signUp)

// (POST) URL: /api/v1/auth/signIn
authRouter.post('/sign-in', signIn)

// (POST) URL: /api/v1/auth/signOut
authRouter.post('/sign-out', signOut)

export default authRouter