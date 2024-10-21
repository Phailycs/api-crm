import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { addCustomer } from "./controller/newCustomer"
import { sendMail } from './controller/emailSender';
import apiConfig from "./controller/rateLimit";

export default async function handler(req: any, res: any) {
  const { method } = req;

  apiConfig.limiter;

  switch (method) {
    case 'POST':
      try {

        var request = req.body

        const verifyResult = JSON.parse(request);
        const createdAt = new Date()
        const name = verifyResult.firstName + " " + verifyResult.lastName;
        const email = verifyResult.email
        
        var customerList = []

        const guid: string = await generateGuid();

        customerList.push({...verifyResult, createdAt: createdAt, name: name, profile: { firstName: verifyResult.firstName, lastName: verifyResult.lastName}, guid: guid, email: email})

        const verifPutOk = await addCustomer(customerList);

        if (!verifPutOk) {
          res.status(500).json({ error: 'Internal server error' });
          break;
        }

        const finalJwt = await generateJwt(guid);

        if (finalJwt == 'err') {
           res.status(500).json({ error: 'Internal server error' });
           break;
        }

        await sendMail(email, finalJwt);

        res.status(200).json({ message: 'Success' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
      break;
  }
}

export async function generateGuid(): Promise<string> {
  return uuidv4();
}

export async function generateJwt(guid: string): Promise<string> {
  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const expiresIn = process.env.JWT_EXPIRES_IN || '';
    if (secretKey != '' && expiresIn != '') {
      const token = jwt.sign({ id: guid }, secretKey, { expiresIn: expiresIn });
      return token;
    }
    return 'err'
  } catch(err) {
    console.log(err)
    return "err";
  }
}
