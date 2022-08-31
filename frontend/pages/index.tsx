import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";

import { useGetRoomsQuery, useSearchRoomsQuery, useCreateRoomMutation } from "../store/api/roomsApi";

import useDebounce from "../hooks/useDebounce";

import styles from "../styles/pages/rooms.module.scss";
import { IoMdAdd } from "react-icons/io";
import {
  Input,
  Button,
  Text,
  Flex,
  useDisclosure
} from "@chakra-ui/react";
import CreateRoomModal from "../components/rooms/createRoomModal";
import type { CreateRoomProps } from "../components/rooms/createRoomModal";
import { RoomSkeleton } from "../components/rooms/room";

const Rooms: NextPage = () => {
  const [ name, setName ] = useState<string>();
  const { data: rooms = [], isLoading } = useGetRoomsQuery();
  const [ createRoom ] = useCreateRoomMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: foundRooms } = useSearchRoomsQuery(debouncedSearchTerm);

  async function create() {
    await createRoom({ name: name }).unwrap();
    setName("");
    onClose();
  }

  async function changeRoomName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const createRoomProps: CreateRoomProps = {
    isOpen,
    onClose,
    name,
    changeRoomName,
    create,
  };

  return (
    <Flex id={styles.container}>
      <Flex color="gray.100">
        <Input variant="outline" placeholder="Search room..." onChange={handleSearch} />
      </Flex>
      <Flex className={styles.rooms}>
        {isLoading ? (
          <>
            {[...Array(10)].map((_, i) => (
              <RoomSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {!foundRooms && rooms &&
              rooms.map((room) => (
                <Flex className={styles.room} key={room.id}>
                  <Text mb="20px" fontSize="35px" color="gray.200">
                    {room.name}
                  </Text>
                  <Link href={`/rooms/${room.name}?id=${room.id}`}>
                    <Button variant="primary">Join</Button>
                  </Link>
                </Flex>
              ))}

            {foundRooms &&
              foundRooms.map((room) => (
                <Flex className={styles.room} key={room.id}>
                  <Text mb="20px" fontSize="35px" color="gray.200">
                    {room.name}
                  </Text>
                  <Link href={`/rooms/${room.name}?id=${room.id}`}>
                    <Button variant="primary">Join</Button>
                  </Link>
                </Flex>
              ))}
          </>
        )}
      </Flex>

      <Button id={styles.createBtn} variant="primary" onClick={onOpen}>
        <IoMdAdd size="40px" color="#fff" />
      </Button>

      <CreateRoomModal {...createRoomProps} />
    </Flex>
  );
};

export default Rooms;
