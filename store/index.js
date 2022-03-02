import { createContext, useCallback, useReducer, useState } from "react";

const NearbyCoffeeStoresContext = createContext({
  storeState: {
    coordinates: "",
    nearbyCoffeeStores: [],
  },
  updateCoordinates: (coordinates) => {},
  setNearbyCoffeeStoresArray: (arrayOfCoffeeStores) => {},
});

const ACTION_TYPES = {
  SET_COORDINATES: "SET_COORDINATES",
  SET_NEARBY_COFFEE_STORES: "SET_NEARBY_COFFEE_STORES",
};

const initialState = {
  coordinates: "",
  nearbyCoffeeStores: [],
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_COORDINATES:
      return {
        ...state,
        coordinates: action.payload,
      };
    case ACTION_TYPES.SET_NEARBY_COFFEE_STORES:
      return { ...state, nearbyCoffeeStores: action.payload };
    default:
      return state;
  }
};

export const NearbyCoffeeStoresContextProvider = ({ children }) => {
  const [storeState, dispatchStoreAction] = useReducer(
    storeReducer,
    initialState
  );

  const updateCoordinates = useCallback((coordinates) => {
    dispatchStoreAction({
      type: ACTION_TYPES.SET_COORDINATES,
      payload: coordinates,
    });
  }, []);

  const setNearbyCoffeeStoresArray = useCallback((arrayOfCoffeeStores) => {
    dispatchStoreAction({
      type: ACTION_TYPES.SET_NEARBY_COFFEE_STORES,
      payload: arrayOfCoffeeStores,
    });
  }, []);
  const context = {
    storeState,
    updateCoordinates,
    setNearbyCoffeeStoresArray,
  };

  return (
    <NearbyCoffeeStoresContext.Provider value={context}>
      {children}
    </NearbyCoffeeStoresContext.Provider>
  );
};

export default NearbyCoffeeStoresContext;
