import { useContext, useState } from "react";
import NearbyCoffeeStoresContext from "../store";

const useTrackLocation = () => {
  const [locationErrMsg, setLocationErrMsg] = useState("");
  const [coordinates, setCoordinates] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  const nearbyStoreContext = useContext(NearbyCoffeeStoresContext);
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // setCoordinates(`${latitude},${longitude}`);
    nearbyStoreContext.updateCoordinates(`${latitude},${longitude}`);
    setLocationErrMsg("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setLocationErrMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrMsg("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    isFindingLocation,
    locationErrMsg,
    coordinates,
    handleTrackLocation,
  };
};

export default useTrackLocation;
