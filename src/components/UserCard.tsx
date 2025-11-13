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
  TextDecorationProps,
  Link,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { apiUrl, Service } from "@hex-labs/core";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
      <UserModal user={props.user} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const UserModal: React.FC<{
  user: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ user, isOpen, onClose }) => {
  const {
    isOpen: isHexOpen,
    onOpen: onHexOpen,
    onClose: onHexClose,
  } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`${user.name.first} ${user.name.last}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              <strong>Email:</strong>{" "}
              <Link href={`mailto:${user.email}`} color="blue.500">
                {user.email}
              </Link>
            </Text>
            <Text>
              <strong>Phone:</strong> {user.phoneNumber}
            </Text>
            <Text>
              <strong>User ID:</strong> {user.userId}
            </Text>
            <Text>
              <strong>Resume:</strong>{" "}
              {user.resume ? (
                // not quite sure how to get link to get resume?? but this is my attempt
                <Link
                  href={apiUrl(Service.FILES, `/files/${user.resume}`)}
                  color="blue.500"
                  isExternal
                >
                  View Resume
                </Link>
              ) : (
                "N/A"
              )}
            </Text>
            <Button mt={3} size="sm" colorScheme="blue" onClick={onHexOpen}>
              More Hackathons
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <UserHexathons user={user} isOpen={isHexOpen} onClose={onHexClose} />
    </>
  );
};

const UserHexathons: React.FC<{
  user: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ user, isOpen, onClose }) => {
  const [hexathons, setHexathons] = useState<any[]>([]);

  const userHackathons = async () => {
    const hexRes = await axios.get(apiUrl(Service.HEXATHONS, "/hexathons"));
    const hexathons = hexRes.data;
    const userApps = await Promise.all(
      hexathons.map(async (hexathon: any) => {
        const applicationsRes = await axios.get(
          apiUrl(Service.REGISTRATION, "/applications"),
          {
            params: {
              hexathon: hexathon.id,
              userId: user.userId,
            },
          }
        );
        return applicationsRes.data.length > 0 ? hexathon : null;
      })
    );
    setHexathons(userApps.filter((hexathon) => hexathon !== null));
  };

  useEffect(() => {
    if (isOpen) {
      userHackathons();
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hexathons Applied To:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {hexathons.length > 0 ? (
            hexathons.map((hex: any) => <Text key={hex.id}> {hex.name}</Text>)
          ) : (
            <Text>None</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserCard;
