import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { NextPage } from "next";

import useWebRTC from "../../hooks/useWebRTC";
import { useAppSelector } from "../../store/hooks";
import {
  useJoinRoomMutation,
  useLeaveRoomMutation,
} from "../../store/api/roomApi";

import Side from "../../components/rooms/side";
import Title from "../../components/rooms/title";
import Main from "../../components/rooms/main";
import Controls from "../../components/rooms/controls";

import type { TitleProps } from "../../components/rooms/title";
import type { MainProps } from "../../components/rooms/main";
import type { ControlsProps } from "../../components/rooms/controls";

import {
  Flex,
  Grid,
  GridItem,
  useDisclosure,
  useMediaQuery,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import styles from "../../styles/pages/room.module.scss";

const Room: NextPage = () => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();
  const { name: roomName } = router.query;
  const { id } = router.query;
  const [ isLargerThan900 ] = useMediaQuery("(min-width: 900px)");
  const [ joinRoom ] = useJoinRoomMutation();
  const [ leaveRoom]  = useLeaveRoomMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { clients, provideMediaRef, muteVideo, muteAudio, screenShare } =
    useWebRTC({
      roomID: id as string,
      userId: user.id,
    });

  const titleProps: TitleProps = {
    title: roomName as string,
    onOpen,
  };

  const mainProps: MainProps = {
    clients,
    provideMediaRef,
  };

  const controlsProps: ControlsProps = {
    muteVideo,
    screenShare,
    muteAudio,
  };

  useEffect(() => {
    joinRoom({ roomId: id as string, userId: user.id });

    return () => {
      leaveRoom({ roomId: id as string, userId: user.id });
    };
  }, [id, joinRoom, leaveRoom, user.id]);

  return (
    <>
      <Head>
        <title>{roomName}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Flex>
        <Grid
          id={styles.container}
          templateAreas={` "title"
                           "main"
                           "controls"`}
          gridTemplateRows="70px 1fr 100px"
          gap={4}
        >
          <GridItem area={"title"}>
            <Title {...titleProps} />
          </GridItem>

          <GridItem area={"main"} id={styles.main}>
            <Main {...mainProps} />
          </GridItem>

          <GridItem area={"controls"}>
            <Controls {...controlsProps} />
          </GridItem>
        </Grid>

        {isLargerThan900 ? (
          <Side />
        ) : (
          <Drawer onClose={onClose} isOpen={isOpen} size="md">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody id={styles.drawer} p={0}>
                <Side onClose={onClose} />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}
      </Flex>
    </>
  );
};

export default Room;
