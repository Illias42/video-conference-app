import { FC } from "react";
import { Flex, Image, Text, Button } from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi";
import styles from "../../../styles/pages/direct.module.scss";

export type HeaderProps = {
  selectedUser: any;
  onClose: () => void;
}

const Header: FC<HeaderProps> = ({
  selectedUser,
  onClose,
}) => {
    const [isLargerThan600] = useMediaQuery("(min-width: 600px)");

    return (<>
      {selectedUser &&   
        <Flex className={styles.roomHeader}>
          {!isLargerThan600 &&
            <Button onClick={onClose}>
              <HiArrowLeft />
            </Button>
          }
          <Image src={selectedUser.avatar ?? "/images/default_user.png"} alt="Avatar"/>
          <Text>{selectedUser.name}</Text>
        </Flex>
      }
    </>);
}

export default Header;