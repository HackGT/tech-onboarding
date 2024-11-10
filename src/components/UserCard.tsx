import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";

type Props = {
  user: any;
};

const UserCard: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hexathons, setHexathons] = useState<any[]>([]);

  // TODO: Create a modal that retrieves all of the hexathons that a user has an application for.
  // Function to fetch hexathons based on user applications
  const fetchUserHexathons = async () => {
    try {
      console.log(props.user.name.first, props.user.userId);

      // 1) Fetch all hexathons
      const hexathonsRes = await axios.get(
        apiUrl(Service.HEXATHONS, "/hexathons")
      );
      console.log("All hexathons", hexathonsRes.data);
      const allHexathons = hexathonsRes.data;

      // 2) Loop through all hexathons and fetch applications by hexathonId
      const userHexathons = await Promise.all(
        allHexathons.map(async (hexathon: any) => {
          const hexathonId = hexathon.id;

          // Query applications by hexathonId and userId
          console.log(
            "Request URL:",
            apiUrl(Service.REGISTRATION, "/applications"),
            {
              params: { hexathon: hexathonId, userId: props.user.userId },
            }
          );
          const res = await axios.get(
            apiUrl(Service.REGISTRATION, "/applications"),
            {
              params: { hexathon: hexathonId, userId: props.user.userId },
            }
          );

          console.log("User's hexathons", res.data);

          // Check if there are applications for this hexathon and return hexathon info if so
          if (res.data.applications && res.data.applications.length > 0) {
            return { id: hexathonId, name: hexathon.name };
          } else {
            return null;
          }
        })
      );

      // Filter out null results and update state
      setHexathons(userHexathons.filter((hexathon) => hexathon !== null));
    } catch (error) {
      console.error("Error fetching user's hexathons", error);
    }
  };

  // Resets hexathosn and closes modal
  const handleClose = () => {
    setHexathons([]); // Clear hexathons
    onClose(); // Close the modal
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
        cursor="pointer"
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

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${props.user.name.first} ${props.user.name.middle ? props.user.name.middle + " " : ""} ${props.user.name.last}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${props.user.email}`} color="blue.500">
                {props.user.email}
              </Link>
            </Text>
            <Text>
              <strong>Phone:</strong>{" "}
              {props.user.phoneNumber
                ? props.user.phoneNumber.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                  )
                : "N/A"}{" "}
            </Text>
            <Text>
              <strong>User ID:</strong> {props.user.userId}
            </Text>
            {/* Display hexathons the user applied to */}
            {hexathons.length > 0 && (
              <>
                <Text mt={4} fontWeight="bold">
                  Hexathons Applied:
                </Text>
                <ul>
                  {hexathons.map((hexathon) => (
                    <li key={hexathon.id}>{hexathon.name}</li>
                  ))}
                </ul>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={fetchUserHexathons}>
              Show Applied Hexathons
            </Button>
            <Button onClick={handleClose} ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserCard;
