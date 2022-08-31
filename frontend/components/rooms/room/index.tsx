import { FC } from "react";
import { Flex, Text, Link, Button } from "@chakra-ui/react";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export type RoomProps = {
  room: {
    id: string;
    name: string;
  };
};

const Room: FC<RoomProps> = ({ room: { id, name } }) => {
  return (
    <Flex key={id}>
      <Text mb="20px" fontSize="35px" color="gray.200">
        {name}
      </Text>
      <Link href={`/rooms/${name}?id=${id}`}>
        <Button variant="primary">Join</Button>
      </Link>
    </Flex>
  );
};

export const RoomSkeleton = () => {
  return (
    <Flex>
      <Text mb="20px" fontSize="35px">
        <Skeleton width="50%" />
      </Text>
      <Skeleton
        baseColor="#6A2176"
        highlightColor="#852a93"
        width="100%"
        height="40px"
      />
    </Flex>
  );
};

export default Room;
