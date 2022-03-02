// Airtable initialization
const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
const table = base("coffee-stores");

// Constant Variables
const FIELDS_TO_IGNORE = ["address", "neighborhood", "votes"];

// Helper functions
const formatReturnedResults = (records) => {
  return records.map((record) => ({ ...record.fields, recordId: record.id }));
};

export const findRecordsByFilter = async (filter = -1) => {
  const fetchedRecords = await table
    .select({
      filterByFormula: `id="${filter}"`,
    })
    .firstPage();
  return formatReturnedResults(fetchedRecords);
};

export const validateInputFields = (record) => {
  for (const key in record) {
    if (FIELDS_TO_IGNORE.includes(key)) {
      continue;
    }
    if (!record[key]) {
      return { success: "", err: "Invalid format for new record" };
    }
  }
  return { success: "Validation passed", err: "" };
};

export const createNewRecord = async (record) => {
  const createdRecords = await table.create([
    {
      fields: record,
    },
  ]);
  return formatReturnedResults(createdRecords);
};

export const updateRecord = async (id, votes) => {
  const fetchedCoffeeStores = await findRecordsByFilter(id);
  if (!fetchedCoffeeStores || fetchedCoffeeStores.length === 0) {
    return { error: "No records found" };
  }
  const coffeeStore = fetchedCoffeeStores[0];
  const response = await table.update([
    {
      id: coffeeStore.recordId,
      fields: {
        votes,
      },
    },
  ]);
  const data = response.map((record) => ({
    ...record.fields,
    recordId: record.id,
  }));

  return data;
};
