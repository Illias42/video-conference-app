import { FC, useEffect, useRef } from 'react';
import { Box, Image } from "@chakra-ui/react";
import { useAppSelector } from '../../../store/hooks';
import { Message } from '../../../store/api/directApi';
import dayjs from 'dayjs';
import styles from "../../../styles/pages/direct.module.scss";

export type MessageListProps = {
  messages: Message[] | undefined;
};

const MessageList: FC<MessageListProps> = ({
  messages
}) => {
  const user = useAppSelector(state => state.user);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }), [messages];
  
  return (
    <Box id={styles.messages}>
      {messages?.map((item) => (
        <>
          {item.type === "image" && item.image ? (
            <Box
              key={item.id}
              className={`${
                item.userId === user.id ? styles.mymessage : styles.message
              } ${styles.imageMessage}`}
            >
              <Image src={item.image} alt="image" />
              <Box>
                <span>{item.message}</span>
                <span>{dayjs(item.createdAt).format("h:mm a")}</span>
              </Box>
            </Box>
          ) : (
            <Box
              key={item.id}
              className={
                item.userId === user.id ? styles.mymessage : styles.message
              }
            >
              <span>{item.message}</span>
              <span>{dayjs(item.createdAt).format("h:mm a")}</span>
            </Box>
          )}
        </>
      ))}
      <Box id={styles.anchor} ref={anchorRef}></Box>
    </Box>
  );
};

export default MessageList;