import { Router } from "express";
import { createTryout, getAllTryouts, getTryoutById, getReadyTryouts, getTryoutsByUserId, getMyTryouts, updateTryout, deleteTryoutById } from "../controllers/tryout.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { get } from "http";

const tryoutRouter: Router = Router()


tryoutRouter.post('/', authenticateUser, createTryout) // POST
tryoutRouter.get('/by-me', authenticateUser, getMyTryouts) // GETBYMe

tryoutRouter.get('/', getAllTryouts) // GETALL
tryoutRouter.get('/ready', getReadyTryouts) // GETALL
tryoutRouter.get('/:tryoutId', getTryoutById) // GETBYID
tryoutRouter.get('/by-user/:userId', getTryoutsByUserId) // GETBYUSERID

tryoutRouter.put('/:tryoutId', authenticateUser, updateTryout) // PUT
tryoutRouter.delete('/:tryoutId', authenticateUser, deleteTryoutById) // DELETE


export default tryoutRouter