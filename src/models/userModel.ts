import mongoose from "mongoose";
import { IUser } from "../types"
import bcrypt from 'bcrypt'
const confirmPasswordValidator = {
    validator: function (this: IUser, confirmPassword: string) {
        if (this.password === confirmPassword) return true
        return false
    },
    message: (props: { value: string }) => `Your password don't match! Try again.`
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, "Please enter a valid username."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please enter your email."]
    },
    password: {
        type: String,
        required: [true, "Please enter a password."],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, "Please repeat your password."],
        minlength: 8,
        validate: confirmPasswordValidator
    },
    avatar: {
        type: String,
        required: [true, "Please repeat your password."]
    }
})

userSchema.pre('save', async function (next) {
    
    const salt = await bcrypt.hash(this.password, 12)
    this.password = salt
    this.confirmPassword = ""
   

    next()
})

export const User = mongoose.model("User", userSchema)