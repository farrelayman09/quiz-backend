import { NextFunction, Request, Response } from "express";
// import { generateToken } from "../controllers/auth.controller";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import UserRequestInterface  from "../interfaces/requestInterfaces/userRequest.interface";
import User from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import { generateToken } from "../controllers/auth.controller";

dotenv.config();

interface Id {
    id: string,
    iat: any,
    exp: any
}

const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeaders = req.headers['authorization']
    var accessToken = authHeaders?.split(' ')[1]
    if (accessToken === undefined) {
        return res.sendStatus(401)
    }
    try {
        var idObject = jwt.verify(accessToken, (process.env as any).ACCESS_TOKEN_SECRET) as Id
        var user: User | null = await UserModel.findById(idObject.id)
        if (! user) {
            generateToken(req, res)
            accessToken = req.cookies['ACCESS_TOKEN_USER'] as string
            idObject = jwt.verify(accessToken, (process.env as any).ACCESS_TOKEN_SECRET) as Id
            user = await UserModel.findById(idObject.id)
            if (user) {
                req.user = user
                next()
                return
            }
            res.status(403).send("Anda harus login terlebih dahulu.")
            return
        }
        req.user = user
        next()
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export {authenticateUser}