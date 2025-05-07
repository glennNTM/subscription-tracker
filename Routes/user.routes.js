import { Router } from 'express';
import { getUser, getUsers } from '../Controllers/user.controller.js'
import authorize from '../Middlewares/auth.middleware.js';

const userRouter = Router();

// GET all users
userRouter.get('/', getUsers)

// GET user by ID
userRouter.get('/:id',authorize, getUser)

// POST new user
userRouter.post('/users', (req, res) => {
    const newUser = req.body;
    res.status(201).json({ message: 'User created', data: newUser });
});

// PUT update user by ID
userRouter.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    res.json({ message: `User ${id} updated`, data: updatedData });
});

// DELETE user by ID
userRouter.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `User ${id} deleted` });
});

export default userRouter;
