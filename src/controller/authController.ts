import JWT from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { IUser } from "../types";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import bcrypt from 'bcrypt';

interface CustomRequest extends Request {
    headers: {
        auth_token?: string;
    };
}

const generateToken = async (id: string) => {
    const expiresIn = process.env.JWT_TIME_STAMP
    const secret = process.env.JWT_SECRET

    if (expiresIn && secret) {
        return JWT.sign({ id }, secret, { expiresIn })
    } else throw new Error("Failed to generate token!🐮")

}

export async function signUp(req: Request, res: Response) {
    try {
        const { name, email, password, confirmPassword, avatar } = req.body

        const userObj = {
            name,
            email,
            password,
            confirmPassword,
            avatar
        }

        const user = await User.create(userObj)
        const token = await generateToken(user._id)
        generateResponse(res, 201, `${name} was succesfully created with token: ${token}`);

    }
    catch (err) {
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err)
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { _id, email, password } = req.body

        const user = await User.findOne({ email }) as null | IUser

        if (user) {
            const validUser = await bcrypt.compare(password, user.password)
            if (validUser) {
                const token = await generateToken(_id)
                generateResponse(res, httpStatus.OK, `Welcome ${user.name}-kenobi`, token)
            }
            else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
        } else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")

    }
    catch (err) {
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err)
    }
}

export async function routeAuth(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("header,: ", req.header)
        console.log("headerS,: ", req.headers)
        const { authorization } = req.headers
        if (typeof (authorization) === "string" && process.env.JWT_SECRET) {

            const token = authorization.replace(/^Bearer\s+/i, '')
            console.log(token)
            const payload = JWT.verify(token, process.env.JWT_SECRET)

            console.log("payload👳🏿 ", payload)

            next()
        }
        else {
            console.log("Not auth I gess.... 🚫🥗")
            generateResponse(res, httpStatus.OK, "Ok")
        }

    } catch (err) {
        generateResponse(res, httpStatus.UNAUTHORIZED, "Bad token")
    }

}
