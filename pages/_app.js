import { NearbyCoffeeStoresContextProvider } from "../store";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <NearbyCoffeeStoresContextProvider>
      <Component {...pageProps} />
    </NearbyCoffeeStoresContextProvider>
  );
}

export default MyApp;
