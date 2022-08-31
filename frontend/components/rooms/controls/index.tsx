import { FC } from "react";
import { Flex, Button, Link } from "@chakra-ui/react";
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { CgScreen } from "react-icons/cg";
import useToggle from "../../../hooks/useToggle";
import styles from "../../../styles/pages/room.module.scss";

export type ControlsProps = {
  muteVideo: (arg: boolean) => void;
  screenShare: (arg: boolean) => void;
  muteAudio: (arg: boolean) => void;
};

const Controls: FC<ControlsProps> = ({
  muteVideo,
  screenShare,
  muteAudio
}) => {

  const [cameraOn, toggleCamera] = useToggle(true);
  const [micOn, toggleMic] = useToggle(true);
  const [screenShareOn, toggleScreenShare] = useToggle(false);

  return (
    <Flex id={styles.controls}>
      <Button
        variant="outline"
        onClick={() => {
          (toggleCamera as () => void)();
          muteVideo(cameraOn);
        }}
      >
        {cameraOn ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          (toggleScreenShare as () => void)();
          screenShare(screenShareOn);
        }}
      >
        <CgScreen />
      </Button>
      <Link href="/">
        <Button variant="red" w="100px">Leave</Button>
      </Link>
      <Button
        variant="outline"
        onClick={() => {
          (toggleMic as () => void)();
          muteAudio(micOn);
        }}
      >
        {micOn ? <BsFillMicFill /> : <BsFillMicMuteFill />}
      </Button>
    </Flex>
  );
};

export default Controls;
