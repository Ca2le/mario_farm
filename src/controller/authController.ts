import JWT from 'jsonwebtoken'
import { Request, Response, NextFunction, response } from "express";
import { User } from "../models/userModel";
import { CustomRequest, JWTInterface, IUserAuth, IUserMethods, UserModel, IForgotPasswordContent, EmailContent } from "../types";
import { generateResponse, httpStatus } from "../utils/generateResponse";
import bcrypt from 'bcrypt';
import { catchAsyncError } from '../utils/catchAsyncError';
import { AppError } from '../utils/appError';
import { Types } from 'mongoose';
import { Email } from '../utils/email'
import crypto from "crypto";
import { strict } from 'assert';

const createJWT = async (id: Types.ObjectId) => {
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
        const token = await createJWT(user._id)
        res.cookie("token_001", token, {
            expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES)),
            httpOnly: true
        })
        generateResponse(res, httpStatus.CREATED, `${name} was succesfully created`);
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

                const token = await createJWT(user._id);
                res.cookie("token_001", token, {
                    expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES)),
                    httpOnly: true
                })
                generateResponse(res, httpStatus.OK, `Welcome Darth ${user.name}, you are logged in.`)
            }
            else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
        } else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
    }
    catch (err) {
        generateResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Element was not created.`, err)
    }
}


export const authCheck = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    console.log('🍪', req.cookies, '🌑')
    const { token_001 } = req.headers

    if (process.env.JWT_SECRET && token_001.startsWith("Bearer")) {
        const hashedToken = token_001.replace(/^Bearer\s+/i, '')
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
        next(new AppError("Password is not up to date.", httpStatus.UNAUTHORIZED))
    } else return next(new AppError("Not auth I gess.... 🚫🥗", httpStatus.UNAUTHORIZED))
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
    } else generateResponse(res, httpStatus.FORBIDDEN, "forbidden")

})

export const forgotPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const emailID = req.body.email
    const user = await User.findOne({ email: emailID })
    if (!user) {
        return next(new AppError("If email exists it will be sent with reset link.", httpStatus.OK))
    }
    const content: IForgotPasswordContent = {
        template: 'forgot_password.html',
        name: user.name,
        email: user.email,
        payload: user.createSha256Token('password')
    }
    try {
        await user.save({ validateBeforeSave: false })
        new Email(content).send()
        generateResponse(res, httpStatus.OK, "Email was sent!")
    } catch (err) {
        user.pwToken = ""
        user.pwTokenExp = 0
        await user.save({ validateBeforeSave: false })
        next(new AppError("Unable to send email", httpStatus.INTERNAL_SERVER_ERROR))
    }
})

export const tokenVerification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

})

export const passwordVerification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user) {
        const validUser = await bcrypt.compare(password, user.password)
        if (validUser) {
            const pin = user.createSha256Token('pin')
            let content: EmailContent = {
                name: user.name,
                email: user.email,
                template: 'email_verification',
            }
            for (let i = 0; i < 8; i++) {
                const key = `key${i}`
                content[key] = pin.charAt(i)
            }
            user.save({ validateBeforeSave: false })

            new Email(content).send()

            generateResponse(res, httpStatus.OK, `Pin was succesfully created!`, `${user._id}`)
        }
        else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
    } else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")
})

export const emailPinVerification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { pin } = req.body
    const user = await User.findById(id)
    const currentTime = Date.now()
    if (user) {
        if (user.pinExp > currentTime) {
            const validUser = await bcrypt.compare(pin, user.pin)
            if (validUser) {
                const token = await createJWT(user._id);
                res.cookie("token_001", token, {
                    maxAge: 9000000,
                    sameSite: 'strict',
                    path: '/',
                    httpOnly: true,
                    domain: '127.0.0.1'
                })
                const startingData = await User.findById(id)
                generateResponse(res, httpStatus.OK, `'Cookie? 🍪🧐' to -> ${user.name}! 😎`, user.name)
            } else {

                generateResponse(res, httpStatus.UNAUTHORIZED, `Bad pin!😒`)
            }
        } else {
            user.resetPin()
            user.save({ validateBeforeSave: false })
            generateResponse(res, httpStatus.UNAUTHORIZED, `Pincode is out of date!🧐 Try again.`)
        }
    } else generateResponse(res, httpStatus.UNAUTHORIZED, "Please try another email or password.")



})

export const resetPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let user
    const urlToken = req.params.token
    const currentTime = Date.now()
    const hashedToken = crypto.createHash("sha256").update(urlToken).digest('hex')
    const activeUsers = await User.find({
        pwToken: hashedToken,
        pwTokenExp: { $gt: currentTime }
    })

    if (activeUsers.length > 0) {
        if (activeUsers.length > 1) {
            return next(new AppError("Dublicated active token error, reset password denied, try again in 10 minutes.", httpStatus.INTERNAL_SERVER_ERROR))
        }
        user = activeUsers[0]
        user.password = req.body.password
        user.confirmPassword = req.body.confirmPassword
        user.pwToken = ""
        user.pwTokenExp = 0
        await user.save()
        const newToken = await createJWT(user._id)
        generateResponse(res, httpStatus.OK, "Succefully reseted the password.", newToken)
    } else {
        next(new AppError("Token expired...", httpStatus.BAD_REQUEST))
    }

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
            return generateResponse(res, httpStatus.OK, "Password has been updated", createJWT(user._id))
        }
    }
    next(new AppError("Could not update password", httpStatus.INTERNAL_SERVER_ERROR))
})