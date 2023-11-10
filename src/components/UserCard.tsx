import { Link, Box, Flex, HStack, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from 'axios';


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

  const [isOpen, setIsOpen] = useState(false);
  const [hexathons, setHexathons] = useState<any[]>([]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const fetchHexathons = async () => {
    try {
      const applicationsResponse = await axios.get(`/api/applications?userId=${props.user.userId}`);
      const applications = applicationsResponse.data.data;
      const hexathonIds = applications.map((application: any) => application.hexathonId);
      const hexathonsResponse = await axios.get(`/api/hexathons?ids=${hexathonIds.join(",")}`);
      setHexathons(hexathonsResponse.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
      <Flex padding="2" flexDirection="column">
        <HStack align="flex-end" justify="space-between">
          <Text fontSize='xl'>{`${props.user.name.first} ${props.user.name.last}`}</Text>
        </HStack>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          justifyContent="justify"
          mt="2"
        >
          {props.user.email}
        </Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Name: {`${props.user.name.first} ${props.user.name.last}`}</Text>
            <Text>Email: <Link href={`mailto:${props.user.email}`} color="teal.500">{props.user.email}</Link></Text>
            <Text>Phone Number: {props.user.phoneNumber}</Text>
            <Text>User ID: {props.user.userId}</Text>
            <Button onClick={fetchHexathons}>Fetch Hexathons</Button>
            {hexathons.map((hexathon) => (
              <Text key={hexathon.id}>{hexathon.name}</Text>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default UserCard;