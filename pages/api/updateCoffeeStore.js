import { updateRecord } from "../../lib/airtable";
import { generateHTTPError } from "../../utils";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Invalid method" });
  }
  const { id, votes } = req.body;
  try {
    if (!id) {
      throw generateHTTPError("Invalid id", 422);
    }
    const updatedCoffeeStore = await updateRecord(id, votes);
    if (updatedCoffeeStore.error) {
      throw generateHTTPError(updatedCoffeeStore.error, 404);
    }
    return res.status(200).json(updatedCoffeeStore);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

export default handler;
