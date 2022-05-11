import nodemailer from "nodemailer"

export default async function SendEmail( to, subject, text ) {
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

   await transport.sendMail({
      from: "live_watch@gmail.com",
      to: to,
      subject: subject,
      html: text,
   })
}
