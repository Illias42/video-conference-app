// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useRef } from "react";
import useToggle from "../../../hooks/useToggle";
import { useSendDirectMessageMutation } from "../../../store/api/directApi";
import { useAppSelector } from "../../../store/hooks";

import styles from "../../../styles/pages/direct.module.scss";
import {
  Box,
  Button,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
  Flex,
  Input,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { IoAttachOutline, IoHappyOutline } from "react-icons/io5";
import EmojiPicker from "../../../components/direct/emoji";

import axios from "axios";
import useOnClickOutside from "../../../hooks/useOnClickOutside";

export type DirectInputProps = {
  selectedUser: any;
}

const DirectInput: FC<DirectInputProps> = ({ 
  selectedUser
 }) => {
  
  const user = useAppSelector((state) => state.user);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEmojiForAttachment, setShowEmojiForAttachment] = useToggle(false);
  const [send] = useSendDirectMessageMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconRef = useRef<any>(null);
  const ref = useRef<any>(null);

  useOnClickOutside([ref, iconRef], () => {if (showEmoji) {setShowEmoji(false)}});

  const changeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    onOpen();
  };

  const sendMessage = async () => {
    if (attachmentRef.current?.files[0]) {
      console.log("file");
      const formData = new FormData();
      formData.append("file", attachmentRef.current?.files[0]);
      const imageLocation = await axios.post(
        "/api/direct/uploadFile",
        formData
      );
      send({
        senderId: user.id,
        sendeeId: selectedUser?.id,
        type: "image",
        image: imageLocation.data,
        message: description,
      });
      attachmentRef.current = null;
      setImage("");
      setDescription("");
      onClose();
    } else {
      console.log("text");
      send({
        senderId: user.id,
        sendeeId: selectedUser?.id,
        type: "text",
        message,
      });
      setMessage("");
    }
  };

  if (selectedUser) {
    return (
      <Box id={styles.inputContainer}>
        <Box id={styles.picker} className={showEmoji && styles.active}>
          <EmojiPicker
            ref={ref}
            onEmojiClick={(e, chosenEmoji) => {
              setMessage(message + chosenEmoji.emoji);
            }}
            disableAutoFocus={true}
            native
          />
        </Box>
        <Box id={styles.input}>
          <Textarea
            variant="unstyled"
            value={message}
            onChange={changeMessage}
            placeholder="Type message..."
          ></Textarea>

          <Box>
            <Box>
              <label ref={iconRef} onClick={() => setShowEmoji(!showEmoji)}>
                <IoHappyOutline  />
              </label>
              <label htmlFor="attach">
                <IoAttachOutline />
              </label>
              <input
                ref={attachmentRef}
                accept="image/*"
                hidden
                id="attach"
                type="file"
                onChange={changeImage}
              />
            </Box>
            <Button variant="primary" disabled={!message} onClick={sendMessage}>
              <FiSend />
            </Button>
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent color="gray.200" bg="gray.700">
            <ModalBody id={styles.imageModal}>
              <Image src={image} alt="Image" />
              <Flex my="5px" position="relative" align="center">
                <Input
                  variant="flushed"
                  placeholder="Type message"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <label onClick={() => setShowEmojiForAttachment(() => setShowEmoji(!showEmojiForAttachment))}>
                  <IoHappyOutline />
                </label>
                <Box id={styles.pickerForAttachment} className={showEmojiForAttachment && styles.active}>
                  <EmojiPicker
                    onEmojiClick={(e, chosenEmoji) => {
                      setDescription(description + chosenEmoji.emoji);
                    }}
                    disableAutoFocus={true}
                    native
                  />
                </Box>
              </Flex>
              <Flex my="5px" justify="space-between">
                <Button variant="primary" mr={4} onClick={onClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={sendMessage}>
                  Send
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  }

  return null;
};

export default DirectInput;
