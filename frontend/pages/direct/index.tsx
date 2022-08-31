import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useAppSelector } from "../../store/hooks";
import {
  useGetDirectMessagesQuery,
  useGetDirectRoomsQuery,
} from "../../store/api/directApi";

import type { NextPage } from "next";
import type { HeaderProps } from "../../components/direct/header";
import type { UserListProps } from "../../components/direct/userlist";
import type { DirectInputProps } from "../../components/direct/input";
import type { MessageListProps } from "../../components/direct/messagelist";

import Header from "../../components/direct/header";
import Sidebar from "../../components/direct/sidebar";
import UserList from "../../components/direct/userlist";
import MessageList from "../../components/direct/messagelist";

import {
  Flex,
  useDisclosure,
  useMediaQuery,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import styles from "../../styles/pages/direct.module.scss";

import axios from "axios";

const DirectInput = dynamic<DirectInputProps>(
  () => import("../../components/direct/input"),
  {
    ssr: false,
  }
);

interface DirectProps {
  initialUser: {
    id: string;
    name: string;
    avatar: string;
  } | null;
}

const Direct: NextPage<DirectProps> = ({ initialUser }) => {
  const user = useAppSelector((state) => state.user);
  const [ selectedUser, selectUser ] = useState<any>(initialUser);
  const [ isExpanded, setExpanded ] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isLargerThan600 ] = useMediaQuery("(min-width: 600px)");
  const { data: rooms } = useGetDirectRoomsQuery();
  const { data: messages } = useGetDirectMessagesQuery(
    {
      roomId: selectedUser?.id,
      userId: user.id,
    },
    {
      skip: !selectedUser,
    }
  );

  const handleBack = () => {
    onClose();
    selectUser(null);
  }

  const initExists = (): boolean => {
    if (selectedUser && rooms) {
      const list = rooms.map((room) => room.userId);
      const exists = list.includes(selectedUser.id);
      return exists;
    }
    return false;
  };

  const userListProps: UserListProps = {
    selectUser,
    selectedUser,
    initExists,
    setExpanded,
  };

  const headerProps: HeaderProps = {
    selectedUser,
    onClose: handleBack
  };

  const messageListProps: MessageListProps = {
    messages,
  };

  const inputProps: DirectInputProps = {
    selectedUser,
  };

  useEffect(() => {
    if (selectedUser) {
      onOpen();
    } else {
      onClose();
    }
  }, [selectedUser, onOpen, onClose]);

  return (
    <Flex id={styles.container}>
      {isLargerThan600 ? (
        <Sidebar expand={isExpanded}>
          <UserList {...userListProps} />
        </Sidebar>
      ) : (
        <UserList {...userListProps} />
      )}

      {isLargerThan600 ? (
        <Flex id={styles.main}>
          <Header {...headerProps} />
          <MessageList {...messageListProps} />
          <DirectInput {...inputProps} />
        </Flex>
      ) : (
        <Drawer onClose={handleBack} isOpen={isOpen} size={"full"}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody p={0}>
              <Flex id={styles.main}>
                <Header {...headerProps} />
                <MessageList {...messageListProps} />
                <DirectInput {...inputProps} />
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Flex>
  );
};

export async function getServerSideProps(context: any) {
  const { query } = context;
  if (query.id) {
    const response = await axios.get(
      `https://confserver1.herokuapp.com/direct/user/${query.id}`
    );

    return {
      props: {
        initialUser: response.data,
      },
    };
  }
  return {
    props: {
      initialUser: null,
    },
  };
}

export default Direct;
