import {
  Box,
  Flex,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import React, { useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";

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
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [hexathons, setHexathons] = useState<any[]>([]);

  const fetchHexathons = async () => {
    try {
      const response = await axios.get(apiUrl(Service.HEXATHONS, "/hexathons"));
      const hexathons = response.data;

      const applications = await Promise.all(
        hexathons.map(async (hexathon: any) => {
          const userApplications = await axios.get(
            apiUrl(Service.REGISTRATION, "/applications"),
            {
              params: {
                userId: props.user.userId,
                hexathon: hexathon.id,
              },
            }
          );
          if (userApplications.data.applications.length > 0) {
            return hexathon;
          } else {
            return null;
          }
        })
      );
      setHexathons(applications.filter((hexathon) => hexathon != null));
    } catch (error) {
      console.log("Error fetching hexathons: ", error);
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
        onClick={onOpen}
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
            {props.user.email}
          </Text>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <p>
              <a href="https://resumegenius.com/resume-samples">
                {props.user.name.first} {props.user.name.last}
              </a>
            </p>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Email:{" "}
              <a href={`mailto:${props.user.email}`} style={{ color: "blue" }}>
                {props.user.email}
              </a>
            </p>
            <p>Phone numebr: {props.user.phoneNumber}</p>
            <p>ID: {props.user.userId}</p>
            <p>Hexathons applied: </p>
            <ul>
              {hexathons.map((hexathon, key) => (
                <li key={key}>{hexathon.name}</li>
              ))}
            </ul>
          </ModalBody>

          <ModalFooter>
            <Button onClick={fetchHexathons}>Fetch hexathons</Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserCard;
