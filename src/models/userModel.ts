import mongoose from "mongoose";
import { JWTInterface, IUserAuth, IUserMethods, UserModel } from "../types"
import bcrypt from 'bcrypt'
import isEmail from 'validator/lib/isEmail'
import crypto from "crypto";
const confirmPasswordValidator = {
    validator: function (this: IUserAuth, confirmPassword: string) {
        if (this.password === confirmPassword) return true
        return false
    },
    message: (props: { value: string }) => `Your password don't match! Try again.`
}

const userSchema = new mongoose.Schema<IUserAuth, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: [true, "Please enter a valid username."]
        }, email: {
            type: String,
            unique: true,
            required: [true, "Please enter your email."],
            validate: {
                validator: function (email: string) {
                    return isEmail(email)
                }
            }
        }, password: {
            type: String,
            required: [true, "Please enter a password."],
            minlength: 8
        },
        passwordUpdated: {
            type: Number,
            default: Date.now()
        },
        role: {
            type: String,
            default: "USER"
        },
        confirmPassword: {
            type: String,
            required: [true, "Please repeat your password."],
            minlength: 8,
            validate: confirmPasswordValidator
        },
        newPW_Token: {
            type: String,
            default: "",
            index: true
        },
        newPW_TokenExp: {
            type: Number,
            default: 0
        },
        newPW_Pending: {
            type: Boolean,
            default: false
        }
    }
)


userSchema.method("isPasswordOlderThenToken", function isPasswordOlderThenToken({ iat }: JWTInterface) {
    const lastUpdate = Math.floor(this.passwordUpdated / 1000);
    return lastUpdate <= iat ? true : false
})

userSchema.method("createCryptoToken", function createCryptoToken() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest('hex')
    this.newPW_Token = hashedToken
    this.newPW_Pending = true
    this.newPW_TokenExp = (Date.now() + 10) * 60 * 1000

    return resetToken
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.isNew) return next()
    this.passwordUpdated = Date.now() - 2000
    next()
})

//pre middleware is before sending data to MongoDB but after validation.
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.hash(this.password, 12)
    this.password = salt
    this.confirmPassword = ""

    next()
})

export const User = mongoose.model<IUserAuth, UserModel>("User", userSchema)

