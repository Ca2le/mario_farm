import nodemailer from 'nodemailer'
import { IMail, httpStatus } from '../types';
import path from 'path'
import { readFile } from 'fs/promises';
import { response } from 'express';
import { generateResponse } from './generateResponse';
import { AppError } from './appError';



type TemplateFile = 'forgot_password.html' | 'email_verification.html'

export class Email {
    private root = path.resolve(__dirname, '../..')
    private filePath = ''
    private url = process.env.CLIENT_URL as string

    constructor(private content: any) {
        this.filePath = path.join(this.root, '/templates/', `${this.content.template}.html`)
  
    }

    private replacePlaceholdersWithValues(templateStr: string) {
        let template = templateStr;

        template.match(/(%%(.*?)%%)/g)?.forEach((placeholder) => {
            const key = placeholder.replace(/%%/g, '');
            template = template.replace(placeholder, this.content[key]);
        });

        return template;
    }

    async updateTemplate() {
        const template = await readFile(this.filePath, 'utf-8')
        const newTemplate = this.replacePlaceholdersWithValues(template)
        
        return newTemplate
    }

    async send() {
        try {
            const template = await this.updateTemplate()
            const logo = await readFile(path.join(this.root, 'assets', 'logo.png'))
            const mail: IMail = {
                from: "noreplay@receptify.se",
                to: this.content.email,
                subject: "Reset Password / receptify.se 🍌",
                html: template,
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
            } else {
                throw new AppError('Template was not loaded', httpStatus.INTERNAL_SERVER_ERROR)
            }

        } catch (err) {
            console.error(err)
        }
    }
}

// export const sendEmailWith = async (mailContent: { name: string, email: string, token: string }) => {
//     const root = path.resolve(__dirname, '../..')
//     const readFile = promisify(fs.readFile)
//     try {
//         const htmlDocument = await readFile(path.join(root, 'templates', 'resetPassword.html'), 'utf-8')
//         const htmlContent = replacePlaceholder(htmlDocument, mailContent)
//         const logo = await readFile(path.join(root, 'assets', 'logo.png'))

//         const mail: IMail = {
//             from: "noreplay@jumpcode.org",
//             to: mailContent.email,
//             subject: "Reset Password - jump.playground 🦖",
//             html: htmlContent,
//             text: "hello",
//             attachments: [
//                 {
//                     filename: "logo.png",
//                     content: logo,
//                     cid: "jumpcode.logo.png"
//                 }
//             ]

//         }
//         const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env

//         if (EMAIL_HOST && EMAIL_PORT && EMAIL_USERNAME && EMAIL_PASSWORD) {
//             const transport: any = {
//                 host: EMAIL_HOST,
//                 port: EMAIL_PORT,
//                 auth: {
//                     user: EMAIL_USERNAME,
//                     pass: EMAIL_PASSWORD,
//                 },
//             }
//             const transporter = nodemailer.createTransport(transport)
//             await transporter.sendMail(mail)
//         }
//     }
//     catch (err) {
//         console.log("OPS A EMAIL ERROR 🚳🚳🔒🔒")
//     }

// }


// const replacePlaceholder = (doc: string, user: any) => {
//     let document = doc
//     const placeholders = document.match(/(%%(.*?)%%)/g)
//     if (placeholders) {
//         placeholders.forEach(el => {
//             const placeholder = el
//             const element = el.replace(/%%/g, '')
//             document = document.replace(placeholder, user[element])
//         })
//     }
//     return document
// }