import { Flex, Box, Image, Text } from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import { useSearchUserQuery } from "../../../store/api/directApi";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "../../../styles/pages/direct.module.scss";

type UserSearchResultsProps = {
  selectUser: any;
  searchTerm: string;
  setSearchTerm: any;
};

const UserSearchResults: FC<UserSearchResultsProps> = ({
  selectUser,
  searchTerm,
  setSearchTerm
}) => {
  const [filteredSearchTerm, setFilteredSearchTerm] =
    useState<string>(searchTerm);
  const { data, error, isLoading, isFetching } =
    useSearchUserQuery(filteredSearchTerm);

  useEffect(() => {
    if (searchTerm.length > 1) {
      setFilteredSearchTerm(searchTerm);
    }
  }, [searchTerm]);

  if (error) {
    return <div className="text-hint">Error</div>;
  }

  if (isLoading || isFetching) {
    return <>
    {[...Array(10)].map((_, i) => (
      <Flex
          align="center"
          key={i}
          className={styles.room}
        >
          <Skeleton height={50} width={50} style={{borderRadius: "50px", marginRight: "15px"}} />
          <Box w="70%">
            <Flex justify="space-between" align="center">
              <Skeleton width={40} />
            </Flex>
            <Skeleton width="100%" />
          </Box>
        </Flex>
    ))}
    </>;
  }

  return (
    <div id={styles.searchResults}>
      {data?.local.map((user) => (
        <Flex
          key={user.id}
          onClick={() => {
            selectUser(user)
            setSearchTerm("")
          }}
          className={styles.room}
        >
          <Image src={user.avatar ?? "/images/default_user.png"} alt="Avatar" />
          <Box w="70%">
            <Flex justify="space-between" align="center">
              <Text>{user.name}</Text>
              {/* <Text fontSize="10px" color="gray.600">
                {dayjs(room.lastMessage.createdAt).format("h:mm a")}
              </Text> */}
            </Flex>
            <Text noOfLines={1} w="50%" fontSize="14px" color="gray.500">
              {/* {lastMessage.text} */}
            </Text>
          </Box>
        </Flex>
      ))}
      {data?.global.length ? <p>Global search</p> : <></>}
      {data?.global.map((user) => (<>
        <Flex
          key={user.id}
          onClick={() => {
            selectUser(user)
            setSearchTerm("")
          }}
          className={styles.room}
        >
          <Image src={user.avatar ?? "/images/default_user.png"} alt="Avatar" />
            <Box w="70%">
            <Flex justify="space-between" align="center">
              <Text>{user.name}</Text>
            </Flex>
          </Box>
        </Flex>
      </>))}
    </div>
  );
};

export default UserSearchResults;
