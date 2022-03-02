import axios from "axios";
import { fetchPhotos } from "./unsplash-images";

const defaultOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: process.env.NEXT_PUBLIC_FOUR_SQUARE_AUTH_KEY,
  },
};

const allNearbyCoffeeStoresOptions = (latlong, limit) => ({
  url: "https://api.foursquare.com/v3/places/nearby",
  params: {
    ll: latlong,
    query: "coffee stores",
    limit: limit,
  },
  ...defaultOptions,
});

export const fetchCoffeeStores = async (
  latlong = "1.2925571337289075,103.8522688330711",
  limit = 6
) => {
  const photos = await fetchPhotos();

  let coffeeStoresData;
  try {
    const response = await axios(allNearbyCoffeeStoresOptions(latlong, limit));
    const data = response.data;
    coffeeStoresData = data.results.map((coffeeStore, idx) => ({
      id: coffeeStore.fsq_id,
      name: coffeeStore.name,
      imgUrl: photos[idx],
      address:
        coffeeStore.location.formatted_address ||
        coffeeStore.location.address ||
        "",
      neighborhood:
        (coffeeStore.location.neighborhood &&
          coffeeStore.location.neighborhood.length > 0 &&
          coffeeStore.location.neighborhood[0]) ||
        coffeeStore.location.cross_street ||
        "",
      votes: 0,
    }));
  } catch (err) {
    console.log(err);
  }
  return coffeeStoresData || [];
};

export const saveCoffeeStoreToDatabaseHandler = async (coffeeStoreFields) => {
  const response = await axios({
    url: "/api/createCoffeeStore",
    method: "POST",
    data: { ...coffeeStoreFields, votes: 0 },
  });
  const data = response.data; // returns the result as an array with one object [{...}]
  return data;
};

export const updateCoffeeStoreVoteCountInDB = async (id, votes) => {
  const response = await axios({
    url: "/api/updateCoffeeStore",
    method: "PUT",
    data: {
      id,
      votes,
    },
  });
  const data = response.data;
  return data;
};

// const singleCoffeeStoreOptions = (storeId) => ({
//   url: `https://api.foursquare.com/v3/places/${storeId}`,
//   ...defaultOptions,
// });

// export const fetchSingleStore = async (storeId) => {
//   let coffeeStore;
//   try {
//     const response = await axios(singleCoffeeStoreOptions(storeId));
//     const data = response.data;
//     coffeeStore = {
//       id: data.fsq_id,
//       address: data.location.formatted_address,
//       neighborhood: data.location.neighborhood || "",
//       imgUrl: "",
//       name: data.name,
//     };
//   } catch (err) {
//     console.log(err.message);
//   }
//   return coffeeStore || {};
// };
