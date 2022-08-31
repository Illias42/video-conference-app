import { FC, useState } from "react";
import { Box, Flex, Text, Image, Button, Input } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import UserSearchResults from "./searchResults";
import dayjs from "dayjs";
import styles from "../../../styles/pages/direct.module.scss";
import useDebounce from "../../../hooks/useDebounce";
import { useGetDirectRoomsQuery } from "../../../store/api/directApi";
import Skeleton from "react-loading-skeleton";

export type UserListProps = {
  selectedUser: any;
  selectUser: (user: any) => void;
  initExists: () => boolean;
  setExpanded: (expanded: boolean) => void;
  width?: number;
};

const UserList: FC<UserListProps> = ({
  selectedUser,
  selectUser,
  initExists,
  setExpanded,
  width,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const expanded = () => {
    if (width) {
      if (width > 80) {
        return true;
      }
      return false;
    }
    return true;
  }

  const { data: rooms, isLoading } = useGetDirectRoomsQuery();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box id={styles.userList}>
      <Box className={styles.search}>
        {expanded() ? (
          <Box>
            <BsSearch />
            <Input
              placeholder="Search"
              variant="outline"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Box>
        ) : (
          <Button variant="unstyled" onClick={() => {
            setExpanded(true)
          }}>
            <BsSearch />
          </Button>
        )}
      </Box>

      {searchTerm.length && expanded() ? (
        <UserSearchResults
          selectUser={selectUser}
          searchTerm={debouncedSearchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <>
          {isLoading  ? (
            <>
              {[...Array(10)].map((_, i) => (
                <Flex
                  key={i}
                  className={styles.room}
                >
                  <Skeleton width={50} height={50} style={{borderRadius: "50%", marginRight: "15px"}} />
                  {expanded() && (
                    <Box w="100%">
                      <Skeleton width="30%" />
                      <Skeleton width="100%" />
                    </Box>
                  )}
                </Flex>
              ))}
            </>
          ) : (
            <>
              {selectedUser && !initExists() && (
                <Flex
                  key={selectedUser.id}
                  id={styles.active}
                  className={styles.room}
                >
                  <Image src={selectedUser.avatar ?? "/images/default_user.png"} alt="Avatar" />
                  <Text>{selectedUser.name}</Text>
                </Flex>
              )}

              {rooms ? 
                rooms.map((room: any) => 
                  <Flex
                    key={room.id}
                    id={selectedUser?.id === room.user.id ? styles.active : ""}
                    onClick={() => {
                      if (!selectedUser) {
                        setExpanded(false);
                      }
                      selectUser(room.user);
                    }}
                    className={styles.room}
                  >
                    <Image src={room.user.avatar ?? "/images/default_user.png"} alt="Avatar" />
                    {expanded() && (
                      <Box w="100%">
                        <Flex justify="space-between" align="center">
                          <Text noOfLines={1}>{room.user.name}</Text>
                          <Text fontSize="10px" color="gray.600">
                            {dayjs(room.lastMessage.createdAt).format("h:mm a")}
                          </Text>
                        </Flex>
                        <Text
                          noOfLines={1}
                          w="50%"
                          fontSize="14px"
                          color="gray.500"
                        >
                          {room.lastMessage.text}
                        </Text>
                      </Box>
                    )}
                  </Flex>
                
              ) : (
                <Flex justify="center" align="center" h="90%">
                  {expanded() ? <Text>No one here yet</Text> : <></>}
                </Flex>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};


export default UserList;
