import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Banner from "../components/banner";
import Card from "../components/card";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import NearbyCoffeeStoresContext from "../store";
// import coffeeStoresData from "../data/coffee-stores.json";
import styles from "../styles/Home.module.css";

export async function getStaticProps(context) {
  return {
    props: {
      coffeeStores: await fetchCoffeeStores(),
    },
  };
}

export default function Home({ coffeeStores }) {
  const {
    storeState: { coordinates, nearbyCoffeeStores },
    setNearbyCoffeeStoresArray,
  } = useContext(NearbyCoffeeStoresContext);
  const { isFindingLocation, locationErrMsg, handleTrackLocation } =
    useTrackLocation();

  const [loadedCoffeeStoresError, setLoadedCoffeeStoresError] = useState("");
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const fetchNearbyCoffeeStores = async () => {
      try {
        const response = await axios({
          url: "/api/getCoffeeStoresByLocation",
          params: {
            coordinates,
            limit: 30,
          },
        });
        const fetchedCoffeeStores = response.data;
        setNearbyCoffeeStoresArray(fetchedCoffeeStores);
      } catch (err) {
        console.log({ err });
        setLoadedCoffeeStoresError(err.message);
      }
    };
    fetchNearbyCoffeeStores();
  }, [coordinates, setNearbyCoffeeStoresArray]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name='description'
          content='Find coffee stores near your location'
        />
        <link rel='icon' href='/coffee-icon.ico' />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrMsg && <p>Something went wrong. {locationErrMsg}</p>}
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.webp'
            width={800}
            height={343}
            alt='Hero image'
          />
        </div>
        {nearbyCoffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores nearby</h2>
            <div className={styles.cardLayout}>
              {nearbyCoffeeStores.map((store) => {
                return (
                  <Card
                    key={store.id}
                    className={styles.card}
                    name={store.name}
                    imgUrl={store.imgUrl}
                    href={`/coffee-store/${store.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Singapore stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store) => {
                return (
                  <Card
                    key={store.id}
                    className={styles.card}
                    name={store.name}
                    imgUrl={store.imgUrl}
                    href={`/coffee-store/${store.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
