import { Router } from "express";
import authorize from "../Middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../Controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', (req, res) => res.send ( { title: 'GET all subcriptions'}))

subscriptionRouter.get('/:id', (req, res) => res.send ( { title: 'GET subcription by id'}))

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send ( { title: 'GET upcoming renewals'}))

subscriptionRouter.post('/', authorize, createSubscription)

subscriptionRouter.put('/:id', (req, res) => res.send ( { title: 'PUT subcription by id'}))

subscriptionRouter.put('/:id/cancel', (req, res) => res.send ( { title: 'CANCEL subcription by id'}))

subscriptionRouter.delete('/:id', (req, res) => res.send ( { title: 'DELETE subcription by id'}))


export default subscriptionRouter;