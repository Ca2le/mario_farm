import JWT from 'jsonwebtoken'
import { Request, Response, NextFunction, response } from "express";
import { User } from "../models/userModel";
import { CustomRequest, JWTInterface, IUserAuth, IUserMethods, UserModel } from "../types";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import bcrypt from 'bcrypt';
import { catchAsyncError } from '../utils/catchAsyncError';
import { AppError } from '../utils/appError';
import { Types } from 'mongoose';
import { sendEmailWith } from '../utils/sendEmail';
import crypto from "crypto";

const generateToken = async (id: Types.ObjectId) => {
    const expiresIn = process.env.JWT_TIME_STAMP
    const secret = process.env.JWT_SECRET

    if (expiresIn && secret) {
        return JWT.sign({ id }, secret, { expiresIn })
    } else throw new Error("Failed to generate token!🐮")
}

export async function signUp(req: Request, res: Response) {
    try {
        const { name, email, password, confirmPassword, avatar, role } = req.body
        const userObj = {
            name,
            email,
            password,
            confirmPassword,
            avatar,
            role
        }
        const user = await User.create(userObj)
        const token = await generateToken(user._id)
        generateResponse(res, httpStatus.CREATED, `${name} was succesfully created`, token);
    }
    catch (err) {
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err)
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            const validUser = await bcrypt.compare(password, user.password)
            if (validUser && process.env.COOKIE_EXPIRES) {
       
                const token = await generateToken(user._id)
               
                res.cookie("TokenBlack", token, {
                    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES)),
                    httpOnly: true
                })
                generateResponse(res, httpStatus.OK, `Welcome ${user.name}-kenobi`)
            }
            else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
        } else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
    }
    catch (err) {
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err)
    }
}

export const authCheck = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (typeof (authorization) === "string" && process.env.JWT_SECRET && authorization.startsWith("Bearer")) {
        const hashedToken = authorization.replace(/^Bearer\s+/i, '')
        const token = await decodeToken(hashedToken, process.env.JWT_SECRET)
        const user = await User.findById(token.id)
        if (!user) {
            return next(new AppError("User dont exist or dont have access to this route.🔒", httpStatus.UNAUTHORIZED))
        }

        const passwordIsUpToDate = user.isPasswordOlderThenToken(token)
        if (passwordIsUpToDate) {
            const { password, confirmPassword, ...rest } = user.toObject()
            req.user = rest
            return next()
        }
        next(new AppError("Password is not up to date.", httpStatus.BAD_REQUEST))

    } else {
        console.log("Not auth I gess.... 🚫🥗")
        generateResponse(res, httpStatus.OK, "Ok")
    }
})

const decodeToken = async (token: string, secret: string): Promise<JWTInterface> => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                if (typeof (decoded) === "string" || !decoded) {
                    reject(decoded)
                } else {
                    resolve(decoded as JWTInterface)
                }
            }

        })
    })
}

export const restricted = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user.role === "ADMIN") {
        next()
    } else generateResponse(res, httpStatus.FORBIDDEN, "piss off you little wanker")

})

export const forgotPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return next(new AppError("If email exists it will be sent with reset link.", httpStatus.OK))
    }

    const mailContent = {
        name: user.name,
        email: user.email,
        token: user.createCryptoToken(),
        url: process.env.NODE_ENV === "DEVELOPMENT" ? "http://127.0.0.1:5000" : "www.api.jumpcode.org"
    }
    await user.save({ validateBeforeSave: false })
    try {
        await sendEmailWith(mailContent)
        generateResponse(res, httpStatus.OK, "Email was sent!")
    } catch (err) {
        user.newPW_Token = ""
        user.newPW_TokenExp = 0
        await user.save({ validateBeforeSave: false })
        next(new AppError("Unable to send email", httpStatus.INTERNAL_SERVER_ERROR))
    }
})

export const resetPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let user
    const urlToken = req.params.token
    const currentTime = Date.now()
    const hashedToken = crypto.createHash("sha256").update(urlToken).digest('hex')
    const activeUsers = await User.find({
        newPW_Token: hashedToken,
        newPW_TokenExp: { $gt: currentTime }
    })

    if (activeUsers.length > 1) {
        return next(new AppError("Dublicated active token error, reset password denied, try again in 10 minutes.", httpStatus.INTERNAL_SERVER_ERROR))
    }
    user = activeUsers[0]
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.newPW_Pending = false
    user.newPW_Token = ""
    user.newPW_TokenExp = 0
    await user.save()
    const newToken = await generateToken(user._id)
    generateResponse(res, httpStatus.OK, "Succefully reseted the password.", newToken)
}
)

export const updatePassword = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    const ID = req.user.id
    const user = await User.findById(ID)
    const { password, confirmPassword, oldPassword } = req.body
    if (process.env.JWT_SECRET && user) {
        const isAuth = await bcrypt.compare(oldPassword, user.password)
        if (isAuth) {
            user.password = password
            user.confirmPassword = confirmPassword
            await user.save()
            return generateResponse(res, httpStatus.OK, "Password has been updated", generateToken(user._id))
        }
    }
    next(new AppError("Could not update password", httpStatus.INTERNAL_SERVER_ERROR))
})