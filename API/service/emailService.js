const nodemailer = require("nodemailer");

module.exports = class Email {
    // user, url
    constructor() {
        this.from = `Nonlegit <${process.env.EMAIL_FROM}>`;
        this.newTransport = this.newTransport.bind(this);
        this.sendPasswordReset = this.sendPasswordReset.bind(this);
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // Sendgrid
            return nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.NONLEGITEMAIL,
                    pass: process.env.NONLEGITPASSWORD,
                },
            });
        }
        // just for testing
        //let testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            // secure: false,
            auth: {
                user: process.env.NONLEGITEMAIL,
                pass: process.env.NONLEGITPASSWORD
                //user: testAccount.user,
                //pass: testAccount.pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    // Send the actual email
    async sendPasswordReset(user, url) {
      //let testAccount = await nodemailer.createTestAccount();
        const mailOptions = {
            from: this.from,
            to: user.email,
            subject: "Reset Password",
            text: `Hi there,
            Looks like a request was made to reset the password for your
            ${user.userName} Reddit account.
              No problem! You can reset your password now using the lovely link below.
               ${url}`,
        };

        const transporter =  this.newTransport();
        await transporter.sendMail(mailOptions);
    }
};
