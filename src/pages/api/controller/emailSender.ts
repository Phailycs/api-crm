import nodemailer from 'nodemailer';
const { google } = require('googleapis')
import { generateQRCodeImage } from './qrcodeGenerator'

const CLIENT_ID = process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || '';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

export async function sendMail(email: string, finalJwt: string) {
  try {

    var qrCode = await generateQRCodeImage(finalJwt);
    console.log("PASSED QR CODE");
    const accessToken = await oAuth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'payetonkawapourdevrai@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    

    const mailOptions = {
      from: 'paye ton kawa <payetonkawapourdevrai@gmail.com>',
      to: email,
      subject: 'Authentification Paye Ton Kawa',
      attachDataUrls: true,
      html: 'Veuillez, scannez ce QR CODE depuis l\'application paye ton kawa pour vous identifier </br> <img src="' + qrCode + '">',
    }
    const result = await transporter.sendMail(mailOptions)
    console.log("HERE IS RESULT");
    console.log(result);
    return result
  } catch (err) {
    console.log(err);
    return err
  }
}