import {
  Box,
  Flex,
  HStack,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  user: any;
};


// TODO: right now, the UserCard only displays the user's name and email. Create a new modal component <UserModal> that
// pops up when the card is clicked. In this modal, list all the user's information including name, email, phoneNumber,
// and userId. 

// TODO: Explore if you can display the email as a link to the user's email that will open up the user's 
// email client and start a new email to that user. Also explore if you can provide a link to the user's resume.

// TODO: In our database structure, every user has a userId that is unique to them. This is the primary key of the user
// and is referenced in their applications to all of our hexathons. Create a button that when clicked, will retrieve all of
// the hexathons that the user has applied to. You can use the /applications endpoint of the registration service to do this
// and the /hexathons endpoint of the hexathons service to get a list of all the hexathons.
const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openUserModal = () => {
    onOpen();
  };

  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
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
        onClick={openUserModal}
        cursor="pointer"
      >
        <Flex padding="2" flexDirection="column">
          <HStack align="flex-end" justify="space-between">
            <Text fontSize="xl">{`${props.user.name.first} ${props.user.name.last}`}</Text>
          </HStack>
          <Link
            fontSize="sm"
            fontWeight="semibold"
            justifyContent="justify"
            mt="2"
            onClick={(e) => e.stopPropagation()} // Prevent modal from opening when link is clicked
            href={`mailto:${props.user.email}`} // Opens user's email client to compose a new email
          >
            {props.user.email}
          </Link>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${props.user.name.first} ${props.user.name.last}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Email: {props.user.email}</Text>
            <Text>Phone Number: {props.user.phoneNumber}</Text>
            <Text>User ID: {props.user.userId}</Text>
            {/* Additional user information can be displayed here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserCard;