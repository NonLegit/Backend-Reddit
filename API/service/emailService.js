const nodemailer = require("nodemailer");
const fs = require("fs");
const { promisify } = require("util");

const readFileAsync = promisify(fs.readFile);

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
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
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
      // secure: true,
      auth: {
        user: process.env.NONLEGITEMAIL,
        pass: process.env.NONLEGITPASSWORD,
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
    console.log("read html");
    let html = await readFileAsync("./public/html/page.html", "utf-8");
    html = html.replaceAll("u/username_replace", "u/" + user.userName);
    // replace button link to frontdomain
    html = html.replaceAll("FrontDomain", url);
    const mailOptions = {
      from: this.from,
      to: user.email,
      subject: "Reset Password",
      html: html,
      text: `Hi there,
            Looks like a request was made to reset the password for your
            ${user.userName} Reddit account.
              No problem! You can reset your password now using the lovely link below.
               ${url}`,
    };

    const transporter = this.newTransport();
    await transporter.sendMail(mailOptions);
  }
  async sendUserName(user, url) {
    //let testAccount = await nodemailer.createTestAccount();
    console.log("read html");
    let html = await readFileAsync(
      "./public/html/username_reset.html",
      "utf-8"
    );
    html = html.replaceAll("u/username_replace", "u/" + user.userName);
    html = html.replaceAll("user_email_replace", "u/" + user.email);
    // replace button link to frontdomain
    html = html.replaceAll("FrontDomain", url);
    const mailOptions = {
      from: this.from,
      to: user.email,
      subject: "So you wanna know your Reddit username, huh?",
      html: html,
      text: `Hi there,
            You forgot it didn't you? Hey, it happens. Here you go:
            Your username is ${user.userName}
            (Username checks out, nicely done.) `,
    };

    const transporter = this.newTransport();
    await transporter.sendMail(mailOptions);
  }
  async sendVerificationMail(user, url) {
    console.log("read html");
    let html = await readFileAsync("./public/html/verification.html", "utf-8");
    html = html.replaceAll("u/username_replace", "u/" + user.userName);
    html = html.replaceAll("user_email_replace",  user.email);
    // replace button link to frontdomain
    html = html.replaceAll("FrontDomain", url);
    const mailOptions = {
      from: this.from,
      to: user.email,
      subject: "Verify your Reddit email address",
      html: html,
      text: `Hi there,
            You forgot it didn't you? Hey, it happens. Here you go:
            Your username is ${user.userName}
            (Username checks out, nicely done.) `,
    };

    const transporter = this.newTransport();
    await transporter.sendMail(mailOptions);
  }
};
