import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button
} from "@chakra-ui/react";

// Define the UserCard component's prop types
type Props = {
  user: {
    name: {
      first: string;
      last: string;
    };
    email: string;
    phoneNumber: string;
    userId: string;
    // Add other user properties as needed
  };
};

const UserCard: React.FC<Props> = ({ user }) => {
  // State to control the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch hexathons for the user (to be implemented)
  const fetchHexathons = async (userId: string) => {
    // Implementation depends on your API
    // Example: axios.get(`/api/hexathons?userId=${userId}`)
  };

  // UserModal component definition
  type UserModalProps = {
    isOpen: boolean;
    onClose: () => void;
  };

  const UserModal = ({ isOpen, onClose }: UserModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${user.name.first} ${user.name.last}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Email: <a href={`mailto:${user.email}`}>{user.email}</a></Text>
          <Text>Phone: {user.phoneNumber}</Text>
          <Text>User ID: {user.userId}</Text>
          {/* Display other user details or link to the resume here */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => fetchHexathons(user.userId)}>
            View Hexathons
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      boxShadow="lg"
      height="175px"
      fontWeight="bold"
      alignItems="center"
      onClick={() => setIsModalOpen(true)} // Open the modal when the box is clicked
    >
      <Flex padding="2" flexDirection="column">
        <HStack align="flex-end" justify="space-between">
          <Text fontSize='xl'>{`${user.name.first} ${user.name.last}`}</Text>
        </HStack>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          justifyContent="justify"
          mt="2"
        >
          {user.email}
        </Text>
      </Flex>

      {/* Render the UserModal */}
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};

export default UserCard;
