import React, { useState } from "react";
import {apiUrl, Service } from "@hex-labs/core";
import {
  Box,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Link,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

type User = {
  name: {
    first: string;
    last: string;
  };
  email: string;
  phoneNumber: string;
  userId: string;
  resume: string;
};
// TODO: right now, the UserCard only displays the user's name and email. Create a new modal component <UserModal> that
// pops up when the card is clicked. In this modal, list all the user's information including name, email, phoneNumber,
// and userId. 
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
        <VStack padding="2">
          <HStack align="flex-end" justify="space-between">
            <Text fontSize="xl">{`${user.name.first} ${user.name.last} \n`}</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="semibold" mt="2">
            {user.email}
          </Text>
        </VStack>
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
// TODO: Explore if you can display the email as a link to the user's email that will open up the user's 
// email client and start a new email to that user. Also explore if you can provide a link to the user's resume.
const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Name: {`${user.name.first} ${user.name.last}`}</Text>
            <Text>Email: <Link href={`mailto:${user.email}`}>{user.email}</Link></Text>
            <Text>Phone Number: {user.phoneNumber}</Text>
            <Text>User ID: {user.userId}</Text>
            <Text>Resume: <Link href={apiUrl(Service.FILES, `/files/${user.resume}/view`)} isExternal>View Resume</Link></Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
};
export default UserCard;


// TODO: In our database structure, every user has a userId that is unique to them. This is the primary key of the user
// and is referenced in their applications to all of our hexathons. Create a button that when clicked, will retrieve all of
// the hexathons that the user has applied to. You can use the /applications endpoint of the registration service to do this
// and the /hexathons endpoint of the hexathons service to get a list of all the hexathons.