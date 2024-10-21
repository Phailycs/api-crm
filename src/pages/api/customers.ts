import { connectToDatabase } from "./controller/dbConnection";
import apiConfig from "./controller/rateLimit";

export default async function handler(
  req: any,
  res: any
) {
  const { method } = req;

  apiConfig.limiter;

  switch (method) {
    case "GET":
      try {

        const { db } = await connectToDatabase();

        let result = await db.collection("customers").find({}).sort({}).toArray();


        return res.status(200).json(result);
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

