import {
  createNewRecord,
  findRecordsByFilter,
  validateInputFields,
} from "../../lib/airtable";
import { generateHTTPError } from "../../utils";

// API endpoint handler
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Invalid request",
    });
  }
  try {
    const records = await findRecordsByFilter(req.body.id);
    if (records.length !== 0) {
      res.status(200).json(records);
    } else {
      const { success, err } = validateInputFields(req.body);
      if (err) {
        throw generateHTTPError(err, 422);
      }
      const createdRecords = await createNewRecord(req.body);
      res
        .status(201)
        .json({ message: "Created a new record", records: createdRecords });
    }
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

export default handler;
