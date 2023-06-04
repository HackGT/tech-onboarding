import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";

type cardValues = {
  user: any;
  isOpen: boolean;
  onClose: () => void;
};

export const UserModal: React.FC<cardValues> = ({
  user,
  isOpen,
  onClose,
}: cardValues) => {
  var emailLink = "mailto:" + user.email;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex padding="2" flexDirection="column">
            <HStack align="flex-end" justify="space-between">
              <Text
                fontSize="xl"
                as="b"
              >{`${user.name.first} ${user.name.last}`}</Text>
            </HStack>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              justifyContent="justify"
              mt="2"
            >
              <a href={emailLink}>{user.email}</a>
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              justifyContent="justify"
              mt="2"
            >
              {user.phoneNumber}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              justifyContent="justify"
              mt="2"
            >
              User ID: {user.userId}
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          {/* <Button colorScheme="blue" mr={3} onClick={sortUsers}>
            Sort
          </Button> */}
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
