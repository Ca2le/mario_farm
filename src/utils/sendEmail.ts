import nodemailer from 'nodemailer'
import { IMail, IUserAuth } from '../types';
import path from 'path'
import fs from 'fs';
import { promisify } from 'util';


export const sendEmailWith = async (mailContent: { name: string, email: string, token: string }) => {
    const root = path.resolve(__dirname, '../..')
    const readFile = promisify(fs.readFile)
    try {
        const htmlDocument = await readFile(path.join(root, 'templates', 'resetPassword.html'), 'utf-8')
        const htmlContent = replacePlaceholder(htmlDocument, mailContent)
        const logo = await readFile(path.join(root, 'assets', 'logo.png'))

        const mail: IMail = {
            from: "noreplay@jumpcode.org",
            to: mailContent.email,
            subject: "Reset Password - jump.playground 🦖",
            html: htmlContent,
            text: "hello",
            attachments: [
                {
                    filename: "logo.png",
                    content: logo,
                    cid: "jumpcode.logo.png"
                }
            ]

        }
        const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env

        if (EMAIL_HOST && EMAIL_PORT && EMAIL_USERNAME && EMAIL_PASSWORD) {
            const transport: any = {
                host: EMAIL_HOST,
                port: EMAIL_PORT,
                auth: {
                    user: EMAIL_USERNAME,
                    pass: EMAIL_PASSWORD,
                },
            }
            const transporter = nodemailer.createTransport(transport)
            await transporter.sendMail(mail)
        }
    }
    catch (err) {
        console.log("OPS A EMAIL ERROR 🚳🚳🔒🔒")
    }

}


const replacePlaceholder = (doc: string, user: any) => {
    let document = doc
    const placeholders = document.match(/(%%(.*?)%%)/g)
    if (placeholders) {
        placeholders.forEach(el => {
            const placeholder = el
            const element = el.replace(/%%/g, '')
            document = document.replace(placeholder, user[element])

        })
    }
    return document
}