import {
  Box,
  Flex,
  HStack,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  useDisclosure,
  UnorderedList,
  ListItem
} from "@chakra-ui/react";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import React, { useState, useEffect } from "react";

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

  // State variable and setter for hexathons
  const [hexathons, setHexathons] = useState<any[]>([]);
  
  const getHexathons = async () => {
    try {
      // fetches all hexathons
      const response = await axios.get(apiUrl(Service.HEXATHONS, "/hexathons"));
      const allHexathons = response.data;
      // fetches all applications for the specific user for each hexathon
      // uses Promise for series of async calls
      const userApps = await Promise.all(allHexathons.map(async (hexathon: any) => {
        const res = await axios.get(apiUrl(Service.REGISTRATION, "/applications"), {
          params: {
            hexathon: hexathon.id,
            userId: props.user.userId
          }
        });
        // returns hexathon if user has applied
        return res.data.length > 0 ? hexathon : null;
      }));
      // filters for non-null hexathons
      const filteredHexathons = userApps.filter((hexathon) => hexathon !== null);
      setHexathons(filteredHexathons);

    } catch (error) {
      console.error("Error: " + error);
    }

  }

  useEffect(() => {
    if (props.isOpen) {
      getHexathons();
    }
  }, [props.isOpen]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text><strong>Name:</strong> {`${props.user.name.first} ${props.user.name.last}`}</Text>
          <Text><strong>Email:</strong> {props.user.email}</Text>
          <Text><strong>Phone Number:</strong> {props.user.phoneNumber || "Not provided"}</Text>
          <Text><strong>User ID:</strong> {props.user.userId}</Text>
          <Box>
            <Text fontWeight="bold" mb={2}>Applied Hexathons:</Text>
            { hexathons.length > 0  ?
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
        <ModalFooter>
          <Button onClick={props.onClose}>Close</Button>
        </ModalFooter>
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