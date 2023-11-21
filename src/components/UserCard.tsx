import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";

type User = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  phoneNumber: string;
  userId: string;
  // Add other user properties as needed
};

type UserCardProps = {
  user: User;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        boxShadow="lg"
        height="175px"
        fontWeight="bold"
        alignItems="center"
        onClick={openModal}
        cursor="pointer"
      >
        <Flex padding="2">
          <HStack align="flex-end" justify="space-between">
            <Text fontSize="xl">{`${user.name.first} ${user.name.last} \n`}</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold" mt="2">
            {user.email}
          </Text>
        </Flex>
      </Box>

      <UserModal isOpen={isModalOpen} onClose={closeModal} user={user} />
    </>
  );
};

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Name: {`${user.name.first} ${user.name.last}`}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Phone Number: {user.phoneNumber}</Text>
            <Text>User ID: {user.userId}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
} 
;

export default UserCard;

// TODO: right now, the UserCard only displays the user's name and email. Create a new modal component <UserModal> that
// pops up when the card is clicked. In this modal, list all the user's information including name, email, phoneNumber,
// and userId. 

// TODO: Explore if you can display the email as a link to the user's email that will open up the user's 
// email client and start a new email to that user. Also explore if you can provide a link to the user's resume.

// TODO: In our database structure, every user has a userId that is unique to them. This is the primary key of the user
// and is referenced in their applications to all of our hexathons. Create a button that when clicked, will retrieve all of
// the hexathons that the user has applied to. You can use the /applications endpoint of the registration service to do this
// and the /hexathons endpoint of the hexathons service to get a list of all the hexathons.