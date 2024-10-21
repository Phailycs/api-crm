import jwt, { verify } from "jsonwebtoken";
import { connectToDatabase } from "./dbConnection";

const secretKey = process.env.JWT_SECRET_KEY || "";

export default async function authVerification(token: string, email: string) {
  try {
    if (token) {
    const decodedToken = verify(token, secretKey) as { [key: string]: any };
    const { db } = await connectToDatabase();
    const result = await db.collection("customers").findOne({
      guid: decodedToken,
    });
    if (!result) {
      return "true"
    }
  } else {
    if (email != null) {
      const { db } = await connectToDatabase();
      const result = await db.collection("customers").findOne({
        email: email,
      });
      return "false";
    } else {
      return "false";
    }
  }
  } catch (error) {
    console.log(error);
    if (email != null) {
      const { db } = await connectToDatabase();
      const result = await db.collection("customers").findOne({
        email: email,
      });
      const guidUser = result ? result.guid : null;
      var newJwt = generateJwtUser(guidUser)
      return newJwt;
    } else {
      return "false";
    }
  }
}

async function generateJwtUser(guid: string): Promise<string> {
  try {
    const secretKey = process.env.JWT_SECRET_KEY || "";
    const expiresIn = process.env.JWT_EXPIRES_IN || "";
    if (secretKey != "" && expiresIn != "") {
      const token = jwt.sign({ id: guid }, secretKey, { expiresIn: expiresIn });
      return token;
    }
    return "err";
  } catch (err) {
    console.log(err);
    return "err";
  }
}
