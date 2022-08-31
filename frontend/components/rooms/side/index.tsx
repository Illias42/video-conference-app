import { Flex, Button, Box, Text, Image } from "@chakra-ui/react";
import RoomChat from "../chat";
import styles from "../../../styles/pages/room.module.scss";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import { useGetParticipantsQuery } from "../../../store/api/roomApi";
import { HiArrowLeft } from "react-icons/hi";

type SideProps = {
  onClose?: () => void;
}

const Side: FC<SideProps> = ({ onClose }) => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetParticipantsQuery(id as string);
  const [ activeTab, setActiveTab ] = useState<"chat" | "participants">(
    "participants"
  );

  return (
    <Flex flexDir="column" w="400px">
      <Flex id={styles.tabSwitcher}>
        <Button variant="ghost" onClick={onClose}>
          <HiArrowLeft />
        </Button>
        <Box>
          <Button
            color="gray.200"
            variant={activeTab === "chat" ? "primary" : "ghost"}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </Button>
          <Button
            color="gray.200"
            variant={activeTab === "participants" ? "primary" : "ghost"}
            onClick={() => setActiveTab("participants")}
          >
            Participants
          </Button>
        </Box>
      </Flex>
      <Box h="100%">
        {activeTab === "chat" && <RoomChat roomId={id as string} />}
        {activeTab === "participants" && (
          <Box px="30px">
            {data?.map((participant, i) => (
              <Flex key={i} className={styles.participant}>
                <Image
                  src={participant.avatar ?? "/images/default_user.png"}
                  alt="Avatar"
                />
                <Text as="span" color="gray.200" fontSize="20px" py="5px">
                  {participant.name}
                </Text>
              </Flex>
            ))}
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default Side;
