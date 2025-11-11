import {
  Box,
  Button,
  Code,
  Flex,
  HStack,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

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
  const [hexathons, setHexathons] = useState<any[]>([]);
  
  const getHexathons = async () => {
    const res = await axios.get(apiUrl(Service.HEXATHONS, "/hexathons"));
    const hexathons = res.data;
    const userApps = await Promise.all(hexathons.map(async (hexathon: any) => {
      const res = await axios.get(apiUrl(Service.REGISTRATION, "/applications"), {
        params: {
          hexathon: hexathon.id,
          userId: props.user.userId
        }
      });
      return res.data.length > 0 ? hexathon : null;
    }));
    setHexathons(userApps.filter((hexathon) => hexathon !== null));
  }

  useEffect(() => {
    if (props.isOpen) {
      getHexathons();
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>User Details</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Text><strong>Name:</strong> {`${props.user.name.first} ${props.user.name.last}`}</Text>
          <Text><strong>Email:</strong> {props.user.email}</Text>
          <Text><strong>Phone Number:</strong> {props.user.phoneNumber}</Text>
          <Text><strong>User ID:</strong> <Code>{props.user.userId}</Code></Text>
          <Box>
            <Text><strong>Applied Hexathons:</strong></Text>
            { hexathons.length > 0?
            (<UnorderedList>
              {hexathons.map((hexathon) => (
                <ListItem key={hexathon.id}>
                  {hexathon.name}
                </ListItem>
              ))}
            </UnorderedList>) : <Text>No hexathons applied</Text>
            }
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
    <Box
    borderWidth="1px"
    rounded="lg"
    boxShadow="lg"
    height="175px"
    fontWeight="bold"
    alignItems="center"
    onClick={onOpen}
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
    <UserModal isOpen={isOpen} onClose={onClose} user={props.user} />
    </>
  );
};

export default UserCard;