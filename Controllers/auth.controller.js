import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js"

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const token = jwt.sign(
      { userId: newUser[0]._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN } 
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "User created successfully",
      success: true,
      data: { token, user: newUser[0] },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            const error = new Error('Invalid password')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        res.status(200).json({
            message: 'User signed in successfully',
            success: true,
            data: { token, user }
        })
        
    } catch (error) {
        
    }
}

export const signOut = async (req, res, next) => {
}
