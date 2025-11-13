import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Link,
  Button,
  Text,
} from "@chakra-ui/react";

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApplicationsOpen: () => void;
  user: any;
};

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onApplicationsOpen,
  user,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${user.name.first} ${user.name.last}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            <b>Email: </b>
            <Link color="blue.500" href={`mailto:${user.email}`}>
              {user.email}
            </Link>
          </Text>
          <Text>
            <b>Phone: </b>{" "}
            {user.phoneNumber
              ? user.phoneNumber.slice(0, 3) +
                "-" +
                user.phoneNumber.slice(3, 6) +
                "-" +
                user.phoneNumber.slice(6)
              : "N/A"}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              onClose();
              onApplicationsOpen();
            }}
          >
            Open Applications
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserModal;
