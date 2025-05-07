import { Router } from "express";

const subcriptionRouter = Router()

subcriptionRouter.get('/', (req, res) => res.send ( { title: 'GET all subcriptions'}))

subcriptionRouter.get('/:id', (req, res) => res.send ( { title: 'GET subcription by id'}))

subcriptionRouter.get('/user/:id', (req, res) => res.send ( { title: 'GET all user subcriptions'}))

subcriptionRouter.get('/upcoming-renewals', (req, res) => res.send ( { title: 'GET upcoming renewals'}))

subcriptionRouter.post('/', (req, res) => res.send ( { title: 'POST subcription'}))

subcriptionRouter.put('/:id', (req, res) => res.send ( { title: 'PUT subcription by id'}))

subcriptionRouter.put('/:id/cancel', (req, res) => res.send ( { title: 'CANCEL subcription by id'}))


subcriptionRouter.delete('/:id', (req, res) => res.send ( { title: 'DELETE subcription by id'}))


export default subcriptionRouter;