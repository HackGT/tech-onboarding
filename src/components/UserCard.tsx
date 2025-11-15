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
  Link,
  Button
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

type Props = {
  user: any;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
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

const UserModal: React.FC<ModalProps> = (props: ModalProps) => {  
  const [hexathons, setHexathons] = useState<any>(null);
  const getHexathons = async () => {
    const res = await axios.get(apiUrl(Service.HEXATHONS, `/hexathons`));
    const data = res.data;
    const applications = await Promise.all(data.map(async (hexathon: any) => {
      const app = await axios.get(apiUrl(Service.REGISTRATION, '/applications'), { params: {
        hexathon: hexathon.id, userId: props.user.userId
      }});
      return { hexathon, application: app.data };
    }));
    setHexathons(applications.filter((item: any) => item !== null));
  };
    return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${props.user.name.first} ${props.user.name.last}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Email: <Link href={`mailto:${props.user.email}`}>{props.user.email}</Link></Text>
          <Text>Phone: {props.user.phoneNumber}</Text>
          <Text>User ID: {props.user.userId}</Text>
          <Button mt="4" onClick={getHexathons}>Get Applied Hexathons</Button>
          {hexathons && (
            <Box mt="4">
              {hexathons.map((item: any) => (
                <Text key={item.hexathon.id}>{item.hexathon.name}</Text>
              ))}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};

const UserCard: React.FC<Props> = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);


  return (
    <>
    <Box
    borderWidth="1px"
    rounded="lg"
    boxShadow="lg"
    height="175px"
    fontWeight="bold"
    alignItems="center"
    onClick={() => setIsModalOpen(true)} 
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
    </Box>
    <UserModal isOpen={isModalOpen} onClose={onClose} user={props.user} />
    </>
  );
};

export default UserCard;