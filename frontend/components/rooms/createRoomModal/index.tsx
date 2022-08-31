import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { FC } from "react";

export type CreateRoomProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
  changeRoomName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  create: () => void;
}

const CreateRoomModal: FC<CreateRoomProps> = ({
  isOpen,
  onClose,
  name,
  changeRoomName,
  create
}) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent color="gray.200" bg="gray.700">
          <ModalHeader textAlign="center">Create new room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              mb="20px"
              placeholder="Room name"
              value={name}
              variant="outline"
              onChange={changeRoomName}
            />
            <Button
              mb="10px"
              w="100%"
              variant="primary"
              isDisabled={!name}
              onClick={create}
            >
              Create
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
}

export default CreateRoomModal;