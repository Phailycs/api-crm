import authVerification from "./controller/apiAuthVerification";
import apiConfig from "./controller/rateLimit";
import { connectToDatabase } from "./controller/dbConnection";

export default async function handler(req: any, res: any) {
  apiConfig.limiter;

  const { method } = req;
  const authToken = (req.headers.authorization || "").split("Bearer ").at(1);

  switch (method) {
    case "GET":
      try {
        const { email } = req.body;
        const authResult = await authVerification(authToken, email);
        if (authResult === "true") {
          res.status(200).json({ message: "Success" });
        } else if (authResult === "false") {
          res.status(500).json({ error: "Invalid token" });
        } else {
          res.status(201).json({ message: authResult });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
      break;
    default:
      res.status(405).json({ error: "Method not allowed" });
      break;
  }
}