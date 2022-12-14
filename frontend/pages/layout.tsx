import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import { Image, Box, SimpleGrid, Flex, useMediaQuery } from "@chakra-ui/react";
import { IoExit, IoSettingsSharp } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";
import { BsCameraVideoFill } from "react-icons/bs";
import styles from "../styles/main.module.scss";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const [ isLargerThan600 ] = useMediaQuery("(min-width: 800px)");

  const display = () => {
    if (router.pathname.includes('auth')) return false;
    if (!isLargerThan600 && router.pathname.includes('rooms')) return false;
    return true;
  }

  return (
    <div>
      {display() ? (
        <>
          <Head>
            <title>Conf App</title>
            <meta name="description" content="Generated by create next app" />
            <link
              rel="icon"
              href="/images/logo.png"
              type="image/png"
              sizes="32x32"
            />
          </Head>

          <main>
            <SimpleGrid templateColumns="80px 1fr">
              <Flex
                id={styles.sidebar}
              >
                <Flex flexDir="column" alignItems="center">
                  <Image src="/images/logo.png" alt="logo" w="32px" h="32px" />
                </Flex>

                <Box id={styles.pages}>
                  <Link href="/">
                    <a className={
                      router.pathname === '/' || router.pathname.includes("/rooms") ? styles.active : ""
                    }>
                      <BsCameraVideoFill />
                    </a>
                  </Link>

                  <Link href="/direct">
                    <a className={
                        router.pathname.includes("/direct") ? styles.active : ""
                      }
                    >
                      <AiFillMessage />
                    </a>
                  </Link>

                  <Link href="/settings">
                    <a className={
                        router.pathname.includes("/settings")
                          ? styles.active
                          : ""
                      }
                    >
                      <IoSettingsSharp />
                    </a>
                  </Link>
                </Box>

                <Link href="/auth/signout">
                  <a className={styles.signout}>
                    <IoExit />
                  </a>
                </Link>
              </Flex>
              <Box>{children}</Box>
            </SimpleGrid>
          </main>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default Layout;
