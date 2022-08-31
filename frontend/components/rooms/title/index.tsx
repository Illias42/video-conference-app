import { FC } from 'react';
import { Text, Box, Button, useMediaQuery } from '@chakra-ui/react';
import { BsReverseLayoutSidebarReverse } from 'react-icons/bs';
import styles from "../../../styles/pages/room.module.scss";

export type TitleProps = {
  title: string;
  onOpen: () => void;
}

const Title: FC<TitleProps> = ({ 
  title,
  onOpen
}) => {
    const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

    return (
      <Box id={styles.title}>
        <Text color="gray.200">{title}</Text>
        {!isLargerThan900 &&
          <Button variant="ghost" onClick={onOpen}>
            <BsReverseLayoutSidebarReverse />
          </Button>
        }
      </Box>
    );
}

export default Title;