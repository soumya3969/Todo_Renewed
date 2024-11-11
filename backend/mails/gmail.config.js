import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const userName = process.env.GMAIL_USER;
const userPass = process.env.GMAIL_PASS;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: userName,
    pass: userPass
  }
});

export const sender = {
  email: userName,
  name: "Todo Renewed"
};
