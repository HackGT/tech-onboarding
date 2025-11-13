import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Stack,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import UserApplied from "./UserApplied";

interface User {
  userId: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phoneNumber?: string;
  resume?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const {
    isOpen: isAppliedOpen,
    onOpen: onAppliedOpen,
    onClose: onAppliedClose,
  } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {user ? (
              <Stack spacing={3}>
                <Text fontSize="lg" fontWeight="bold">
                  {user.name.first} {user.name.last}
                </Text>

                <Text>
                  <strong>Email:</strong>{" "}
                  <Link
                    href={`mailto:${user.email}`}
                    color="blue.500"
                    textDecoration="underline"
                  >
                    {user.email}
                  </Link>
                </Text>

                <Text>
                  <strong>Phone:</strong> {user.phoneNumber ?? "N/A"}
                </Text>

                <Text>
                  <strong>User ID:</strong> {user.userId}
                </Text>

                <Text>
                  <strong>Resume:</strong>{" "}
                  {user.resume ? (
                    <Link
                      href={user.resume}
                      isExternal
                      color="blue.500"
                      textDecoration="underline"
                    >
                      View Resume
                    </Link>
                  ) : (
                    <span style={{ color: "gray" }}>No Resume Found</span>
                  )}
                </Text>
              </Stack>
            ) : (
              <Text>No user selected.</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            {user && (
              <Button colorScheme="blue" onClick={onAppliedOpen}>
                View Applied
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UserApplied
        isOpen={isAppliedOpen}
        onClose={onAppliedClose}
        userId={user?.userId}
      />
    </>
  );
};

export default UserModal;
