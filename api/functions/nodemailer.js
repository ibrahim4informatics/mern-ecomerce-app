const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.APP_PASS, // generated ethereal password
    },
})

module.exports = transporter