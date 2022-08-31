import { FC } from "react";
import { Box, Text } from "@chakra-ui/react";
import useToggle from "../../../hooks/useToggle";
import styles from "../../../styles/pages/room.module.scss";

interface VideoContainerProps {
  client: any;
  mediaRef: (instance: any) => void;
}

const VideoContainer: FC<VideoContainerProps> = ({ client, mediaRef }) => {
  const [full, toggleFull] = useToggle(false);

  return (
    <Box
      onClick={toggleFull as () => void}
      id={full ? styles.full_screen : ""}
      className={styles.video_container}
    >
      <video
        ref={mediaRef}
        autoPlay
        playsInline
        muted={client.peerID === "LOCAL_VIDEO"}
      />
      <Text>{client.name === "LOCAL" ? "You" : client.name}</Text>
    </Box>
  );
};

export default VideoContainer;
