import { fetchCoffeeStores } from "../../lib/coffee-stores";

export default async function handler(req, res) {
  try {
    const { coordinates, limit } = req.query;
    const fetchedCoffeeStores = await fetchCoffeeStores(coordinates, limit);
    return res.status(200).json(fetchedCoffeeStores);
  } catch (err) {
    console.log({ err });
    return res.status(500).json(err.message);
  }
}
