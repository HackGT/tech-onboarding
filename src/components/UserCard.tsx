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
  ModalCloseButton,
  Link,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hexathons, setHexathons] = useState<any[]>([]);

  const cardClick = () => {
    setIsModalOpen(true);
  };

  const closeCard = () => {
    setIsModalOpen(false);
  };

  const emailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleViewHexathons = async () => {
    try {
      const response = await axios.get(`/api/applications?userId=${props.user.userId}`);
      const applications = response.data.data;
      const hexathonIds = applications.map((application: any) => application.hexathonId);
      const hexathonsResponse = await axios.get(`/api/hexathons?ids=${hexathonIds.join(",")}`);
      const userHexathons = hexathonsResponse.data.data;
      setHexathons(userHexathons);
    } catch (error) {
      console.error("Error fetching user hexathons:", error);
    }
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
    cursor="pointer"
    onClick={cardClick}
    >
      <Flex padding="2" flexDirection="column">
        <HStack align="flex-end" justify="space-between">
          <Text fontSize="xl">{`${props.user.name.first} ${props.user.name.last}`}</Text>
        </HStack>
        <Text 
          fontSize="sm"
          fontWeight="semibold" 
          justifyContent="justify" 
          mt="2"
        >
        <Link color="blue.500" textDecoration="underline" onClick={() => emailClick(props.user.email)}>
          {props.user.email}
        </Link>
        </Text>
      </Flex>
    </Box>

    <Modal isOpen={isModalOpen} onClose={closeCard} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="xl" mb="2">{`${props.user.name.first} ${props.user.name.last}`}</Text>
          <Text fontSize="sm" fontWeight="semibold" mb="2">
            <Link color="blue.500" textDecoration="underline" onClick={() => emailClick(props.user.email)}>
              {props.user.email}
            </Link>
          </Text>
          <Text fontSize="sm" fontWeight="semibold">{props.user.phoneNumber}</Text>
          <Text fontSize="sm" fontWeight="semibold">{`User ID: ${props.user.userId}`}</Text>
          {props.user.resume && (
            <>
              <Text fontSize="sm" fontWeight="semibold" mt="2">
                <Link
                  color="blue.500"
                  href={props.user.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  textDecoration="underline"
                >
                  View Resume
                </Link>
              </Text>
              <Button mt="4" colorScheme="blue" onClick={handleViewHexathons}>
                View Applied Hexathons
              </Button>
            </>
          )}
          {hexathons.length > 0 && (
            <>
              <Text fontSize="lg" fontWeight="bold" mt="4">
                Applied Hexathons:
              </Text>
              {hexathons.map(hexathon => (
                <Text key={hexathon.id} fontSize="sm">
                  {hexathon.name}
                </Text>
              ))}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>

  </>
  );
};

export default UserCard;