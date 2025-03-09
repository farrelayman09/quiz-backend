import { Request, Response } from 'express'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../models/user.model'
import TokenModel from '../models/token.model'
import LoginRequestInterface from '../interfaces/requestInterfaces/loginRequest.interface'
import RegisterRequestBody from '../interfaces/requestInterfaces/registerRequest.interface'
import exp from 'constants'
import UserInterface from '../interfaces/user.interface'

interface Id {
    id: string,
    iat: any,
    exp: any
}
dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password, }: RegisterRequestBody = req.body as RegisterRequestBody

        // Check if username already exists
        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username sudah dipakai" });
        }

        // Hash Password and create newUser
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ username, password: hashedPassword })
        newUser.save()
        res.status(200).json({ newUser })
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}


const login = async (req: Request, res: Response): Promise<any> => {
    const { username, password }: LoginRequestInterface = req.body as LoginRequestInterface
    try {
        if (!username || !password) return res.status(404).send("username dan password harus diisi")
        const user = await UserModel.findOne({ username })
        if (!user) return res.status(404).send(`tidak ditemukan user dengan username ${username}`)
        if (!(await bcrypt.compare(password, user.password))) return res.status(401).send("password tidak sesuai!")

        const userIdObject = { id: user._id }
        const accessToken = jwt.sign(userIdObject, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(userIdObject, REFRESH_TOKEN_SECRET, { expiresIn: '60m' })

        res.cookie("REFRESH_TOKEN_USER", refreshToken, {
            httpOnly: true,    
            sameSite: 'strict' 
        })

        const newToken = new TokenModel({ userId: user._id, refreshToken })
        await newToken.save()

        res.status(200).json({ accessToken, user: { id: user._id, username: user.username } });
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        // console.log(req.cookies['REFRESH_TOKEN_USER'])
        await TokenModel.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] })
        await TokenModel.deleteMany({})
        res.cookie("ACCESS_TOKEN_USER", "")
        res.cookie("REFRESH_TOKEN_USER", "")
        res.status(204).send("Berhasil logout")
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}


const generateToken = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.cookies['REFRESH_TOKEN_USER']
    if (!refreshToken) return res.sendStatus(401)
    if (!(await TokenModel.findOne({ refreshToken }))) return res.sendStatus(403)

    try {
        const { id } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { id: string };
        const user: UserInterface | null = await UserModel.findById(id)
        if (!user) return res.sendStatus(403)

        const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });


        // res.cookie("ACCESS_TOKEN_USER", accessToken, {
        //     httpOnly: true,
        //     sameSite: 'strict',
        // })

        res.json({ accessToken })
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { register, login, logout, generateToken }