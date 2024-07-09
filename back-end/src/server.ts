// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const otps: { [key: string]: number } = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otps[email] = otp; 

  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email', error);
      res.status(500).json({ success: false, message: 'Error sending email' });
    } else {
      console.log(`Email sent: ${info.response}`);
      res.json({ success: true });
    }
  });
});


app.post('/api/validate-otp', (req, res) => {
  const { otp, email } = req.body;
  if (otps[email] && otps[email] === parseInt(otp, 10)) {
    res.json({ valid: true }); 
    delete otps[email]; 
  } else {
    res.json({ valid: false }); 
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
