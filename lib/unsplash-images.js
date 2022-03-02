import { createApi } from "unsplash-js";

// on your node server
const unsplashAPI = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

export const fetchPhotos = async () => {
  const response = await unsplashAPI.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const results = response.response.results;
  const photos = results.map((r) => r.urls.small);
  return photos;
};
