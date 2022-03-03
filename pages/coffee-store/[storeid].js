import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import cls from "classnames";
import NearbyCoffeeStoresContext from "../../store";
import {
  fetchCoffeeStores,
  saveCoffeeStoreToDatabaseHandler,
  updateCoffeeStoreVoteCountInDB,
} from "../../lib/coffee-stores";
import { isEmpty } from "../../utils";
import styles from "../../styles/coffee-store.module.css";
import axios from "axios";
import useSWR from "swr";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  const coffeeStore =
    coffeeStores.find((store) => store.id === context.params.storeid) || {};
  return {
    props: {
      coffeeStore: coffeeStore,
    },
  };
}

export async function getStaticPaths(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    paths: coffeeStores.map((store) => ({
      params: { storeid: store.id },
    })),
    fallback: true,
  };
}

let localVoteCount;
let localTimer;

const CoffeeStore = ({ coffeeStore: initialCoffeeStore }) => {
  const { isFallback, query } = useRouter();
  const id = query.storeid; // stores query parameter in url
  const [coffeeStore, setCoffeeStore] = useState(initialCoffeeStore);

  const {
    storeState: { nearbyCoffeeStores },
  } = useContext(NearbyCoffeeStoresContext);

  useEffect(() => {
    if (isEmpty(initialCoffeeStore)) {
      if (nearbyCoffeeStores.length > 0) {
        const nearbyCoffeeStoreFromContext = nearbyCoffeeStores.find(
          (store) => store.id === id
        );
        if (nearbyCoffeeStoreFromContext) {
          setCoffeeStore(nearbyCoffeeStoreFromContext);
          saveCoffeeStoreToDatabaseHandler(nearbyCoffeeStoreFromContext);
        }
      }
    } else {
      saveCoffeeStoreToDatabaseHandler(initialCoffeeStore);
    }
  }, [id, initialCoffeeStore, nearbyCoffeeStores]);

  // State for number of votes
  const [votes, setVotes] = useState(0);
  const handleUpvoteButton = () => {
    localVoteCount = votes;
    setVotes((curr) => curr + 1);
    localVoteCount++;
    if (localTimer) {
      clearTimeout(localTimer);
    }
    localTimer = setTimeout(() => {
      updateCoffeeStoreVoteCountInDB(id, localVoteCount);
    }, 500);
  };

  // SWR fetcher function
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data: coffeeStoreFromDB, error: errorFetchingCoffeeStoreFromDB } =
    useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (coffeeStoreFromDB && coffeeStoreFromDB.length > 0) {
      setCoffeeStore(coffeeStoreFromDB[0]);
      setVotes(coffeeStoreFromDB[0].votes);
      localVoteCount = coffeeStoreFromDB[0].votes;
    }
  }, [coffeeStoreFromDB]);

  if (errorFetchingCoffeeStoreFromDB) {
    return <div>Failed to fetch coffee store from database</div>;
  }

  if (isFallback || isEmpty(coffeeStore)) {
    return <div>Loading...</div>;
  }

  const { address, name, neighborhood, imgUrl } = coffeeStore;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta
          name='description'
          content={`Details page for ${name} coffee store`}
        />
        <link rel='icon' href='/coffee-icon.ico' />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>Back To Home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            alt={name}
            className={styles.storeImg}
            objectFit='cover'
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src='/icons/places.svg'
                width={24}
                height={24}
                alt='address icon'
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src='/icons/nearby.svg'
                width={24}
                height={24}
                alt='neighbourhood icon'
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/star.svg'
              width={24}
              height={24}
              alt='rating icon'
            />
            <p className={styles.text}>{votes}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
