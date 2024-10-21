import { connectToDatabase } from "../../../../controller/dbConnection";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const customerId = req.query.customerid;
        const ordersId = req.query.ordersid;

        const { db } = await connectToDatabase();

        const customer = await db.collection("customers").findOne({ id: customerId });

        if (!customer) {
          return res.status(404).json({ error: "Customer not found" });
        }

        const order = customer.orders.find((order) => customer.orders.id === ordersId);

        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }

        const productIds = order.products.map((product) => product.id);
        

        const products = await db
          .collection("product")
          .find({ id: { $in: productIds } })
          .toArray();

          if(!products){
            return res.status(404).json({ error: "Product not found" });
          }
        return res.status(200).json(products);
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
