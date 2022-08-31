import {
  Box,
  Button,
  Textarea,
  Text,
  Flex,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { FC, useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import styles from "../../../styles/pages/components/roomChat.module.scss";
import { useAppSelector } from "../../../store/hooks";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../../store/api/roomApi";
import dayjs from "dayjs";

interface RoomChatProps {
  roomId: string;
}

const RoomChat: FC<RoomChatProps> = ({ roomId }) => {
  const user = useAppSelector((state) => state.user);
  const [message, setMessage] = useState<string>("");
  const anchorRef = useRef<HTMLDivElement>(null);

  const { data: messages } = useGetMessagesQuery(roomId);
  const [sendMessage] = useSendMessageMutation();

  function changeMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function send() {
    if (message) {
      sendMessage({
        userId: user.id,
        roomId,
        type: "message",
        message,
      });
      setMessage("");
    }
  }

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }), [messages];

  return (
    <Grid gridTemplateRows={"1fr 100px"} id={styles.container}>
      <GridItem id={styles.messagesArea}>
        {messages?.map(
          ({ userId, userName, message, type, createdAt, avatar }, i) => (
            <>
              {type === "message" ? (
                <>
                  {user.id !== userId ? (
                    <Flex className={styles.message} key={i}>
                      <Image src={avatar} alt="Avatar" />
                      <Box>
                        <Text>{userName}</Text>
                        <Box>
                          {message}
                          <span>{dayjs(createdAt).format("h:mm a")}</span>
                        </Box>
                      </Box>
                    </Flex>
                  ) : (
                    <Flex className={styles.mymessage} key={i}>
                      <Box>
                        <Box>
                          {message}
                          <span>{dayjs(createdAt).format("h:mm a")}</span>
                        </Box>
                      </Box>
                    </Flex>
                  )}
                </>
              ) : (
                <Text className={styles.notification}>{message}</Text>
              )}
            </>
          )
        )}
        <Box id={styles.anchor} ref={anchorRef}></Box>
      </GridItem>
      <GridItem id={styles.input}>
        <Textarea
          value={message}
          onChange={changeMessage}
          placeholder="Type message..."
        />
        <Button disabled={!message} variant="primary" onClick={send}>
          <FiSend />
        </Button>
      </GridItem>
    </Grid>
  );
};

export default RoomChat;
