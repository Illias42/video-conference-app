import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Theme } from "../styles/theme";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { IconContext } from "react-icons";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { SkeletonTheme } from "react-loading-skeleton";
import Layout from "./layout";

const persistor = persistStore(store);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (

      <ChakraProvider theme={Theme}>
        <IconContext.Provider value={{ color: "#b0b0b0", size: "25px" }}>
          <SkeletonTheme baseColor="#33353b" highlightColor="#46474d">
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </PersistGate>
            </Provider>
          </SkeletonTheme>
        </IconContext.Provider>
      </ChakraProvider>
  );
}

export default MyApp;
