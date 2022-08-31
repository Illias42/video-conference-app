import { FC } from 'react';
import { Flex } from "@chakra-ui/react";
import VideoContainer from "../videocontainer";
import styles from "../../../styles/pages/room.module.scss";

export type MainProps = {
  clients: any;
  provideMediaRef: any;
};

const Main: FC<MainProps> = ({
  clients,
  provideMediaRef
}) => {
  return (
    <Flex id={styles.streams_container}>
      {clients.map((client: any, index: number) => {
        return (
          <VideoContainer
            key={index}
            client={client}
            mediaRef={(instance: any) => {
              provideMediaRef(client.peerID, instance);
            }}
          />
        );
      })}
    </Flex>
  );
};

export default Main;
