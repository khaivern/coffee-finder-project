import { findRecordsByFilter } from "../../lib/airtable";
import { generateHTTPError } from "../../utils";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Invalid method" });
  }
  const { id } = req.query;
  try {
    if (!id) {
      throw generateHTTPError("Invalid id given", 422);
    }
    const coffeeStores = await findRecordsByFilter(id);
    return res.status(200).json(coffeeStores);
  } catch (err) {
    return res.status(err.statusCode || 500).json({ err: err.message });
  }
}

export default handler;
